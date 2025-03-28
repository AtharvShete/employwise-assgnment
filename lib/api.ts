const API_BASE_URL = "https://reqres.in/api";

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
	data: any,
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
	getUsers: (page: number) => fetchData<any>(`/users?page=${page}`),
	updateUser: (userId: number, userData: any) =>
		updateData(`/users/${userId}`, userData),
	deleteUser: (userId: number) => deleteData(`/users/${userId}`),
};
