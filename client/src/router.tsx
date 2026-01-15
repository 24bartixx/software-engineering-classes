import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/root-layout";
import AddNewUser from "./pages/add-new-user";
import Home from "./pages/home";
import SuccessfulActivation from "./pages/successful-activation";
import FailedActivation from "./pages/failed-activation";
import Projects from "./pages/projects";
import ProjectDetails from "./pages/project-details";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "add-user", element: <AddNewUser /> },
      { path: "successful-activation", element: <SuccessfulActivation /> },
      { path: "failed-activation", element: <FailedActivation /> },
      { path: "projects", element: <Projects /> },
      { path: "projects/:id", element: <ProjectDetails /> },
    ],
  },
]);
