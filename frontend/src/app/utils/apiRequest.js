import apiClient from "./apiClient";
import { encrypt, decrypt } from "@/app/utils/encription";

/**
 * Universal API request handler
 * @param {string} method - HTTP method: GET, POST, PUT, DELETE
 * @param {string} endpoint - API endpoint
 * @param {object} data - request payload
 * @param {string} role - 'user' or 'admin' 
 * @returns {Promise<object>} response data
 */
export const makeRequest = async ({ method, endpoint, data = {}, role = "user" }) => {
  try {
    // Extract token if exists
    const token = data?.jwtToken;
    if (token) delete data?.jwtToken;

    // Encrypt payload only for POST/PUT
    let payload = ["POST", "PUT"].includes(method.toUpperCase()) ? encrypt(data) : null;

    // Build URL params for GET/DELETE
    let url = `${role}/${endpoint}`;
    if (["GET", "DELETE"].includes(method.toUpperCase()) && data) {
      const params = Object.entries(data)
        .filter(([key, _]) => key !== "jwtToken")
        .map(([key, val]) => val)
        .join("/");
      if (params) url += `/${params}`;
    }

    // Axios config
    const config = {
      method,
      url,
      headers: token ? { jwt_token: token } : {}
    };

    if (payload) config.data = payload;

    const res = await apiClient(config);

    if (!res || !res.data) throw new Error("Invalid response from server");

    if (res.status == 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_token");
        window.location.href = role === "admin" ? "/admin/login" : "/user/signin";
      }
      return;
    }

    const decryptedData = decrypt(res.data);

    try {
      return JSON.parse(decryptedData);
    } catch {
      throw new Error("Invalid response format from server");
    }
  } catch (error) {
    return error;
  }
};
