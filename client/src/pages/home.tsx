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
      <Link title="Go to Projects" to="/projects">Lista projektów</Link>
    </PageCard>
  );
}
