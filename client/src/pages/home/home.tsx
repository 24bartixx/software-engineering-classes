import { Link } from "react-router-dom";
import PageCard from "../../components/page-card";

export default function Home() {
  return (
    <PageCard>
      <h1 className="text-4xl font-bold">Home page 🏠</h1>
      <Link to="/add-user">Add user</Link>
      <Link to="/activate-account">Activate account</Link>
      <Link to="/user-profile/1">User profile</Link>
      <Link to="/successful-activation">Successful activation</Link>
      <Link to="/failed-activation">Failed activation</Link>
      <Link title="Add User" to="/add-user">
        Dodaj użytkownika
      </Link>
      <Link title="Go to belbin dashboard for user" to="/belbin/dashboard">
        Belbin dashboard
      </Link>
      <Link title="Go to expired belbin tests for hr" to="/hr/belbin/expired">
        Przeterminowane testy Belbina
      </Link>
    </PageCard>
  );
}
