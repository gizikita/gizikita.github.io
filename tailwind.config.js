/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        surface: 'var(--color-surface)',
        'surface-card': 'var(--color-surface-card)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        accent: 'var(--color-accent)',
        'on-accent': 'var(--color-on-accent)',
        'accent-container': 'var(--color-accent-container)',
        danger: 'var(--color-danger)',
        'on-danger': 'var(--color-on-danger)',
        warning: 'var(--color-warning)',
        info: 'var(--color-info)',
        border: 'var(--color-border)',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        content: '960px',
      },
    },
  },
  plugins: [],
};
