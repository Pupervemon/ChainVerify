/** @type {import('tailwindcss').Config} */

import tailwindAnimate from "tailwindcss-animate";
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
      // 补充：如果你想让动画更顺滑，可以在这里微调关键帧（可选）
    },
  },
  plugins: [
    tailwindAnimate, // 2. 放入插件变量
  ],
}