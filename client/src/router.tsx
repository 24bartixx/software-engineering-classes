import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/root-layout";
import AddNewUser from "./pages/users/add-new-user";
import AddAddress from "./pages/users/add-address";
import UserProfile from "./pages/users/user-profile";
import ActivateAccount from "./pages/users/activate-account";
import Projects from "./pages/projects";
import ProjectDetails from "./pages/project-details";
import DoBelbinTest from "./pages/belbin/do-belbin-test";
import BelbinResults from "./pages/belbin/user-belbin-results";
import BelbinDashboard from "./pages/belbin/belbin-dashboard";
import ExpiredTestsView from "./pages/belbin/expired-belbin-tests";
import MangerBelbinPreview from "./pages/belbin/hr-belbin-preview";
import SuccessfulActivation from "./pages/users/successful-activation";
import Home from "./pages/home/home";
import FailedActivation from "./pages/users/failed-activation";
import EditUser from "./pages/users/edit-user";
import EditAddress from "./pages/users/edit-address";
import HrBelbinDashboard from "./pages/belbin/hr-belbin-dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "add-user", element: <AddNewUser /> },
      { path: "edit-user/:id", element: <EditUser /> },
      { path: "users/add-address", element: <AddAddress /> },
      { path: "users/edit-address/:id", element: <EditAddress /> },
      { path: "activate-account", element: <ActivateAccount /> },
      { path: "successful-activation", element: <SuccessfulActivation /> },
      { path: "user-profile/:id", element: <UserProfile /> },
      { path: "failed-activation", element: <FailedActivation /> },
      { path: "projects", element: <Projects /> },
      { path: "projects/:id", element: <ProjectDetails /> },
      { path: "belbin/test/:employeeId", element: <DoBelbinTest /> },
      { path: "belbin/results/:employeeId", element: <BelbinResults /> },
      { path: "belbin/dashboard", element: <BelbinDashboard /> },
      { path: "hr/belbin/expired", element: <ExpiredTestsView /> },
      { path: "hr/belbin/results/:employeeId", element: <MangerBelbinPreview /> },
      { path: "hr/belbin/dashboard", element: <HrBelbinDashboard /> },
    ],
  },
]);
