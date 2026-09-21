/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#FF5A36',
        ink: '#16161D',
        bg: '#F5F4F0',
        line: '#E7E4DC',
        muted: '#6B6B76',
        'muted-2': '#8A8977',
        'muted-3': '#ACAAA1',
        tint: '#F1F0EA',
        online: '#22C55E',
        offline: '#B0AEA6',
        ativo: {
          bg: '#ECFDF3',
          fg: '#027A48',
        },
        sobreaviso: {
          bg: '#FFF4E5',
          fg: '#B45309',
        },
        sidebar: {
          DEFAULT: '#14141C',
          active: '#23232E',
          pill: '#1E1E29',
          profile: '#1B1B24',
          muted: '#8A8977',
          text: '#B9B8C6',
        },
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
