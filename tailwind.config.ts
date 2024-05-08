import { type Config } from "tailwindcss";
import daisyui from "daisyui"
import typography from "tailwindcss/typography"

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  plugins: [
    typography,
    daisyui as any,
  ],
} satisfies Config;
