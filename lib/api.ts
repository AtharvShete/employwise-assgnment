const API_BASE_URL = "https://reqres.in/api";

// Define interfaces for type safety
interface User {
	id: number;
	email: string;
	first_name: string;
	last_name: string;
	avatar: string;
}

interface UserUpdateData {
	name?: string;
	job?: string;
	email?: string;
	first_name?: string;
	last_name?: string;
}

interface PaginatedResponse<T> {
	page: number;
	per_page: number;
	total: number;
	total_pages: number;
	data: T[];
}

const handleResponse = async (response: Response) => {
	if (!response.ok) {
		const error = await response.text();
		throw new Error(error || "An error occurred with the request");
	}

	const contentType = response.headers.get("content-type");
	if (contentType && contentType.includes("application/json")) {
		return await response.json();
	}
	return null;
};

const getAuthHeaders = () => {
	const token = localStorage.getItem("token");
	return {
		"Content-Type": "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};
};

export const fetchData = async <T>(endpoint: string): Promise<T> => {
	try {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			headers: getAuthHeaders(),
		});
		return await handleResponse(response);
	} catch (error) {
		console.error("API GET Error:", error);
		throw error;
	}
};

export const updateData = async <T>(
	endpoint: string,
	data: unknown,
): Promise<T> => {
	try {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			method: "PUT",
			headers: getAuthHeaders(),
			body: JSON.stringify(data),
		});
		return await handleResponse(response);
	} catch (error) {
		console.error("API PUT Error:", error);
		throw error;
	}
};

export const deleteData = async (endpoint: string): Promise<void> => {
	try {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			method: "DELETE",
			headers: getAuthHeaders(),
		});
		await handleResponse(response);
	} catch (error) {
		console.error("API DELETE Error:", error);
		throw error;
	}
};

export const userApi = {
	getUsers: (page: number) =>
		fetchData<PaginatedResponse<User>>(`/users?page=${page}`),
	updateUser: (userId: number, userData: UserUpdateData) =>
		updateData<User>(`/users/${userId}`, userData),
	deleteUser: (userId: number) => deleteData(`/users/${userId}`),
};
