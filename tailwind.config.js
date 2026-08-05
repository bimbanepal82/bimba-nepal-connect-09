// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
      },
      boxShadow: {
        warm: 'var(--shadow-warm)',
      },
      backgroundImage: {
        'hero-gradient': 'var(--gradient-hero)',
      },
    },
  },
  plugins: [],
};
