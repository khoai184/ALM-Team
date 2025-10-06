import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

export default function MainLayout() {
	return (
		<>
		<div className="min-h-screen flex flex-col">
			<main className="flex-1">
				{/* Outlet rất quan trọng để render page con */}
				<Outlet />
			</main>
			<Footer />
		</div>
		</>
	);
}