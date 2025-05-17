/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'so-orange': '#f48024',
        'so-blue': '#0074cc',
        'so-blue-hover': '#0a95ff',
        'so-gray-light': '#f8f9f9',
        'so-gray-medium': '#e3e6e8',
        'so-gray-dark': '#6a737c',
        'so-text': '#3b4045',
      }
    },
  },
  plugins: [],
}
