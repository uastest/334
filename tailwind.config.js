export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        sidebar: "var(--sidebar)",
      },
    },
  },
  safelist: [
    "bg-blue-50", "bg-blue-100", "bg-blue-300", "bg-blue-500", "bg-blue-600", "bg-blue-700",
    "bg-gray-50", "bg-gray-100", "bg-gray-200", "bg-gray-900",
    "bg-green-50", "bg-green-100", "bg-green-500", "bg-green-600", "bg-green-700",
    "bg-red-50", "bg-red-100", "bg-red-500",
    "bg-yellow-50", "bg-yellow-500",
    "bg-amber-50",
    "bg-orange-500",
    "bg-slate-50",
    { pattern: /bg-primary-.*/ },
    { pattern: /bg-sidebar-.*/ }
  ]
}
