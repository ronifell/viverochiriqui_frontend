import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand greens (vivero / leaf inspired)
        brand: {
          50: '#f1f8f1',
          100: '#dceedb',
          200: '#b8dcb6',
          300: '#8ec78c',
          400: '#5fa95c',
          500: '#3f8e3d',
          600: '#2c7a2b',
          700: '#216321',
          800: '#1a4d1a',
          900: '#143a14',
        },
        // Accent rose (matches the logo's flower)
        accent: {
          50: '#fdecec',
          100: '#fbd5d5',
          200: '#f7a8a8',
          300: '#ef7474',
          400: '#e44d4d',
          500: '#cf2f2f',
          600: '#a92424',
          700: '#871d1d',
          800: '#6a1717',
          900: '#4d1010',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#128C7E',
        },
      },
      fontFamily: {
        sans: [
          'var(--font-sans)',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        display: [
          'var(--font-display)',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        soft: '0 4px 14px -4px rgba(20, 58, 20, 0.10)',
        card: '0 6px 20px -10px rgba(20, 58, 20, 0.18)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
    },
  },
  plugins: [],
};

export default config;
