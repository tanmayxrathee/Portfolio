import type { CSSProperties } from "react";

type CrtStyle = CSSProperties & { "--crt-intensity": number };

interface CrtOverlayProps {
  intensity: number;
  scanlines: boolean;
}

export function CrtOverlay({ intensity, scanlines }: CrtOverlayProps) {
  return (
    <>
      <div
        className={`crt-overlay${scanlines ? "" : " crt-overlay--clean"}`}
        aria-hidden="true"
        style={{ "--crt-intensity": intensity } as CrtStyle}
      >
        <div className="crt-noise" />
        <div className="crt-glass" />
      </div>
      <div className="crt-frame" aria-hidden="true" />
      <div className="crt-turn-on" aria-hidden="true" />
    </>
  );
}
