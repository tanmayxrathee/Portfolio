import { useEffect, useRef } from "react";

interface PixelCanvasProps {
  imageSrc: string;
  pixelSize: number;
  reducedMotion: boolean;
}

interface PointerState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  lastMove: number;
  active: boolean;
}

export function PixelCanvas({ imageSrc, pixelSize, reducedMotion }: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !context) return;

    const sampler = document.createElement("canvas");
    const samplerContext = sampler.getContext("2d", { willReadFrequently: true });
    if (!samplerContext) return;

    const image = new Image();
    image.decoding = "async";
    image.src = imageSrc;

    const pointer: PointerState = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      lastMove: 0,
      active: false,
    };

    let width = 0;
    let height = 0;
    let columns = 0;
    let rows = 0;
    let cell = pixelSize;
    let pixelRatio = 1;
    let colors: Uint8ClampedArray | null = null;
    let frame = 0;
    let lastFrame = 0;
    let visible = !document.hidden;
    const smallPointer = window.matchMedia("(hover: none), (pointer: coarse)");

    const sampleImage = () => {
      if (!image.complete || image.naturalWidth === 0 || !columns || !rows) return;

      sampler.width = columns;
      sampler.height = rows;
      const scale = Math.max(columns / image.naturalWidth, rows / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      samplerContext.clearRect(0, 0, columns, rows);
      samplerContext.drawImage(image, (columns - drawWidth) / 2, (rows - drawHeight) / 2, drawWidth, drawHeight);
      colors = samplerContext.getImageData(0, 0, columns, rows).data;
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      cell = Math.max(pixelSize, Math.ceil(width / 220));
      columns = Math.ceil(width / cell);
      rows = Math.ceil(height / cell);
      canvas.width = Math.max(1, Math.round(width * pixelRatio));
      canvas.height = Math.max(1, Math.round(height * pixelRatio));
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      sampleImage();
      draw(performance.now());
    };

    const draw = (timestamp: number) => {
      if (!width || !height) return;

      context.fillStyle = "#0b0908";
      context.fillRect(0, 0, width, height);

      if (smallPointer.matches && !pointer.active && !reducedMotion && timestamp - pointer.lastMove > 2600) {
        const phase = timestamp * 0.00032;
        pointer.targetX = width * (0.5 + Math.cos(phase) * 0.28);
        pointer.targetY = height * (0.48 + Math.sin(phase * 0.72) * 0.22);
      }

      pointer.x += (pointer.targetX - pointer.x) * 0.16;
      pointer.y += (pointer.targetY - pointer.y) * 0.16;
      const radius = cell * 9;

      if (pointer.x > -radius && pointer.x < width + radius && pointer.y > -radius && pointer.y < height + radius) {
        const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, radius * 1.7);
        glow.addColorStop(0, "rgba(255, 222, 169, 0.18)");
        glow.addColorStop(0.45, "rgba(226, 178, 113, 0.07)");
        glow.addColorStop(1, "rgba(226, 178, 113, 0)");
        context.fillStyle = glow;
        context.fillRect(pointer.x - radius * 1.7, pointer.y - radius * 1.7, radius * 3.4, radius * 3.4);
      }

      for (let row = 0; row < rows; row += 1) {
        const y = row * cell;
        const centerY = y + cell / 2;

        for (let column = 0; column < columns; column += 1) {
          const x = column * cell;
          const centerX = x + cell / 2;
          const distance = Math.hypot(centerX - pointer.x, centerY - pointer.y);
          const influence = Math.max(0, 1 - distance / radius);
          const ease = influence * influence * (3 - 2 * influence);
          const grow = 1 + ease * 0.78;
          const size = cell * grow;
          const inset = Math.max(0.6, cell * 0.11) * (1 - ease * 0.6);
          const colorIndex = (row * columns + column) * 4;
          const sourceR = colors?.[colorIndex] ?? 54;
          const sourceG = colors?.[colorIndex + 1] ?? 46;
          const sourceB = colors?.[colorIndex + 2] ?? 39;
          const brightness = 0.4 + ease * 0.52;
          const red = Math.min(255, Math.round(sourceR * brightness + ease * 24));
          const green = Math.min(255, Math.round(sourceG * brightness + ease * 17));
          const blue = Math.min(255, Math.round(sourceB * brightness + ease * 8));

          context.fillStyle = `rgb(${red} ${green} ${blue})`;
          context.fillRect(centerX - size / 2 + inset, centerY - size / 2 + inset, size - inset * 2, size - inset * 2);

          const dot = Math.max(0.55, cell * 0.045) * (1 + ease * 0.6);
          context.fillStyle = `rgba(255, 241, 218, ${0.22 + ease * 0.4})`;
          context.fillRect(centerX - dot / 2, centerY - dot / 2, dot, dot);
        }
      }
    };

    const animate = (timestamp: number) => {
      if (!visible) return;
      if (timestamp - lastFrame >= 1000 / 60) {
        draw(timestamp);
        lastFrame = timestamp;
      }
      frame = window.requestAnimationFrame(animate);
    };

    const setPointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      pointer.targetX = x;
      pointer.targetY = y;
      pointer.lastMove = performance.now();
      pointer.active = true;
      if (reducedMotion) {
        pointer.x = x;
        pointer.y = y;
        draw(pointer.lastMove);
      }
    };

    const releasePointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        pointer.active = false;
        pointer.targetX = -1000;
        pointer.targetY = -1000;
        pointer.lastMove = performance.now();
      } else {
        pointer.active = false;
        pointer.targetX = -1000;
        pointer.targetY = -1000;
      }
    };

    const resetPointer = () => {
      pointer.active = false;
      pointer.targetX = -1000;
      pointer.targetY = -1000;
    };

    const handleImageLoad = () => {
      sampleImage();
      draw(performance.now());
    };

    const handleVisibility = () => {
      visible = !document.hidden;
      if (visible && !reducedMotion) frame = window.requestAnimationFrame(animate);
      else window.cancelAnimationFrame(frame);
    };

    image.addEventListener("load", handleImageLoad);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", setPointer, { passive: true });
    window.addEventListener("pointerup", releasePointer, { passive: true });
    window.addEventListener("pointercancel", releasePointer, { passive: true });
    window.addEventListener("blur", resetPointer);
    document.addEventListener("visibilitychange", handleVisibility);
    resize();
    if (!reducedMotion) frame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frame);
      image.removeEventListener("load", handleImageLoad);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", setPointer);
      window.removeEventListener("pointerup", releasePointer);
      window.removeEventListener("pointercancel", releasePointer);
      window.removeEventListener("blur", resetPointer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [imageSrc, pixelSize, reducedMotion]);

  return <canvas ref={canvasRef} className="pixel-canvas" aria-hidden="true" />;
}
