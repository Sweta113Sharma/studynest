/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--bg-page-rgb) / <alpha-value>)',
        foreground: 'rgb(var(--foreground-rgb) / <alpha-value>)',
        card: {
          DEFAULT: 'var(--bg-card)',
          foreground: 'var(--text-card)',
        },
        popover: {
          DEFAULT: 'var(--bg-card)',
          foreground: 'var(--text-card)',
        },
        primary: {
          DEFAULT: 'rgb(var(--primary-rgb) / <alpha-value>)',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: 'var(--button-secondary-bg)',
          foreground: 'var(--button-secondary-text)',
        },
        muted: {
          DEFAULT: 'var(--bg-input)',
          foreground: 'rgb(var(--muted-foreground-rgb) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent-rgb) / <alpha-value>)',
          foreground: '#343b1b',
        },
        nest: {
          navy: 'var(--nest-navy)',
          blue: 'var(--nest-blue)',
          'light-blue': 'var(--nest-light-blue)',
          gold: 'var(--nest-gold)',
          cream: 'var(--nest-cream)',
          white: '#FFFFFF',
          green: 'var(--nest-green)',
          'light-green': 'var(--nest-light-green)',
          dark: 'var(--nest-dark)',
          gray: 'var(--nest-gray)',
          border: 'var(--nest-border)',
          'light-input': 'var(--nest-light-input)',
          'dark-input': 'var(--nest-dark-input)',
          error: '#D9534F',
        },
        border: 'var(--border-card)',
        input: 'var(--bg-input)',
        ring: 'rgb(var(--primary-rgb) / <alpha-value>)',
        success: '#c8d69b', // Tea Green
        warning: '#f6e6a5', // Vanilla
        // Custom subtle overlays
        'glass-1': 'rgba(255, 255, 255, 0.05)',
        'glass-2': 'rgba(255, 255, 255, 0.08)',
        'glass-3': 'rgba(255, 255, 255, 0.12)',
        'glow-primary': 'rgba(57, 113, 184, 0.3)', // Celtic Blue
        'glow-accent': 'rgba(246, 230, 165, 0.3)', // Vanilla
      },
      fontFamily: {
        sans: ['Poppins', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Comfortaa', 'Poppins', '"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Poppins', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
        xl: '1.125rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(52, 59, 27, 0.15)',
        'glow-lg': '0 0 60px rgba(52, 59, 27, 0.25)',
        'glow-accent': '0 0 40px rgba(246, 230, 165, 0.2)',
        'inner-glow': 'inset 0 0 20px rgba(52, 59, 27, 0.1)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 12px 40px rgba(0, 0, 0, 0.22)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        'grid': '24px 24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}