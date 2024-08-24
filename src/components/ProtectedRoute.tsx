"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.replace("/sign-in");
		}
	}, [router]);

	return <>{children}</>;
};

export default ProtectedRoute;
