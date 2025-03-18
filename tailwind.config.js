import { default as daisyui } from 'daisyui'
import typography from '@tailwindcss/typography'
export const content = ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}']
export const theme = {
  extend: ['dark'],
}
export const variants = {
  extend: {},
}
export const plugins = [typography, daisyui]
