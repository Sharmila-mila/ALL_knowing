import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        secondary: '#F8FAFC',
        card: '#FFFFFF',
        border: '#E5E7EB',
        heading: '#111827',
        body: '#6B7280',
        primary: {
          DEFAULT: '#0EA5E9',
          hover: '#0284C7',
          light: '#F0F9FF',
        },
        success: '#16A34A',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'soft-lg': '0 10px 30px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
      },
    },
  },
  plugins: [],
};

export default config;
