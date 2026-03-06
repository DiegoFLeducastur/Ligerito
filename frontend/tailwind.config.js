/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          fondo: '#D9E9CF',    // Tu verde actual
          dark: '#1e293b',     // Slate-800
          accent: '#3b82f6',   // Blue-500
          surface: '#ffffff',  // Blanco
          muted: '#64748b',    // Slate-500
        }
      },
    },
  },
  plugins: [],
}