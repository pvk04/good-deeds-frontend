"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { loginUser } from "@/store/slices/userSlice";

export default function SignInPage() {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		const response = await dispatch(loginUser({ username, password }));

		if (response?.error) {
			setError(response.payload as string);
			return;
		}

		router.push("/good-deeds"); // Перенаправление на главную страницу после успешного входа
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
				<p className="text-red-600">{error}</p>
				<button className="bg-blue-500 text-white p-2 rounded" type="submit">
					Login
				</button>
			</form>
			<p className="mt-4">
				Not registered yet?{" "}
				<Link href="/sign-up" className="text-blue-500">
					Register here
				</Link>
			</p>
		</div>
	);
}
