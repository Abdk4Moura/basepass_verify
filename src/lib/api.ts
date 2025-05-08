// Function to get token from localStorage
export const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('accessToken');
    }
    return null;
};

// Base function for making API requests
interface RequestOptions extends RequestInit {
    needsAuth?: boolean;
    isFormData?: boolean; // Flag for FormData requests
}

export const apiRequest = async <T = any>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> => {
    const { needsAuth = true, isFormData = false, ...fetchOptions } = options;
    const headers = new Headers(fetchOptions.headers || {});
    const token = getToken();

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiBaseUrl) {
        console.error("ERROR: NEXT_PUBLIC_API_URL environment variable is not set.");
        // Handle this error appropriately - maybe default or throw harder
        throw new Error("API base URL is not configured.");
    }

    if (needsAuth) {
        if (!token) {
            // Handle unauthorized access - maybe redirect to login?
            // For now, throw an error that can be caught by the caller
            console.error('API Request Error: No auth token found for protected route.');
            if (typeof window !== 'undefined') {
                 window.location.href = '/login'; // Simple redirect
            }
             throw new Error('Unauthorized: No token found.');
        }
        headers.set('Authorization', `Bearer ${token}`);
    }

    // Set Content-Type header unless it's FormData (browser sets it with boundary)
    // or if it's explicitly set in options
    if (!isFormData && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

     // Ensure body is stringified if it's JSON and not FormData
     let body = fetchOptions.body;
     if (body && typeof body !== 'string' && !(body instanceof FormData) && headers.get('Content-Type') === 'application/json') {
         body = JSON.stringify(body);
     }


    try {
        const response = await fetch(`${apiBaseUrl}${endpoint}`, {
            ...fetchOptions,
            headers,
            body, // Use potentially stringified body
        });

        if (!response.ok) {
            let errorData;
            try {
                 // Try to parse error details from JSON response
                errorData = await response.json();
            } catch (e) {
                // If response is not JSON or empty
                errorData = { detail: response.statusText || 'Unknown error' };
            }
            // Include status code in the error for better handling
            const error = new Error(errorData.detail || 'API request failed') as any;
            error.status = response.status;
            error.data = errorData; // Attach full error data if available
            throw error;
        }

        // Handle cases with no content (e.g., 204 No Content)
        if (response.status === 204) {
            return {} as T; // Return an empty object or adjust as needed
        }

        // Assume JSON response for other successful requests
        const data: T = await response.json();
        return data;

    } catch (error) {
        console.error(`API Request Error (${options.method || 'GET'} ${endpoint}):`, error);
        // Re-throw the error so the calling component can handle it
        throw error;
    }
};

// Helper functions for common methods
export const apiGet = <T = any>(endpoint: string, options: RequestOptions = {}) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' });

export const apiPost = <T = any>(endpoint: string, body: any, options: RequestOptions = {}) =>
    apiRequest<T>(endpoint, { ...options, method: 'POST', body });

export const apiPut = <T = any>(endpoint: string, body: any, options: RequestOptions = {}) =>
    apiRequest<T>(endpoint, { ...options, method: 'PUT', body });

export const apiPatch = <T = any>(endpoint: string, body: any, options: RequestOptions = {}) =>
    apiRequest<T>(endpoint, { ...options, method: 'PATCH', body });

export const apiDelete = <T = any>(endpoint: string, options: RequestOptions = {}) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' });

// Function to store token
export const storeToken = (token: string): void => {
     if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', token);
    }
};

// Function to remove token
export const removeToken = (): void => {
     if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
    }
};

// Function to get user data from token (Basic, assumes simple payload)
// In a real app, use a JWT decoding library (like jwt-decode)
// For now, we'll fetch user data from /users/me instead after login
export const getUserFromToken = (): { username: string | null, role: string | null } => {
     const token = getToken();
     if (!token) return { username: null, role: null };
     try {
        // WARNING: Basic decoding, does not verify signature! Use a library for production.
         const payloadBase64 = token.split('.')[1];
         const decodedPayload = atob(payloadBase64);
         const payload = JSON.parse(decodedPayload);
         // Assuming payload has 'sub' (username) and maybe 'role' - adjust based on backend token structure
         return { username: payload.sub || null, role: payload.role || null };
     } catch (e) {
         console.error("Failed to decode token:", e);
         removeToken(); // Remove invalid token
         return { username: null, role: null };
     }
};