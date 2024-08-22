"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/api";
import Link from "next/link";

export default function Register() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await api.post("/users/register", { username, email, password });
			router.push("/auth/login");
		} catch (error) {
			console.error("Registration failed", error);
		}
	};

	return (
		<div className="min-h-screen flex flex-col justify-center items-center">
			<form className="flex flex-col bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
				<h2 className="text-2xl mb-4">Register</h2>
				<input
					className="mb-2 p-2 border"
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input className="mb-2 p-2 border" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input
					className="mb-2 p-2 border"
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button className="bg-blue-500 text-white p-2 rounded" type="submit">
					Register
				</button>
			</form>
			<p className="mt-4">
				Already registered?{" "}
				<Link href="/auth/login" className="text-blue-500">
					Log in here
				</Link>
			</p>
		</div>
	);
}
