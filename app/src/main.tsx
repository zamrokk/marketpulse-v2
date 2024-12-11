import { createRoot } from "react-dom/client";
import { createThirdwebClient } from "thirdweb";
import { ThirdwebProvider } from "thirdweb/react";
import App from "./App.tsx";
import "./index.css";

const client = createThirdwebClient({
  clientId: "17b9f16583e43b7823b7c06f4b099847",
});

createRoot(document.getElementById("root")!).render(
  <ThirdwebProvider>
    <App thirdwebClient={client} />
  </ThirdwebProvider>
);
