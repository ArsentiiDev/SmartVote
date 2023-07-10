/** 
 * @type {import('tailwindcss').Config} 
*/

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'sm': '0px 0px 40px -10px rgba(72, 49, 157, 0.4)',
      }
    },
    colors: {
      'neutral': {
        'primary': 'rgba(230, 230, 230, 1)',
        'secondary': 'rgba(230, 230, 230, 0.6)',
        'tertiary': 'rgba(230, 230, 230, 0.3)',
        'quaternary': 'rgba(230, 230, 230, 0.1)'
      },
      'main': {
        'primary':'rgba(128, 21, 167, 1)',
        'secondary': 'rgba(72, 49, 157, 0.4)',
      },
      'hover': 'rgba(128, 21, 167, 0.8)',
      'background': 'rgba(16, 16, 16, 1)',
      'modal': 'rgba(16, 16, 16, .6)',
      'status': {
        'voted': '#38AC3E',
        'voted-bg': 'rgba(56, 172, 62, 0.3)',
        'sent': '#3844AC',
        'sent-bg': 'rgba(56, 68, 172, 0.3)',
        'rejected': '#AC384D',
        'rejected-bg': 'rgba(172, 56, 77, 0.3)',
      }
    }
  },
  plugins: [],
}
