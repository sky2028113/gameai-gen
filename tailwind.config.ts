import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        apple: {
          bg: '#f5f5f7',
          card: '#ffffff',
          dark: '#1d1d1f',
          text: '#6e6e73',
          blue: '#0071e3',
          border: '#d2d2d7',
        },
      },
    },
  },
  plugins: [],
}
export default config
