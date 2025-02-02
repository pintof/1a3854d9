import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrimeReactProvider } from "primereact/api";
import Calls from "./Calls";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primereact/resources/primereact.css";
import "./index.css";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* Tanstack's context provider to invalidate & refetch endpoints app wide after a fetch or mutation */}
    <QueryClientProvider client={queryClient}>
      {/* Prime React's context provider to switch between light & dark themes dynamically app wide */}
      <PrimeReactProvider>
        <Calls base_url={import.meta.env.VITE_BASE_URL} />
      </PrimeReactProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
