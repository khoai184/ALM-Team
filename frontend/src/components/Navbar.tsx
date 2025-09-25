import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between">
      <div className="font-bold">CodeGym Portal</div>
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/courses">Courses</Link>
      </div>
    </nav>
  );
}
