import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WebFont from "webfontloader";

import App from "./App.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import "./index.css";

WebFont.load({
  google: {
    families: ["Inter:300,400italic,600,700", "sans-serif"],
  },
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
