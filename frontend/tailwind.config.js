/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["SNPro", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#EFF8FF",
          100: "#DEF0FF",
          200: "#B6E3FF",
          300: "#75CFFF",
          400: "#2CB9FF",
          500: "#157ADF", // Primary - custom blue
          600: "#0F62BE",
          700: "#0D4E9A",
          800: "#10427F",
          900: "#133869",
        },
        cyan: {
          400: "#6EE7F9", // Light accent
          500: "#06B6D4",
        },
      },
      backgroundColor: {
        glass: "rgba(255, 255, 255, 0.6)",
        "glass-dark": "rgba(255, 255, 255, 0.4)",
      },
      backdropBlur: {
        glass: "14px",
      },
      boxShadow: {
        soft: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        "soft-md":
          "0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
        "soft-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.08)",
        "glass-hover": "0 12px 40px rgba(0, 0, 0, 0.12)",
      },
      backgroundImage: {
        pattern: "url('$lib/assets/Rectangle.png')",
        "gradient-mesh":
          "linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 50%, #FFFFFF 100%)",
      },
      animation: {
        "fade-in": "fadeIn 400ms ease-out",
        "slide-up": "slideUp 300ms ease-out",
        "scale-in": "scaleIn 200ms ease-out",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
