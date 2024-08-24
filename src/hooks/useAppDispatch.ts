import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
// Кастомный хук для использования диспатча с типизацией
export const useAppDispatch = () => useDispatch<AppDispatch>();
