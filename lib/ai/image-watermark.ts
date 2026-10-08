import sharp from "sharp";
import path from "path";
import fsSync from "fs";

/**
 * Apply Super4C2's signature Canadian maple leaf watermark to any image buffer or file.
 * Returns a high-definition PNG buffer with 16:9 widescreen presentation and the discreet logo in the bottom-right corner.
 */
export async function watermarkExamImage(
  inputBuffer: Buffer,
  options?: { targetWidth?: number; targetHeight?: number }
): Promise<Buffer> {
  const logoPath = path.join(process.cwd(), "public", "brand", "Le Logomark.png");

  let baseImage = sharp(inputBuffer);
  const metadata = await baseImage.metadata();

  const width = options?.targetWidth || metadata.width || 1280;
  const height = options?.targetHeight || metadata.height || 720;

  // Resize base image to clean standard resolution
  const resizedBase = await sharp(inputBuffer)
    .resize(width, height, { fit: "cover", position: "center" })
    .toBuffer();

  if (!fsSync.existsSync(logoPath)) {
    // If logo not found, return resized base
    return resizedBase;
  }

  // Size logo proportionally (approx 8% of image height)
  const logoHeight = Math.max(36, Math.min(64, Math.round(height * 0.08)));
  const logoBuffer = await sharp(logoPath)
    .resize({ height: logoHeight })
    .ensureAlpha()
    .toBuffer();

  const logoMeta = await sharp(logoBuffer).metadata();
  const logoW = logoMeta.width || 50;
  const logoH = logoMeta.height || 50;

  // Composite watermark in bottom-right corner with 24px padding
  return sharp(resizedBase)
    .composite([
      {
        input: logoBuffer,
        top: height - logoH - 20,
        left: width - logoW - 24,
        blend: "over",
      },
    ])
    .png({ quality: 90 })
    .toBuffer();
}
