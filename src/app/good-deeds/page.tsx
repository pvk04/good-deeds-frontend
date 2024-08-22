"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

export default function GoodDeeds() {
	const [goodDeeds, setGoodDeeds] = useState([]);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	useEffect(() => {
		axios
			.get("/api/good-deeds")
			.then((response) => setGoodDeeds(response.data))
			.catch((error) => console.error("Error fetching good deeds:", error));
	}, []);

	const handleAddDeed = async () => {
		try {
			const response = await axios.post("/api/good-deeds", { title, description });
			// setGoodDeeds([...goodDeeds, response.data]);
			setTitle("");
			setDescription("");
		} catch (error) {
			console.error("Error adding good deed:", error);
		}
	};

	return (
		<ProtectedRoute>
			<div className="min-h-screen p-6">
				<h1 className="text-3xl mb-4">Your Good Deeds</h1>
				<ul className="mb-4">
					{/* {goodDeeds.map((deed) => (
					<li key={deed.id} className="border p-2 mb-2">
						{deed.title}
					</li>
				))} */}
				</ul>
				<div>
					<input className="mb-2 p-2 border" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
					<input
						className="mb-2 p-2 border"
						type="text"
						placeholder="Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<button className="bg-blue-500 text-white p-2 rounded" onClick={handleAddDeed}>
						Add Good Deed
					</button>
				</div>
			</div>
		</ProtectedRoute>
	);
}
