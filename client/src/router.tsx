import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/root-layout";
import AddNewUser from "./pages/add-new-user";
import Home from "./pages/home";
import SuccessfulActivation from "./pages/successful-activation";
import FailedActivation from "./pages/failed-activation";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "add-user", element: <AddNewUser /> },
      { path: "successful-activation", element: <SuccessfulActivation /> },
      { path: "failed-activation", element: <FailedActivation /> },
    ],
  },
]);
