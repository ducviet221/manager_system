import App from "@/App";
import { CreateUser } from "@/pages/create-user/CreateUser";
import HomePage from "@/pages/home-page/HomePage";

import { createBrowserRouter } from "react-router-dom";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "/user",
        element: <CreateUser />,
      },
    ],
  },
]);
export default routes;
