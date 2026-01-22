import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/root-layout";
import AddNewUser from "./pages/users/add-new-user";
import AddAddress from "./pages/users/add-address";
import UserProfile from "./pages/users/user-profile";
import ActivateAccount from "./pages/users/activate-account";
import Projects from "./pages/projects";
import ProjectDetails from "./pages/project-details";
import DoBelbinTest from "./pages/do-belbin-test";
import BelbinResults from "./pages/user-belbin-results";
import BelbinDashboard from "./pages/belbin-dashboard";
import ExpiredTestsView from "./pages/expired-belbin-tests";
import MangerBelbinPreview from "./pages/hr-belbin-preview";
import SuccessfulActivation from "./pages/users/successful-activation";
import Home from "./pages/home/home";
import FailedActivation from "./pages/users/failed-activation";
import EditUser from "./pages/users/edit-user";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "add-user", element: <AddNewUser /> },
      { path: "edit-user/:id", element: <EditUser /> },
      { path: "users/add-address", element: <AddAddress /> },
      { path: "activate-account", element: <ActivateAccount /> },
      { path: "successful-activation", element: <SuccessfulActivation /> },
      { path: "user-profile/:id", element: <UserProfile /> },
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
