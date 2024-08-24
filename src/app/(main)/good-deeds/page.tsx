"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/api";

interface GoodDeed {
	id: number;
	title: string;
	description: string;
	completed: boolean;
	editing?: boolean;
	editingTitle?: string;
	editingDescription?: string;
}

export default function GoodDeeds() {
	const [goodDeeds, setGoodDeeds] = useState<GoodDeed[]>([]);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	const fetchGoodDeeds = useCallback(async () => {
		try {
			const response = await api.get("/good-deeds");
			setGoodDeeds(response.data);
		} catch (error) {
			console.error("Error fetching good deeds:", error);
		}
	}, []);

	useEffect(() => {
		fetchGoodDeeds();
	}, [fetchGoodDeeds]);

	const handleAddDeed = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await api.post("/good-deeds", { title, description });
			setGoodDeeds((prevDeeds) => [...prevDeeds, response.data]);
			setTitle("");
			setDescription("");
		} catch (error) {
			console.error("Error adding good deed:", error);
		}
	};

	const updateDeed = async (deed: GoodDeed) => {
		try {
			const updatedDeed = {
				...deed,
				title: deed.editingTitle ?? deed.title,
				description: deed.editingDescription ?? deed.description,
				editing: false,
			};
			const response = await api.patch(`/good-deeds/${deed.id}`, updatedDeed);
			setGoodDeeds((prevDeeds) => prevDeeds.map((d) => (d.id === deed.id ? response.data : d)));
		} catch (error) {
			console.error("Error updating good deed:", error);
		}
	};

	const handleUpdateDeed = (e: React.FormEvent, deed: GoodDeed) => {
		e.preventDefault();

		updateDeed(deed);
	};

	const handleDeleteDeed = async (id: number) => {
		try {
			await api.delete(`/good-deeds/${id}`);
			setGoodDeeds((prevDeeds) => prevDeeds.filter((deed) => deed.id !== id));
		} catch (error) {
			console.error("Error deleting good deed:", error);
		}
	};

	const toggleEditDeed = (id: number) => {
		setGoodDeeds((prevDeeds) =>
			prevDeeds.map((deed) =>
				deed.id === id
					? {
							...deed,
							editing: !deed.editing,
							editingTitle: deed.title,
							editingDescription: deed.description,
					  }
					: deed
			)
		);
	};

	const handleCompleteToggle = (deed: GoodDeed) => {
		updateDeed({ ...deed, completed: !deed.completed });
	};

	const handleInputChange = (id: number, field: keyof GoodDeed, value: string) => {
		setGoodDeeds((prevDeeds) => prevDeeds.map((deed) => (deed.id === id ? { ...deed, [field]: value } : deed)));
	};

	return (
		<div className="min-h-screen p-6 flex flex-col items-center">
			<h1 className="text-3xl mb-4">Your Good Deeds</h1>
			<form className="mb-4 w-full" onSubmit={handleAddDeed}>
				<input
					className="mb-2 p-2 border rounded w-full"
					type="text"
					placeholder="Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<input
					className="mb-2 p-2 border rounded w-full"
					type="text"
					placeholder="Description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
				<button className="bg-blue-500 text-white p-2 rounded w-full" type="submit">
					Add Good Deed
				</button>
			</form>
			<ul className="w-full">
				{goodDeeds.map((deed) => (
					<li key={deed.id} className="border p-4 mb-2 rounded">
						{deed.editing ? (
							<form onSubmit={(e) => handleUpdateDeed(e, deed)}>
								<input
									className="mb-2 p-2 border rounded w-full"
									type="text"
									value={deed.editingTitle}
									onChange={(e) => handleInputChange(deed.id, "editingTitle", e.target.value)}
								/>
								<input
									className="mb-2 p-2 border rounded w-full"
									type="text"
									value={deed.editingDescription}
									onChange={(e) => handleInputChange(deed.id, "editingDescription", e.target.value)}
								/>
								<div className="flex justify-between">
									<button className="bg-green-500 text-white p-2 rounded" type="submit">
										Save
									</button>
									<button className="bg-gray-500 text-white p-2 rounded" onClick={() => toggleEditDeed(deed.id)}>
										Cancel
									</button>
								</div>
							</form>
						) : (
							<div>
								<p className="text-lg font-semibold">{deed.title}</p>
								<p className="text-gray-700">{deed.description}</p>
								<p className={`text-sm ${deed.completed ? "text-green-500" : "text-red-500"}`}>
									{deed.completed ? "Completed" : "Not completed yet"}
								</p>
								<div className="flex gap-3 mt-2">
									<button className="bg-yellow-500 text-white p-2 rounded" onClick={() => handleCompleteToggle(deed)}>
										{deed.completed ? "Mark as Incomplete" : "Mark as Completed"}
									</button>
									<button className="bg-blue-500 text-white p-2 rounded" onClick={() => toggleEditDeed(deed.id)}>
										Edit
									</button>
									<button className="bg-red-500 text-white p-2 rounded" onClick={() => handleDeleteDeed(deed.id)}>
										Delete
									</button>
								</div>
							</div>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}
