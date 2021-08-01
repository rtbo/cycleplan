
function opacityHandler(colorVariable) {
  return ({opacityVariable, opacityValue}) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${colorVariable}), ${opacityValue})`;
    }
    else if (opacityVariable !== undefined) {
      return `rgba(var(${colorVariable}), var(${opacityVariable}, 1))`;
    }
    return `rgb(var(${colorVariable}))`;
  }
}

module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,ts}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        "on-surface": opacityHandler("--color-on-surface"),
        "accent": opacityHandler("--color-accent"),
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
