export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#f5f6fa",
        card: "#ffffff",
        border: "#e5e7eb",
        muted: "#6b7280",
        primary: "#2563eb",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};
