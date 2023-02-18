import { extendTheme } from "@chakra-ui/react";

const customTheme = {
  fonts: {
    heading: `Satoshi, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
    body: `Satoshi, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
  },
};

export const theme = extendTheme({ ...customTheme });
