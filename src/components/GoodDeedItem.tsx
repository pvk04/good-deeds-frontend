import { useState } from "react";

interface GoodDeed {
	id: number;
	title: string;
	description: string;
	completed: boolean;
	editing?: boolean;
	editingTitle?: string;
	editingDescription?: string;
}

interface GoodDeedItemProps {
	deed: GoodDeed;
	onCompleteToggle: (deed: GoodDeed) => void;
	onDelete: (id: number) => void;
	onUpdate: (deed: GoodDeed) => void;
	onToggleEdit: (id: number) => void;
	onInputChange: (id: number, field: keyof GoodDeed, value: string) => void;
}

export default function GoodDeedItem({ deed, onCompleteToggle, onDelete, onUpdate, onToggleEdit, onInputChange }: GoodDeedItemProps) {
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onUpdate(deed);
	};

	return (
		<li className="border p-4 mb-2 rounded">
			{deed.editing ? (
				<form onSubmit={handleSubmit}>
					<input
						className="mb-2 p-2 border rounded w-full"
						type="text"
						value={deed.editingTitle}
						onChange={(e) => onInputChange(deed.id, "editingTitle", e.target.value)}
					/>
					<input
						className="mb-2 p-2 border rounded w-full"
						type="text"
						value={deed.editingDescription}
						onChange={(e) => onInputChange(deed.id, "editingDescription", e.target.value)}
					/>
					<div className="flex justify-between">
						<button className="bg-green-500 text-white p-2 rounded" type="submit">
							Save
						</button>
						<button className="bg-gray-500 text-white p-2 rounded" onClick={() => onToggleEdit(deed.id)}>
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
						<button className="bg-yellow-500 text-white p-2 rounded" onClick={() => onCompleteToggle(deed)}>
							{deed.completed ? "Mark as Incomplete" : "Mark as Completed"}
						</button>
						<button className="bg-blue-500 text-white p-2 rounded" onClick={() => onToggleEdit(deed.id)}>
							Edit
						</button>
						<button className="bg-red-500 text-white p-2 rounded" onClick={() => onDelete(deed.id)}>
							Delete
						</button>
					</div>
				</div>
			)}
		</li>
	);
}
