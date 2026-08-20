import axiosInstance from "./axiosInstance";

export const signupUser = (data) => axiosInstance.post("/auth/signup", data);
export const loginUser = (data) => axiosInstance.post("/auth/login", data);
export const logoutUser = () => axiosInstance.post("/auth/logout");
export const getCurrentUser = () => axiosInstance.get("/auth/me");