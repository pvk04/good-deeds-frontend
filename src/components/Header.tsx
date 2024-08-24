"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { logout } from "@/store/slices/userSlice";

export default function Header() {
	const dispatch = useAppDispatch();
	const router = useRouter();
	function handleLogout() {
		dispatch(logout());
		router.push("/sign-in");
	}

	return (
		<header className="bg-blue-600 text-white p-4 shadow-md">
			<div className="container mx-auto flex justify-between items-center">
				<div className="text-lg font-bold">
					<span>GoodDeeds</span>
				</div>
				<nav>
					<ul className="flex space-x-4">
						<li>
							<Link href="/profile">
								<span className="hover:text-gray-300">Профиль</span>
							</Link>
						</li>
						<li>
							<Link href="/good-deeds">
								<span className="hover:text-gray-300">Добрые Дела</span>
							</Link>
						</li>
						<li>
							<button onClick={handleLogout}>
								<span className="hover:text-gray-300">Выход</span>
							</button>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
}
