import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // Every colour resolves from a CSS variable so both themes share one set
      // of utilities. Channels live in app/globals.css.
      colors: {
        void: "rgb(var(--void) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        panelRaised: "rgb(var(--panel-raised) / <alpha-value>)",
        hairline: "rgb(var(--hairline) / <alpha-value>)",
        hairlineBright: "rgb(var(--hairline-bright) / <alpha-value>)",

        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        dim: "rgb(var(--dim) / <alpha-value>)",

        signal: "rgb(var(--signal) / <alpha-value>)",
        node: "rgb(var(--node) / <alpha-value>)",
        alert: "rgb(var(--alert) / <alpha-value>)",
        critical: "rgb(var(--critical) / <alpha-value>)",
      },
      fontFamily: {
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
        display: ["var(--font-display)", "var(--font-mono)", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.32em",
      },
      keyframes: {
        coreSpin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        coreSpinReverse: {
          from: { transform: "rotate(360deg)" },
          to: { transform: "rotate(0deg)" },
        },
        revealUp: {
          from: {
            opacity: "0",
            transform: "translate3d(0, 14px, 0)",
            filter: "blur(6px)",
          },
          to: {
            opacity: "1",
            transform: "translate3d(0, 0, 0)",
            filter: "blur(0)",
          },
        },
        revealIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        nodePulse: {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.35)" },
        },
        traceFlow: {
          from: { strokeDashoffset: "0" },
          to: { strokeDashoffset: "-240" },
        },
        blink: {
          "0%, 48%": { opacity: "1" },
          "49%, 100%": { opacity: "0.15" },
        },
        driftY: {
          "0%, 100%": { transform: "translate3d(0, -0.4%, 0)" },
          "50%": { transform: "translate3d(0, 0.4%, 0)" },
        },
      },
      animation: {
        // Spec: one revolution every 160-220s while idle.
        coreSpin: "coreSpin 190s linear infinite",
        coreSpinSlow: "coreSpin 260s linear infinite",
        coreSpinReverse: "coreSpinReverse 214s linear infinite",
        revealUp: "revealUp 620ms cubic-bezier(0.16, 0.84, 0.44, 1) both",
        revealIn: "revealIn 900ms ease both",
        nodePulse: "nodePulse 3.6s ease-in-out infinite",
        traceFlow: "traceFlow 14s linear infinite",
        blink: "blink 1.4s step-end infinite",
        driftY: "driftY 24s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
