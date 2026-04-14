// ─── Core domain types ────────────────────────────────────────────────────────

export type RoomStatus = "green" | "yellow" | "red";

export interface User {
  id: number; // SERIAL integer (not UUID)
  username: string;
  display_name: string | null;
  profile_image_url: string | null;
}

export interface Household {
  id: string; // UUID
  household_name: string;
  household_code: string; // 8-char
  allow_member_room_management: boolean;
  created_by: number;
}

export interface HouseholdMember {
  user_id: number;
  username: string;
  display_name: string | null;
  profile_image_url: string | null;
  role: "admin" | "member";
  notifications_enabled: boolean;
}

export interface Room {
  id: string; // UUID
  household_id: string;
  room_name: string;
  status: RoomStatus;
  status_set_by: number | null;
  status_changed_at: string | null;
  has_password: boolean;
}

export interface RoomMember {
  user_id: number;
  username: string;
  display_name: string | null;
  profile_image_url: string | null;
}

export type MessageType = "text" | "image" | "status_event";

export interface Message {
  id: number;
  household_id: string;
  user_id: number;
  content: string;
  message_type: MessageType;
  created_at: string;
  username: string;
  display_name: string | null;
  profile_image_url: string | null;
}

// ─── API response wrapper ─────────────────────────────────────────────────────

export interface ApiResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

// ─── Socket event payloads ────────────────────────────────────────────────────

export interface RoomStatusChangedPayload {
  roomId: string;
  status: RoomStatus;
  setBy: number;
  roomName: string;
  changedAt: string;
}

export interface NewMessagePayload extends Message {}

export interface HouseholdUpdatedPayload {
  householdId: string;
  householdName?: string;
  allowMemberRoomManagement?: boolean;
}

export interface MemberJoinedPayload {
  householdId: string;
  userId: number;
  username: string;
  displayName: string | null;
}

export interface MemberLeftPayload {
  householdId: string;
  userId: number;
}

export interface MemberRemovedPayload {
  householdId: string;
  userId: number;
}

export interface RoomCreatedPayload {
  room: Room;
}

export interface RoomDeletedPayload {
  roomId: string;
}

export interface RoomUpdatedPayload {
  room: Room;
}

export interface AllStatusesResetPayload {
  householdId: string;
  rooms: Room[];
}

export interface RoomMemberJoinedPayload {
  roomId: string;
  userId: number;
  username: string;
}

export interface RoomMemberLeftPayload {
  roomId: string;
  userId: number;
}

export interface TypingPayload {
  householdId: string;
  userId: number;
  username: string;
}

export interface MemberProfileUpdatedPayload {
  userId: number;
  displayName: string | null;
  profileImageUrl: string | null;
}
