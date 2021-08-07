const colors = require("tailwindcss/colors");

function colorVarRGB(colorVariable) {
  return ({ opacityVariable, opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${colorVariable}), ${opacityValue})`;
    } else if (opacityVariable !== undefined) {
      return `rgba(var(${colorVariable}), var(${opacityVariable}, 1))`;
    }
    return `rgb(var(${colorVariable}))`;
  };
}

module.exports = {
  mode: "jit",
  purge: ["./index.html", "./src/**/*.{vue,ts}"],
  darkMode: "class",
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
    },
    extend: {
      colors: {
        "primary": colorVarRGB("--color-primary"),
        "primary-variant": colorVarRGB("--color-primary-variant"),
        "secondary": colorVarRGB("--color-secondary"),
        "secondary-variant": colorVarRGB("--color-secondary-variant"),
        "background": colorVarRGB("--color-background"),
        "surface": colorVarRGB("--color-surface"),
        "error": colorVarRGB("--color-error"),
        "on-primary": colorVarRGB("--color-on-primary"),
        "on-secondary": colorVarRGB("--color-on-secondary"),
        "on-background": colorVarRGB("--color-on-background"),
        "on-surface": colorVarRGB("--color-on-surface"),
        "on-error": colorVarRGB("--color-on-error"),
      },
      contrast: {
        25: "25%",
      },
      transitionProperty: {
        "width": "width",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
