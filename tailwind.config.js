/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // design.md light mode
        surface: 'var(--color-surface)',
        'surface-card': 'var(--color-surface-card)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        accent: 'var(--color-accent)',
        danger: 'var(--color-danger)',
        warning: 'var(--color-warning)',
        info: 'var(--color-info)',
        border: 'var(--color-border)',
      },
      fontFamily: {
        // ponytail: system-ui instead of self-hosting Inter — zero network cost, works offline by definition
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        content: '960px',
      },
    },
  },
  plugins: [],
};
