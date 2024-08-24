import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/api";

// Интерфейс состояния
interface UserState {
	user: {
		id: number;
		username: string;
		email: string;
	} | null;
	status: "idle" | "loading" | "succeeded" | "failed"; // Статус загрузки
	error: string | null;
}

// Начальное состояние
const initialState: UserState = {
	user: null,
	status: "idle",
	error: null,
};

// Асинхронный thunk для авторизации
export const loginUser = createAsyncThunk("user/loginUser", async (credentials: { username: string; password: string }, { rejectWithValue }) => {
	try {
		const response = await api.post("/auth/login", credentials);
		const data = response.data;

		return { user: data.user, token: data.accessToken };
	} catch (error: any) {
		return rejectWithValue(error.response?.data?.message || error.message);
	}
});

// Асинхронный thunk для регистрации
export const registerUser = createAsyncThunk(
	"user/registerUser",
	async (userData: { username: string; email: string; password: string }, { rejectWithValue }) => {
		try {
			const response = await api.post("/auth/register", userData);
			const data = response.data;

			return { user: data.user, token: data.accessToken };
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || error.message);
		}
	}
);

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		logout: (state) => {
			localStorage.removeItem("token");
			state.user = null;
			state.status = "idle";
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		// Регистрация пользователя
		builder
			.addCase(registerUser.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(registerUser.fulfilled, (state, action: PayloadAction<{ user: UserState["user"]; token: string }>) => {
				const { token, user } = action.payload;
				localStorage.setItem("token", JSON.stringify(token));
				state.user = user;
				state.status = "succeeded";
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload as string;
			});

		// Авторизация пользователя
		builder
			.addCase(loginUser.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: UserState["user"]; token: string }>) => {
				const { token, user } = action.payload;
				
				localStorage.setItem("token", JSON.stringify(token));
				state.user = user;
				state.status = "succeeded";
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload as string;
			});
	},
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
