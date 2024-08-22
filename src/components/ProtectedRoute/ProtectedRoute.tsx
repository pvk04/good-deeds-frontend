"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem("token");
		console.log(token);
		if (!token) {
			router.push("/auth/register");
		}
	}, [router]);

	return <>{children}</>;
}
