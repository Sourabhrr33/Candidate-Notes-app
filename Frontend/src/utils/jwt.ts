import {jwtDecode} from "jwt-decode";

export function getUserId(): string | null {
 const token = sessionStorage.getItem("token")
  if (!token) return null;
  try {
    // Your JWT payload should contain userId (from backend)
    const decoded: any = jwtDecode(token);
    return decoded.userId || null;
  } catch {
    return null;
  }
}
