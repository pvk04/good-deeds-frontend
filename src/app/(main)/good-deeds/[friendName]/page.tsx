"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/api";

interface GoodDeed {
	id: number;
	title: string;
	description: string;
	completed: boolean;
}

export default function FriendGoodDeedsPage({ params }: { params: { friendName: string } }) {
	const router = useRouter();
	const [goodDeeds, setGoodDeeds] = useState<GoodDeed[]>([]);

	useEffect(() => {
		const checkFriendshipAndFetchGoodDeeds = async () => {
			try {
				const deedsResponse = await api.get(`/friends/${params.friendName}/good-deeds`);
				setGoodDeeds(deedsResponse.data);
			} catch (error) {
				console.error("Error checking friendship or fetching good deeds:", error);
				router.replace("/profile")
			}
		};

		checkFriendshipAndFetchGoodDeeds();
	}, [params.friendName]);

	return (
		<div className="min-h-screen p-6 flex flex-col items-center">
			<h1 className="text-3xl mb-4">{params.friendName}'s Good Deeds</h1>
			<ul className="w-full">
				{goodDeeds.map((deed) => (
					<li key={deed.id} className="border p-4 mb-2 rounded">
						<p className="text-lg font-semibold">{deed.title}</p>
						<p className="text-gray-700">{deed.description}</p>
						<p className={`text-sm ${deed.completed ? "text-green-500" : "text-red-500"}`}>
							{deed.completed ? "Completed" : "Not completed yet"}
						</p>
					</li>
				))}
			</ul>
			<button className="bg-gray-500 text-white p-2 rounded mt-4" onClick={() => router.back()}>
				Back
			</button>
		</div>
	);
}
