import { extendTheme, StyleFunctionProps } from "@chakra-ui/react";

const customTheme = {
  fonts: {
    heading: `Satoshi, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
    body: `Satoshi, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
  },
  colors: {
    brand: {
      grass: "#606C38",
      forest: "#283618",
      neutral: "#FEFAE0",
      mud: "#DDA15E",
      sand: "#BC6C25",
    },
  },
  // components: {
  //   Button: {
  //     // 1. We can update the base styles
  //     baseStyle: {
  //       fontWeight: "bold", // Normally, it is "semibold"
  //     },
  //     // 2. We can add a new button size or extend existing
  //     sizes: {
  //       xl: {
  //         h: "56px",
  //         fontSize: "lg",
  //         px: "32px",
  //       },
  //     },
  //     // 3. We can add a new visual variant
  //     variants: {
  //       "with-shadow": {
  //         bg: "red.400",
  //         boxShadow: "0 0 2px 2px #efdfde",
  //       },
  //       // 4. We can override existing variants
  //       solid: (props: StyleFunctionProps) => ({
  //         bg: props.colorMode === "dark" ? "red.300" : "red.500",
  //       }),
  //     },
  //     // 6. We can overwrite defaultProps
  //     defaultProps: {
  //       size: "lg", // default is md
  //       variant: "sm", // default is solid
  //       colorScheme: "green", // default is gray
  //     },
  //   },
  // },
};

export const theme = extendTheme({ ...customTheme });
