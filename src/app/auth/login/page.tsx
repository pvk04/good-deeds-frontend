"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/api";
import Link from "next/link";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await api.post("/auth/login", { username, password });
			localStorage.setItem("token", response.data.accessToken);

			router.push("/"); // Перенаправление на главную страницу после успешного входа
		} catch (error) {
			console.error("Login failed", error);
		}
	};

	return (
		<div className="min-h-screen flex flex-col justify-center items-center">
			<form className="flex flex-col bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
				<h2 className="text-2xl mb-4">Login</h2>
				<input
					className="mb-2 p-2 border"
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					className="mb-2 p-2 border"
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button className="bg-blue-500 text-white p-2 rounded" type="submit">
					Login
				</button>
			</form>
			<p className="mt-4">
				Not registered yet?{" "}
				<Link href="/auth/register" className="text-blue-500">
					Register here
				</Link>
			</p>
		</div>
	);
}
