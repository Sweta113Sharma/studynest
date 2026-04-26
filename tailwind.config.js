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
        background: 'oklch(0.145 0.015 285)',
        foreground: 'oklch(0.97 0.002 285)',
        card: {
          DEFAULT: 'oklch(0.17 0.015 285)',
          foreground: 'oklch(0.95 0.005 285)',
        },
        popover: {
          DEFAULT: 'oklch(0.17 0.015 285)',
          foreground: 'oklch(0.95 0.005 285)',
        },
        primary: {
          DEFAULT: 'oklch(0.6 0.15 250)',
          foreground: 'oklch(0.98 0.005 285)',
        },
        secondary: {
          DEFAULT: 'oklch(0.25 0.02 285)',
          foreground: 'oklch(0.9 0.01 285)',
        },
        muted: {
          DEFAULT: 'oklch(0.22 0.02 285)',
          foreground: 'oklch(0.65 0.015 285)',
        },
        accent: {
          DEFAULT: 'oklch(0.25 0.02 285)',
          foreground: 'oklch(0.95 0.005 285)',
        },
        destructive: {
          DEFAULT: 'oklch(0.55 0.15 25)',
          foreground: 'oklch(0.95 0.005 285)',
        },
        border: 'oklch(0.3 0.015 285)',
        input: 'oklch(0.3 0.015 285)',
        ring: 'oklch(0.6 0.15 250)',
        success: 'oklch(0.7 0.15 150)',
        warning: 'oklch(0.75 0.15 80)',
        // Custom gradients
        'glass-1': 'rgba(255, 255, 255, 0.03)',
        'glass-2': 'rgba(255, 255, 255, 0.06)',
        'glass-3': 'rgba(255, 255, 255, 0.1)',
        'glow-primary': 'rgba(99, 102, 241, 0.4)',
        'glow-accent': 'rgba(168, 85, 247, 0.3)',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
        xl: '1.25rem',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(99, 102, 241, 0.15)',
        'glow-lg': '0 0 60px rgba(99, 102, 241, 0.2)',
        'glow-accent': '0 0 40px rgba(168, 85, 247, 0.15)',
        'inner-glow': 'inset 0 0 20px rgba(99, 102, 241, 0.1)',
        'card': '0 4px 24px -4px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 32px -4px rgba(0, 0, 0, 0.4)',
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