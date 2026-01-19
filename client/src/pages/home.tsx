import { Link } from "react-router-dom";
import PageCard from "../components/page-card";

export default function Home() {
  return (
    <PageCard>
      <h1 className="text-4xl font-bold">Home page 🏠</h1>
      <Link to="/add-user">Add user</Link>
      <Link to="/successful-activation">Successful activation</Link>
      <Link to="/failed-activation">Failed activation</Link>
      <Link title="Add User" to="/add-user">Dodaj użytkownika</Link>
      <Link title="Go to belbin test" to="/belbin/test">Zrób test Belbina</Link>
      <Link title="Go to belbin test result for user" to="/belbin/results">Wyniki Belbina dla usera</Link>
      <Link title="Go to belbin dashboard for user" to="/belbin/dashboard">Belbin dashboard</Link>
      <Link title="Go to expired belbin tests for hr" to="/belbin/expired">Przeterminowane testy Belbina</Link>
      <Link title="Go to belbin worker test result for hr" to="/belbin/results/user">Wyniki Belbina usera dla hr</Link>
    </PageCard>
  );
}
