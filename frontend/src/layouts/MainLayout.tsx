import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
	return (
		<>
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1 p-6 bg-gray-50">
				<h1 className="text-xl font-semibold mb-4">MainLayout</h1>
				{/* Outlet rất quan trọng để render page con */}
				<Outlet />
			</main>
			<Footer />
		</div>
		</>
	);
}