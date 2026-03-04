import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#2d6a4f',
          dark: '#1b4332',
          light: '#40916c',
          gold: '#b5831f',
          cream: '#faf8f0',
        },
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'Apple SD Gothic Neo', 'sans-serif'],
      },
      maxWidth: {
        site: '1100px',
      },
    },
  },
  plugins: [],
}

export default config
