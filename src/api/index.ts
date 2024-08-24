import axios from "axios";

export const API_URL = "http://localhost:3001";

const api = axios.create({
	baseURL: API_URL,
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
	}

	return config;
});

export default api;
