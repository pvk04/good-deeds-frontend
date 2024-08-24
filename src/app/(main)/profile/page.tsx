"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/api";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { logout } from "@/store/slices/userSlice";

interface UserProfile {
	id: number;
	username: string;
	email: string;
}

interface Friendship {
	id: number;
	user: {
		id: number;
		username: string;
	};
}

interface Errors {
	username?: string;
	email?: string;
}

export default function UserProfilePage() {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [friends, setFriends] = useState<Friendship[]>([]);
	const [incomingRequests, setIncomingRequests] = useState<Friendship[]>([]);
	const [outgoingRequests, setOutgoingRequests] = useState<Friendship[]>([]);
	const [newFriendUsername, setNewFriendUsername] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [newUsername, setNewUsername] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [errors, setErrors] = useState<Errors>({});

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await api.get("/users");
				setProfile(response.data);
				setNewUsername(response.data.username);
				setNewEmail(response.data.email);
			} catch (error) {
				console.error("Error fetching profile:", error);
			}
		};

		const fetchFriendData = async () => {
			try {
				const response = await api.get("/friends");

				setFriends(response.data.friendships);
				setIncomingRequests(response.data.incoming);
				setOutgoingRequests(response.data.outgoing);
			} catch (error) {
				console.error("Error fetching friends and requests:", error);
			}
		};

		fetchProfile();
		fetchFriendData();
	}, []);

	const handleEditToggle = () => {
		setIsEditing(!isEditing);
	};

	const validateProfileInputs = ({ username, email }: { username: string; email: string }) => {
		const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{4,19}$/;
		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		let isValid = true;
		setErrors({});

		if (!usernameRegex.test(username)) {
			setErrors((prevErrors) => ({ ...prevErrors, username: "Username should be 5-20 symbols" }));
			isValid = false;
		}
		if (!emailRegex.test(email)) {
			setErrors((prevErrors) => ({ ...prevErrors, email: "Email should be valid" }));
			isValid = false;
		}

		return isValid;
	};

	const handleSaveChanges = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!profile) return;
		if (!validateProfileInputs({ username: newUsername, email: newEmail })) return;

		try {
			const updatedProfile = {
				...profile,
				username: newUsername,
				email: newEmail,
			};
			const response = await api.patch(`/users`, updatedProfile);
			setProfile(response.data);
			setIsEditing(false);
		} catch (error) {
			console.error("Error updating profile:", error);
		}
	};

	const handleDeleteProfile = async () => {
		if (!profile) return;

		try {
			await api.delete(`/users`);
			setProfile(null);
			alert("Profile deleted successfully.");
			dispatch(logout());
			router.push("/sign-up");
		} catch (error) {
			console.error("Error deleting profile:", error);
		}
	};

	const handleAddFriend = async () => {
		try {
			const response = await api.post("/friends", { username: newFriendUsername });
			console.log(response);

			setOutgoingRequests([...outgoingRequests, response.data]);
			setNewFriendUsername("");
		} catch (error) {
			console.error("Error adding friend:", error);
		}
	};

	const handleCancelRequest = async (requestId: number) => {
		try {
			await api.delete(`/friends/${requestId}`);
			setOutgoingRequests(outgoingRequests.filter((request) => request.id !== requestId));
		} catch (error) {
			console.error("Error cancelling friend request:", error);
		}
	};

	const handleAcceptRequest = async (requestId: number) => {
		try {
			const response = await api.patch(`/friends/${requestId}`);

			setFriends([...friends, response.data]);
			setIncomingRequests(incomingRequests.filter((request) => request.id !== requestId));
		} catch (error) {
			console.error("Error responding to friend request:", error);
		}
	};

	const handleDeleteFriend = async (friendId: number) => {
		try {
			await api.delete(`/friends/${friendId}`);

			setFriends(friends.filter((friend) => friend.id !== friendId));
			setIncomingRequests(incomingRequests.filter((request) => request.id !== friendId));
		} catch (error) {
			console.error("Error deleting friend:", error);
		}
	};

	const handleFriendClick = (username: string) => {
		router.push(`/good-deeds/${username}`);
	};

	return (
		<div className="min-h-screen p-6 flex flex-col items-center">
			<h1 className="text-3xl mb-4">Profile Page</h1>
			{profile ? (
				<div className="border p-4 rounded w-full max-w-md">
					{isEditing ? (
						<form onSubmit={handleSaveChanges}>
							<input
								className="mb-2 p-2 border rounded w-full"
								type="text"
								placeholder="Username"
								value={newUsername}
								onChange={(e) => setNewUsername(e.target.value)}
							/>
							<p className="text-red-600">{errors.username}</p>
							<input
								className="mb-2 p-2 border rounded w-full"
								type="email"
								placeholder="Email"
								value={newEmail}
								onChange={(e) => setNewEmail(e.target.value)}
							/>
							<p className="text-red-600">{errors.email}</p>
							<div className="flex justify-between">
								<button className="bg-green-500 text-white p-2 rounded" type="submit">
									Save
								</button>
								<button className="bg-gray-500 text-white p-2 rounded" onClick={handleEditToggle}>
									Cancel
								</button>
							</div>
						</form>
					) : (
						<div>
							<p className="text-lg font-semibold">Username: {profile.username}</p>
							<p className="text-lg">Email: {profile.email}</p>
							<div className="flex justify-between mt-4">
								<button className="bg-blue-500 text-white p-2 rounded" onClick={handleEditToggle}>
									Edit Profile
								</button>
								<button className="bg-red-500 text-white p-2 rounded" onClick={handleDeleteProfile}>
									Delete Profile
								</button>
							</div>
						</div>
					)}
				</div>
			) : (
				<p>Loading profile...</p>
			)}
			<div className="w-full max-w-md mt-8">
				<div className="mb-4">
					<input
						className="mb-2 p-2 border rounded w-full"
						type="text"
						placeholder="Enter friend's username"
						value={newFriendUsername}
						onChange={(e) => setNewFriendUsername(e.target.value)}
					/>
					<button className="bg-green-500 text-white p-2 rounded w-full" onClick={handleAddFriend}>
						Add Friend
					</button>
				</div>
				<h2 className="text-2xl mb-4">Friends List</h2>
				<ul className="w-full">
					{friends.map(({ id, user }) => (
						<li
							key={id}
							className="border p-4 mb-2 rounded cursor-pointer hover:bg-gray-100 flex justify-between items-center"
							onClick={() => handleFriendClick(user.username)}
						>
							{user.username}
							<button
								className="bg-red-500 text-white p-2 rounded"
								onClick={(e) => {
									e.stopPropagation();
									handleDeleteFriend(id);
								}}
							>
								Delete
							</button>
						</li>
					))}
				</ul>
			</div>

			<div className="w-full max-w-md mt-8">
				<h2 className="text-2xl mb-4">Incoming Friend Requests</h2>
				<ul className="w-full">
					{incomingRequests.map(({ id, user }) => (
						<li key={id} className="border p-4 mb-2 rounded flex justify-between items-center">
							{user.username}
							<div className="flex space-x-2">
								<button className="bg-green-500 text-white p-2 rounded" onClick={() => handleAcceptRequest(id)}>
									Accept
								</button>
								<button className="bg-red-500 text-white p-2 rounded" onClick={() => handleDeleteFriend(id)}>
									Reject
								</button>
							</div>
						</li>
					))}
				</ul>
			</div>

			<div className="w-full max-w-md mt-8">
				<h2 className="text-2xl mb-4">Outgoing Friend Requests</h2>
				<ul className="w-full">
					{outgoingRequests.map(({ id, user }) => (
						<li key={id} className="border p-4 mb-2 rounded flex justify-between items-center">
							{user.username}
							<button className="bg-red-500 text-white p-2 rounded" onClick={() => handleCancelRequest(id)}>
								Cancel
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
