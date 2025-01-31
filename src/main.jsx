import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Calls from "./Calls";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/soho-dark/theme.css";
// import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./index.css";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Calls base_url={import.meta.env.VITE_BASE_URL} />
    </QueryClientProvider>
  </React.StrictMode>
);
