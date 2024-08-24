"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/api";
import GoodDeedItem from "@/components/GoodDeedItem";

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
	const [error, setError] = useState("");

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
		setError("");

		const isTitleValid = !!title.trim();
		if (!isTitleValid) {
			setError("Title must not be empty");
			return;
		}

		try {
			const response = await api.post("/good-deeds", { title, description });
			setGoodDeeds((prevDeeds) => [response.data, ...prevDeeds]);
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
				<p className="text-red-600">{error}</p>
				<button className="bg-blue-500 text-white p-2 rounded w-full" type="submit">
					Add Good Deed
				</button>
			</form>
			<ul className="w-full">
				{goodDeeds.map((deed) => (
					<GoodDeedItem
						key={deed.id}
						deed={deed}
						onCompleteToggle={handleCompleteToggle}
						onDelete={handleDeleteDeed}
						onUpdate={updateDeed}
						onToggleEdit={toggleEditDeed}
						onInputChange={handleInputChange}
					/>
				))}
			</ul>
		</div>
	);
}
