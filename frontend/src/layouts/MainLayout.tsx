import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
	return (
		<>
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1 p-4 md:p-6 bg-gray-50">
				{/* Outlet rất quan trọng để render page con */}
				<Outlet />
			</main>
			<Footer />
		</div>
		</>
	);
}