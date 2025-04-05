import { extendTheme } from "@chakra-ui/react";

const config = {
   initialColorMode: "light",
   useSystemColorMode: false,
};

const colors = {
   f1: {
      50: "#ffe5e5",
      100: "#ffb3b3",
      200: "#ff8080",
      300: "#ff4d4d",
      400: "#ff1a1a",
      500: "#e10600", // Primary brand color
      600: "#c10500",
      700: "#990400",
      800: "#730300",
      900: "#4d0200",
   },
};
const theme = extendTheme({ colors, config });

export default theme;
