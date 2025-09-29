import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./content/**/*.{md,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        ink: {
          50: "#f6f7f9",
          100: "#eceef3",
          200: "#d8dbe6",
          300: "#bcc2d5",
          400: "#96a0ba",
          500: "#6f7da1",
          600: "#515d80",
          700: "#3a4564",
          800: "#292f46",
          900: "#1f2335",
          950: "#121423",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
        heading: ["var(--font-heading)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
      },
      maxWidth: {
        content: "72rem",
      },
      boxShadow: {
        soft: "0 20px 50px -20px rgba(8, 47, 73, 0.25)",
      },
      borderRadius: {
        xl: "1.25rem",
      },
      typography: (theme: (path: string) => string) => ({
        DEFAULT: {
          css: {
            color: theme("colors.ink.800"),
            a: {
              color: theme("colors.brand.600"),
              fontWeight: "600",
              textDecoration: "none",
              '&:hover': {
                textDecoration: "underline",
              },
            },
            h1: {
              fontFamily: theme("fontFamily.heading"),
              color: theme("colors.ink.900"),
            },
            h2: {
              fontFamily: theme("fontFamily.heading"),
              color: theme("colors.ink.900"),
            },
            h3: {
              fontFamily: theme("fontFamily.heading"),
              color: theme("colors.ink.900"),
            },
            strong: {
              color: theme("colors.ink.900"),
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
} satisfies Config;

export default config;
