import { Muxer, ArrayBufferTarget } from "mp4-muxer";

/** Generate a filename like `topo-2026-03-15-a3f9b2.png`. */
export function generateFilename(toolId: string, extension: string): string {
  const date = new Date().toISOString().slice(0, 10);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${toolId}-${date}-${rand}.${extension}`;
}

/** Export canvas as PNG via anchor download. */
export function exportPNG(canvas: HTMLCanvasElement, filename: string): void {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}

/** Export SVG string via anchor download. */
export function exportSVG(svgString: string, filename: string): void {
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Wrap a canvas PNG snapshot in an SVG container and download it. */
export function exportSVGFromCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
): void {
  const width = canvas.width;
  const height = canvas.height;
  const dataUrl = canvas.toDataURL("image/png");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" ` +
    `width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<image href="${dataUrl}" width="${width}" height="${height}"/>` +
    `</svg>`;
  exportSVG(svg, filename);
}

interface RecorderOptions {
  width: number;
  height: number;
  fps?: number;
  bitrate?: number;
}

interface Recorder {
  start: () => void;
  addFrame: (canvas: HTMLCanvasElement) => void;
  stop: () => Promise<Blob>;
}

/**
 * Create an MP4 recorder using VideoEncoder + mp4-muxer.
 * Returns null if VideoEncoder is not supported.
 */
export function createRecorder(
  options: RecorderOptions,
): Recorder | null {
  if (typeof VideoEncoder === "undefined") return null;

  const fps = options.fps ?? 30;
  const bitrate = options.bitrate ?? 5_000_000;

  let muxer: Muxer<ArrayBufferTarget>;
  let encoder: VideoEncoder;
  let frameCount = 0;

  return {
    start() {
      muxer = new Muxer({
        target: new ArrayBufferTarget(),
        video: {
          codec: "avc",
          width: options.width,
          height: options.height,
        },
        fastStart: "in-memory",
      });

      encoder = new VideoEncoder({
        output: (chunk, meta) => {
          muxer.addVideoChunk(chunk, meta ?? undefined);
        },
        error: (e) => console.error("VideoEncoder error:", e),
      });

      encoder.configure({
        codec: "avc1.640028",
        width: options.width,
        height: options.height,
        bitrate,
        framerate: fps,
      });

      frameCount = 0;
    },

    addFrame(canvas: HTMLCanvasElement) {
      const frame = new VideoFrame(canvas, {
        timestamp: (frameCount / fps) * 1_000_000,
      });
      encoder.encode(frame);
      frame.close();
      frameCount++;
    },

    async stop(): Promise<Blob> {
      await encoder.flush();
      muxer.finalize();
      const buf = muxer.target.buffer;
      return new Blob([buf], { type: "video/mp4" });
    },
  };
}
