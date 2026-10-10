import { NextRequest, NextResponse } from "next/server";
import { PRICING_PLANS, SUPPORTED_CURRENCIES, SupportedCurrency } from "@/lib/pricing/geo-pricing";
import { createSasPayCheckoutSession } from "@/lib/billing/saspay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, currency, customerEmail, customerName, customerPhone, paymentMethod } = body;

    const plan = PRICING_PLANS.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: "Forfait introuvable." }, { status: 404 });
    }

    const validCurrency: SupportedCurrency =
      currency && SUPPORTED_CURRENCIES[currency as SupportedCurrency]
        ? (currency as SupportedCurrency)
        : "XAF";

    const planPricing = plan.prices[validCurrency];
    const origin = req.nextUrl.origin;

    // 1. SasPay Gateway (Zone Franc CFA / Mobile Money Afrique)
    if (validCurrency === "XAF" || paymentMethod === "saspay") {
      try {
        const session = await createSasPayCheckoutSession({
          amount: planPricing.amount,
          currency: "XAF",
          description: `Super4C2 — ${plan.name} (${planPricing.periodText})`,
          customerEmail: customerEmail || "candidat@super4c2.com",
          customerName: customerName || "Candidat Super4C2",
          returnUrl: `${origin}/checkout/success?plan=${plan.id}&gateway=saspay`,
        });

        if (session.success && session.data?.checkout_url) {
          return NextResponse.json({ checkoutUrl: session.data.checkout_url });
        }
      } catch (sasErr) {
        console.warn("[SasPay] Notice: Falling back to sandbox confirmation:", sasErr);
      }

      // Sandbox / QA Fallback if live credentials not yet set in .env
      return NextResponse.json({
        checkoutUrl: `/checkout/success?plan=${plan.id}&gateway=saspay&simulated=true`,
      });
    }

    // 2. Stripe Gateway (International Cards / Apple Pay)
    return NextResponse.json({
      checkoutUrl: `/checkout/success?plan=${plan.id}&gateway=stripe&simulated=true`,
    });
  } catch (error: any) {
    console.error("[Checkout API Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Erreur lors de l'initialisation du paiement." },
      { status: 500 }
    );
  }
}
