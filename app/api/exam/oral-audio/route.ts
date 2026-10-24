import { NextResponse } from "next/server";
import { uploadExamAsset } from "@/lib/storage/exam-storage";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("audio") as Blob | File | null;
    const seriesId = (formData.get("seriesId") as string) || "eo-general";

    if (!file) {
      return NextResponse.json({ ok: false, error: "Aucun fichier audio transmis" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = `session-${seriesId}-${Date.now()}.webm`;

    const result = await uploadExamAsset({
      buffer,
      filename,
      contentType: "audio/webm",
      subfolder: "oral-recordings",
    });

    return NextResponse.json({
      ok: true,
      audioUrl: result.url,
      provider: result.provider,
    });
  } catch (err) {
    console.error("[Oral Audio Upload Error]:", err);
    return NextResponse.json(
      { ok: false, error: "Erreur lors de l'enregistrement de l'audio" },
      { status: 500 }
    );
  }
}
