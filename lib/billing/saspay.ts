// ============================================================================
// SUPER4C2 — SASPAY PAYMENT CLIENT & WEBHOOK HANDLER
// ============================================================================
// Documentation: https://docs.saspay.me / Base URL: https://api.saspay.me/api/v1
// Support: Mobile Money (MTN MoMo, Orange Money, Wave, Moov) & Cards
// ============================================================================

import crypto from "crypto";

const SASPAY_BASE_URL = process.env.SASPAY_BASE_URL || "https://api.saspay.me/api/v1";
const SASPAY_SECRET_KEY = process.env.SASPAY_SECRET_KEY || "sk_test_demo_super4c2";
const SASPAY_WEBHOOK_SECRET = process.env.SASPAY_WEBHOOK_SECRET || "";

export interface SasPayCustomer {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface SasPayCreateCheckoutSessionParams {
  amount: number | string; // Handled as decimal string e.g. "15000.00"
  currency: "XAF" | "XOF" | "USD" | "EUR";
  description: string;
  customerEmail: string;
  customerName: string;
  returnUrl: string;
  idempotencyKey?: string;
  metadata?: Record<string, unknown>;
}

export interface SasPayCheckoutSessionResponse {
  success: boolean;
  data: {
    id: string;
    slug: string;
    checkout_url: string;
    status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
  };
  code: number;
}

export interface SasPaySoftpayParams {
  amount: number | string;
  currency: "XAF" | "XOF";
  country: string; // "BJ", "CI", "SN", "CM", etc.
  network: string; // "mtn_cm", "orange_cm", "mtn_bj", "orange_ci", "wave_ci"
  description: string;
  customer: {
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
  idempotencyKey?: string;
}

export interface SasPayVerifyPaymentResponse {
  success: boolean;
  data: {
    id: string;
    status: "SUCCESS" | "PENDING" | "FAILED";
    message: string;
    net_amount?: string;
    currency?: string;
  };
  code: number;
}

/**
 * Creates a hosted checkout session on SasPay.
 * Redirect customer to checkout_url.
 */
export async function createSasPayCheckoutSession(
  params: SasPayCreateCheckoutSessionParams
): Promise<SasPayCheckoutSessionResponse> {
  const formattedAmount =
    typeof params.amount === "number" ? params.amount.toFixed(2) : params.amount;

  const idempotencyKey = params.idempotencyKey || crypto.randomUUID();

  const response = await fetch(`${SASPAY_BASE_URL}/checkout-sessions/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SASPAY_SECRET_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      amount: formattedAmount,
      currency: params.currency,
      description: params.description,
      customer_email: params.customerEmail,
      customer_name: params.customerName,
      return_url: params.returnUrl,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`SasPay API error (${response.status}): ${errorBody}`);
  }

  return response.json();
}

/**
 * Initiates direct Softpay (USSD / push notification on candidate's phone)
 */
export async function initiateSasPaySoftpay(params: SasPaySoftpayParams) {
  const formattedAmount =
    typeof params.amount === "number" ? params.amount.toFixed(2) : params.amount;
  const idempotencyKey = params.idempotencyKey || crypto.randomUUID();

  const response = await fetch(`${SASPAY_BASE_URL}/payments/softpay/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SASPAY_SECRET_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      amount: formattedAmount,
      currency: params.currency,
      country: params.country,
      network: params.network,
      description: params.description,
      customer: params.customer,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`SasPay Softpay error (${response.status}): ${errorBody}`);
  }

  return response.json();
}

/**
 * Verifies payment status directly with SasPay API
 */
export async function verifySasPayPayment(paymentId: string): Promise<SasPayVerifyPaymentResponse> {
  const response = await fetch(`${SASPAY_BASE_URL}/payments/${paymentId}/verify/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${SASPAY_SECRET_KEY}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`SasPay verify error (${response.status}): ${errorBody}`);
  }

  return response.json();
}

/**
 * Validates incoming webhook signature from SasPay
 * Header format: X-Webhook-Signature and X-Webhook-Timestamp
 * Reject if timestamp is older than 300 seconds
 */
export function verifySasPayWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  timestampHeader: string | null
): boolean {
  if (!signatureHeader || !timestampHeader || !SASPAY_WEBHOOK_SECRET) {
    return false;
  }

  const timestamp = parseInt(timestampHeader, 10);
  const now = Math.floor(Date.now() / 1000);

  // Reject replay attacks (> 300s)
  if (Math.abs(now - timestamp) > 300) {
    return false;
  }

  const payloadToSign = `${timestamp}.${rawBody}`;
  const computedSignature = crypto
    .createHmac("sha256", SASPAY_WEBHOOK_SECRET)
    .update(payloadToSign)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(computedSignature, "utf-8"),
    Buffer.from(signatureHeader, "utf-8")
  );
}
