/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "text-blue-500",
    "text-purple-400",
    "text-yellow-400",
    "text-yellow-600",
    "bg-blue-500",
    "bg-purple-400",
    "bg-yellow-400",
    "bg-yellow-600",
    // add all possible colors you use dynamically
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

