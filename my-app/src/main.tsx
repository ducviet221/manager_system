import { App } from "antd";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import LazyLoading from "./components/Loading/LazyLoading.tsx";
import { LoadingProvide } from "./components/Loading/Loading.tsx";
import "./index.css";
import routes from "./routes/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LoadingProvide>
      <RouterProvider router={routes} fallbackElement={<LazyLoading />}></RouterProvider>
      <App />
    </LoadingProvide>
  </React.StrictMode>
);
