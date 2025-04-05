import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/themes.js";

createRoot(document.getElementById("root")).render(
   <StrictMode>
      <ChakraProvider theme={theme}>
         <BrowserRouter>
            <App />
         </BrowserRouter>
      </ChakraProvider>
   </StrictMode>
);
