import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

export default function Home() {
	return (
		<ProtectedRoute>
			<main className="min-h-screen flex justify-center items-center">
				<h1 className="text-4xl">Welcome to Good Deeds</h1>
			</main>
		</ProtectedRoute>
	);
}
