import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/root-layout";
import AddNewUser from "./pages/users/add-new-user";
import AddAddress from "./pages/users/add-address";
import Home from "./pages/home";
import ActivateAccount from "./pages/users/activate-account";
import SuccessfulActivation from "./pages/successful-activation";
import FailedActivation from "./pages/failed-activation";
import Projects from "./pages/projects";
import ProjectDetails from "./pages/project-details";
import DoBelbinTest from "./pages/do-belbin-test";
import BelbinResults from "./pages/user-belbin-results";
import BelbinDashboard from "./pages/belbin-dashboard";
import ExpiredTestsView from "./pages/expired-belbin-tests";
import MangerBelbinPreview from "./pages/hr-belbin-preview";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "add-user", element: <AddNewUser /> },
      { path: "users/add-address", element: <AddAddress /> },
      { path: "activate-account", element: <ActivateAccount /> },
      { path: "successful-activation", element: <SuccessfulActivation /> },
      { path: "failed-activation", element: <FailedActivation /> },
      { path: "projects", element: <Projects /> },
      { path: "projects/:id", element: <ProjectDetails /> },
      { path: "belbin/test", element: <DoBelbinTest /> },
      { path: "belbin/results", element: <BelbinResults /> },
      { path: "belbin/dashboard", element: <BelbinDashboard /> },
      { path: "belbin/expired", element: <ExpiredTestsView /> },
      { path: "belbin/results/user", element: <MangerBelbinPreview /> },
    ],
  },
]);
