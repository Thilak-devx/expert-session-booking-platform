/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: "#0f172a",
          sky: "#38bdf8",
          mint: "#5eead4",
          sand: "#f8fafc",
          ember: "#fb7185",
        },
      },
      boxShadow: {
        soft: "0 20px 60px rgba(15, 23, 42, 0.15)",
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(circle at top left, rgba(56, 189, 248, 0.22), transparent 30%), radial-gradient(circle at top right, rgba(94, 234, 212, 0.18), transparent 28%), linear-gradient(135deg, #f8fafc 0%, #ecfeff 48%, #f8fafc 100%)",
      },
    },
  },
  plugins: [],
};
