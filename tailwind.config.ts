import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#F5F5FD',
          100: '#E8E8FA',
          200: '#D5D4F5',
          300: '#BBB9EF',
          400: '#9E9BE8',
          500: '#7E79E1',
          600: '#5E58D9',
          700: '#4F4AB6',
          800: '#403C94',
          900: '#312E71',
          950: '#22204E',
        },
      },
    },
  },
}
