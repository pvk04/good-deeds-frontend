"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { registerUser } from "@/store/slices/userSlice";

export default function SignUpPage() {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		const isValid = validateInputs({ username, email, password });

		if (!isValid) return;

		const response = await dispatch(registerUser({ username, email, password }));
		console.log(response);

		if (response?.error) {
			setError(response.payload as string);
			return;
		}

		router.push("/good-deeds"); // Перенаправление на главную страницу после успешного входа
	};

	const validateInputs = ({ username, email, password }: { username: string; email: string; password: string }) => {
		const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{4,19}$/;
		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,19}$/;
		const isValid = usernameRegex.test(username) && emailRegex.test(email) && passwordRegex.test(password);

		if (!isValid) {
			setError(
				"Username should be 5-20 symbols, email should be valid and password should be 6-20 symbols with at least one number and one letter"
			);
		}

		return isValid;
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
				<p className="text-red-600">{error}</p>
				<button className="bg-blue-500 text-white p-2 rounded" type="submit">
					Register
				</button>
			</form>
			<p className="mt-4">
				Already registered?{" "}
				<Link href="/sign-in" className="text-blue-500">
					Log in here
				</Link>
			</p>
		</div>
	);
}
