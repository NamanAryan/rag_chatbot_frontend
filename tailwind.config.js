// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'slide-in-top': 'slideInFromTop 0.5s ease-out forwards',
      },
      keyframes: {
        slideInFromTop: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
}
