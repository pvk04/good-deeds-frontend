import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";

interface MainLayoutProps {
	children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
	return (
		<ProtectedRoute>
			<Header />
			{children}
		</ProtectedRoute>
	);
}
