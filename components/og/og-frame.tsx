import type { ReactNode } from "react";
import { ogColors } from "@/lib/og";

interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  footer: string;
  children?: ReactNode;
}

/** Shared layout for every Open Graph image. Rendered by Satori, so only flex layouts and inline styles. */
export function OgFrame({ eyebrow, title, subtitle, footer, children }: Props) {
  const display = "Display";
  const sans = "Sans";
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        backgroundColor: ogColors.bg,
        color: ogColors.cream,
        fontFamily: sans,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontFamily: display, fontSize: 40, letterSpacing: 2 }}>Parfum City</div>
        <div
          style={{
            fontSize: 20,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: ogColors.brass,
          }}
        >
          {eyebrow}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 48,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            maxWidth: children ? 760 : 1000,
          }}
        >
          <div
            style={{
              fontFamily: display,
              fontSize: title.length > 40 ? 64 : 84,
              lineHeight: 1.05,
            }}
          >
            {title}
          </div>
          {subtitle && <div style={{ fontSize: 28, color: ogColors.cream2 }}>{subtitle}</div>}
        </div>
        {children}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid " + ogColors.line,
          paddingTop: 24,
          fontSize: 20,
          color: ogColors.cream2,
        }}
      >
        <div>{footer}</div>
        <div
          style={{
            color: ogColors.brass,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontSize: 18,
          }}
        >
          Bakı · Nizami 111
        </div>
      </div>
    </div>
  );
}
