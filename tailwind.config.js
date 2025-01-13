import { default as daisyui } from "daisyui";

export const content = ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'];
export const theme = {
  extend: ["light","dark"],
};
export const variants = {
  extend: {},
};
export const plugins = [daisyui];

