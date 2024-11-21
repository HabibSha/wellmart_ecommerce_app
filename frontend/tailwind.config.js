import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addBase, addComponents, addUtilities }) {
      addBase({});
      addComponents({
        ".h1": {
          "@apply font-semibold text-[2.5rem] leading-[3.25rem] md:text-[2.65rem] md:leading-[3.65rem] lg:text-[3rem] lg:leading-[3.9rem] xl:text-[3.75rem] xl:leading-[4.5rem]":
            {},
        },
        ".h2": {
          "@apply text-[1.75rem] leading-[2.5rem] md:text-[2rem] md:leading-[2.5rem] lg:text-[2.5rem] lg:leading-[3.5rem] xl:text-[3rem] xl:leading-tight":
            {},
        },
        ".h3": {
          "@apply text-[2rem] leading-normal md:text-[2.5rem]": {},
        },
        ".h4": {
          "@apply text-[1.45rem] leading-normal lg:text-[2rem]": {},
        },
        ".h5": {
          "@apply text-[1.15rem] leading-normal md:text-[1.285rem] lg:text-[1.575rem]":
            {},
        },
        ".h6": {
          "@apply font-[500] text-[.885rem] leading-normal md:text-[1rem] lg:text-[1.2rem]":
            {},
        },
        ".body-1": {
          "@apply text-[0.895rem] leading-[1.4rem] md:text-[.975rem] md:leading-[1.5rem] xl:text-[1.1rem] xl:leading-[1.65]":
            {},
        },
        ".body-2": {
          "@apply font-light text-[0.875rem] leading-6 md:text-base": {},
        },
      });
      addUtilities({});
    }),
  ],
};
