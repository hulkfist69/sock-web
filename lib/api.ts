import { getToken } from "./auth";
import type { ApiResult, User, Household, Room, Message } from "./types";

const BASE_URL = "https://sock-app-backend-2748ac31558f.herokuapp.com/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { ...getHeaders(), ...(options.headers as Record<string, string> ?? {}) },
    });

    let data: unknown;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (res.ok) {
      return { success: true, data: data as T, statusCode: res.status };
    }

    const errData = data as Record<string, string>;
    return {
      success: false,
      error: errData?.message ?? errData?.error ?? "Unknown error",
      statusCode: res.status,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Network error",
      statusCode: 0,
    };
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function login(usernameOrEmail: string, password: string) {
  return request<{ token: string; user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ usernameOrEmail, password }),
  });
}

export async function register(
  username: string,
  password: string,
  email?: string
) {
  return request<{ token: string; user: User }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password, email }),
  });
}

export async function verifyToken() {
  return request<{ user: User }>("/auth/verify");
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getCurrentUser() {
  return request<User>("/users/me");
}

export async function updateCurrentUser(body: {
  display_name?: string;
  profile_image_url?: string;
}) {
  return request<User>("/users/me", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteCurrentUser() {
  return request("/users/me", { method: "DELETE" });
}

// ─── Households ───────────────────────────────────────────────────────────────

export async function getHouseholds() {
  return request<{ households: Household[] }>("/households/mine");
}

export async function createHousehold(
  household_name: string,
  password: string
) {
  return request<{ household: Household }>("/households", {
    method: "POST",
    body: JSON.stringify({ household_name, password }),
  });
}

export async function joinHousehold(
  household_code: string,
  password: string
) {
  return request<{ household: Household }>("/households/join", {
    method: "POST",
    body: JSON.stringify({ household_code, password }),
  });
}

export async function getHousehold(id: string) {
  return request<{ household: Household; members: unknown[]; rooms: Room[] }>(
    `/households/${id}`
  );
}

export async function updateHousehold(
  id: string,
  body: { household_name?: string; allow_member_room_management?: boolean }
) {
  return request<{ household: Household }>(`/households/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function deleteHousehold(id: string) {
  return request(`/households/${id}`, { method: "DELETE" });
}

export async function leaveHousehold(id: string) {
  return request(`/households/${id}/leave`, { method: "POST" });
}

export async function getHouseholdMembers(id: string) {
  return request<{ members: unknown[] }>(`/households/${id}/members`);
}

export async function setMemberRole(
  householdId: string,
  userId: string,
  role: string
) {
  return request(`/households/${householdId}/members/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export async function removeMember(householdId: string, userId: string) {
  return request(
    `/households/${householdId}/members/${userId}`,
    { method: "DELETE" }
  );
}

export async function setActiveHousehold(householdId: string) {
  return request("/households/preferences/active-household", {
    method: "POST",
    body: JSON.stringify({ household_id: householdId }),
  });
}

export async function setActiveRoom(householdId: string, roomId?: string) {
  return request("/households/preferences/active-room", {
    method: "POST",
    body: JSON.stringify({ household_id: householdId, room_id: roomId }),
  });
}

export async function regenerateHouseholdCode(id: string) {
  return request(`/households/${id}/regen-code`, { method: "POST" });
}

export async function resetAllHouseholdStatuses(id: string) {
  return request(`/households/${id}/reset-statuses`, { method: "POST" });
}

// ─── Rooms ────────────────────────────────────────────────────────────────────

export async function getHouseholdRooms(householdId: string) {
  return request<{ rooms: Room[] }>(`/rooms/household/${householdId}`);
}

export async function createRoom(
  householdId: string,
  roomName: string,
  password?: string
) {
  const body: Record<string, string> = {
    household_id: householdId,
    room_name: roomName,
  };
  if (password) body.password = password;
  return request<{ room: Room }>("/rooms", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function joinRoom(roomId: string, password?: string) {
  return request(`/rooms/${roomId}/join`, {
    method: "POST",
    body: JSON.stringify(password ? { password } : {}),
  });
}

export async function leaveRoom(roomId: string) {
  return request(`/rooms/${roomId}/leave`, { method: "POST" });
}

export async function updateRoomStatus(
  roomId: string,
  status: string,
  adminReset = false
) {
  return request<{ room: Room }>(`/rooms/${roomId}/status`, {
    method: "PUT",
    body: JSON.stringify(adminReset ? { status, admin_reset: true } : { status }),
  });
}

export async function updateRoom(
  roomId: string,
  body: { room_name?: string; password?: string }
) {
  return request<{ room: Room }>(`/rooms/${roomId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function deleteRoom(roomId: string) {
  return request(`/rooms/${roomId}`, { method: "DELETE" });
}

export async function getRoomMembers(roomId: string) {
  return request<{ members: unknown[] }>(`/rooms/${roomId}/members`);
}

export async function addUserToRoom(roomId: string, userId: string) {
  return request(`/rooms/${roomId}/members`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

export async function removeUserFromRoom(roomId: string, userId: string) {
  return request(`/rooms/${roomId}/members/${userId}`, { method: "DELETE" });
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export async function getHouseholdMessages(
  householdId: string,
  limit = 50,
  offset = 0,
  before?: string
) {
  let url = `/messages/household/${householdId}?limit=${limit}&offset=${offset}`;
  if (before) url += `&before=${encodeURIComponent(before)}`;
  return request<{ messages: Message[] }>(url);
}

export async function sendMessage(
  householdId: string,
  content: string,
  message_type = "text"
) {
  return request<{ message: Message }>(
    `/messages/household/${householdId}`,
    {
      method: "POST",
      body: JSON.stringify({ content, message_type }),
    }
  );
}
