import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { watermarkExamImage } from "@/lib/ai/image-watermark";
import { uploadExamAsset } from "@/lib/storage/exam-storage";

function createFallbackLineArtSvg(title: string, promptText: string, width = 1280, height = 720): Buffer {
  const cleanTitle = title.replace(/[<>&'"]/g, "");
  const cleanPrompt = promptText.replace(/[<>&'"]/g, "").slice(0, 80);

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="#FFFFFF"/>
    
    <!-- Subtle technical grid background -->
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F1F5F9" stroke-width="1"/>
    </pattern>
    <rect width="${width}" height="${height}" fill="url(#grid)" />

    <!-- Outer official border -->
    <rect x="30" y="30" width="${width - 60}" height="${height - 60}" rx="20" fill="none" stroke="#1E293B" stroke-width="2.5" stroke-dasharray="none"/>
    
    <!-- Header banner -->
    <rect x="30" y="30" width="${width - 60}" height="70" rx="18" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
    <text x="60" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="800" fill="#1D4ED8" letter-spacing="1.5">DOCUMENT SUPPORT OFFICIEL · TCF / TEF CANADA</text>

    <!-- Main illustration frame -->
    <g transform="translate(60, 140)">
      <!-- Line art desk / setting illustration -->
      <path d="M 100 380 L 1060 380" stroke="#1E293B" stroke-width="3" stroke-linecap="round"/>
      <path d="M 180 380 L 180 480" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M 980 380 L 980 480" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round"/>

      <!-- Central bulletin / document notice -->
      <rect x="280" y="40" width="600" height="300" rx="12" fill="#FFFFFF" stroke="#1E293B" stroke-width="2.5"/>
      <line x1="330" y1="90" x2="830" y2="90" stroke="#1D4ED8" stroke-width="3" stroke-linecap="round"/>
      <line x1="330" y1="130" x2="780" y2="130" stroke="#64748B" stroke-width="2" stroke-linecap="round"/>
      <line x1="330" y1="160" x2="810" y2="160" stroke="#64748B" stroke-width="2" stroke-linecap="round"/>
      <line x1="330" y1="190" x2="720" y2="190" stroke="#64748B" stroke-width="2" stroke-linecap="round"/>
      <line x1="330" y1="220" x2="800" y2="220" stroke="#64748B" stroke-width="2" stroke-linecap="round"/>

      <!-- Document title stamp -->
      <rect x="330" y="255" width="220" height="40" rx="8" fill="#EFF6FF" stroke="#3B82F6" stroke-width="1.5"/>
      <text x="350" y="280" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#1D4ED8">${cleanTitle || "MISE EN SITUATION"}</text>

      <!-- Stamp icon / badge -->
      <circle cx="800" cy="275" r="22" fill="#FEF2F2" stroke="#EF4444" stroke-width="1.5"/>
      <text x="788" y="280" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="#DC2626">FEI</text>
    </g>

    <!-- Context footer label -->
    <text x="60" y="${height - 50}" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="500" fill="#64748B">Contexte pédagogique : ${cleanPrompt}</text>
  </svg>
  `;

  return Buffer.from(svg);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = (body.prompt as string) || "Illustration de mise en situation TCF";
    const discipline = (body.discipline as string) || "CE";
    const questionNumber = Number(body.questionNumber) || 1;
    const seriesNumber = Number(body.seriesNumber) || 101;

    let imageBuffer: Buffer | null = null;

    // 1. Try Gemini image API if available
    const geminiKey = process.env.GEMINI_API_KEY || process.env.NANOBANANA_API_KEY;
    if (geminiKey) {
      try {
        const fullPrompt = `Minimalist clean line-art vector illustration, navy blue line art on pure crisp white background, corporate clean drawing, no text, no watermark, professional TCF Canada exam style, 16:9 widescreen composition: ${prompt}`;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${geminiKey}`;

        const geminiRes = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
            generationConfig: { responseModalities: ["IMAGE"] },
          }),
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const candidate = geminiData.candidates?.[0];
          const part = candidate?.content?.parts?.find(
            (p: { inlineData?: { data?: string } }) => p.inlineData
          );
          if (part?.inlineData?.data) {
            imageBuffer = Buffer.from(part.inlineData.data, "base64");
          }
        }
      } catch (geminiErr) {
        console.warn("Gemini generation failed, proceeding to fallback line-art:", geminiErr);
      }
    }

    // 2. If no image buffer yet, generate crisp line-art vector SVG
    if (!imageBuffer) {
      const svgBuffer = createFallbackLineArtSvg(
        `Question ${questionNumber}`,
        prompt,
        1280,
        720
      );
      imageBuffer = await sharp(svgBuffer).png().toBuffer();
    }

    // 3. Composite Super4C2 Maple Leaf Watermark
    const watermarkedBuffer = await watermarkExamImage(imageBuffer, {
      targetWidth: 1280,
      targetHeight: 720,
    });

    // 4. Upload to Supabase Storage (with automatic local fallback)
    const filename = `${discipline.toLowerCase()}-${seriesNumber}-q${questionNumber}-${Date.now()}.png`;
    const uploadResult = await uploadExamAsset({
      buffer: watermarkedBuffer,
      filename,
      contentType: "image/png",
      subfolder: discipline.toLowerCase(),
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      provider: uploadResult.provider,
      filename,
    });
  } catch (error: unknown) {
    console.error("Asset generation error:", error);
    const message = error instanceof Error ? error.message : "Erreur de génération d'image";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
