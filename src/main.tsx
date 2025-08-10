import { createRoot } from "react-dom/client";
import { SolanaContext } from "./SolanaContextProvider.tsx";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <SolanaContext>
    <App />
  </SolanaContext>
);
