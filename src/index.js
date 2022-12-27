import { createRoot } from "react-dom/client";
import { ChakraProvider, theme } from "@chakra-ui/react";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);
