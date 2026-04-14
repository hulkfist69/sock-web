"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { getToken } from "./auth";
import type {
  RoomStatusChangedPayload,
  NewMessagePayload,
  HouseholdUpdatedPayload,
  MemberJoinedPayload,
  MemberLeftPayload,
  MemberRemovedPayload,
  RoomCreatedPayload,
  RoomDeletedPayload,
  RoomUpdatedPayload,
  AllStatusesResetPayload,
  RoomMemberJoinedPayload,
  RoomMemberLeftPayload,
  TypingPayload,
  MemberProfileUpdatedPayload,
} from "./types";

const SOCKET_URL = "https://sock-app-backend-2748ac31558f.herokuapp.com";

// ─── Event handler map ────────────────────────────────────────────────────────

export interface SocketHandlers {
  onAuthenticated?: () => void;
  onRoomStatusChanged?: (payload: RoomStatusChangedPayload) => void;
  onNewMessage?: (payload: NewMessagePayload) => void;
  onHouseholdUpdated?: (payload: HouseholdUpdatedPayload) => void;
  onMemberJoined?: (payload: MemberJoinedPayload) => void;
  onMemberLeft?: (payload: MemberLeftPayload) => void;
  onMemberRemoved?: (payload: MemberRemovedPayload) => void;
  onRoomCreated?: (payload: RoomCreatedPayload) => void;
  onRoomDeleted?: (payload: RoomDeletedPayload) => void;
  onRoomUpdated?: (payload: RoomUpdatedPayload) => void;
  onAllStatusesReset?: (payload: AllStatusesResetPayload) => void;
  onRoomMemberJoined?: (payload: RoomMemberJoinedPayload) => void;
  onRoomMemberLeft?: (payload: RoomMemberLeftPayload) => void;
  onUserTypingStart?: (payload: TypingPayload) => void;
  onUserTypingStop?: (payload: TypingPayload) => void;
  onMemberProfileUpdated?: (payload: MemberProfileUpdatedPayload) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface SocketContextValue {
  isConnected: boolean;
  joinHousehold: (householdId: string) => void;
  leaveHousehold: (householdId: string) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  emitTypingStart: (householdId: string) => void;
  emitTypingStop: (householdId: string) => void;
  setHandlers: (handlers: SocketHandlers) => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export function useSocket(): SocketContextValue {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used inside SocketProvider");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const handlersRef = useRef<SocketHandlers>({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: false,
      extraHeaders: { authorization: `Bearer ${token}` },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("authenticate", token);
    });

    socket.on("authenticated", () => {
      handlersRef.current.onAuthenticated?.();
    });

    socket.on("authentication_error", () => {
      socket.disconnect();
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    // Register all domain events
    const bind = <T,>(event: string, handler: keyof SocketHandlers) => {
      socket.on(event, (data: T) => {
        (handlersRef.current[handler] as ((d: T) => void) | undefined)?.(data);
      });
    };

    bind<RoomStatusChangedPayload>("room_status_changed", "onRoomStatusChanged");
    bind<NewMessagePayload>("new_message", "onNewMessage");
    bind<HouseholdUpdatedPayload>("household_updated", "onHouseholdUpdated");
    bind<MemberJoinedPayload>("member_joined_household", "onMemberJoined");
    bind<MemberLeftPayload>("member_left_household", "onMemberLeft");
    bind<MemberRemovedPayload>("member_removed", "onMemberRemoved");
    bind<RoomCreatedPayload>("room_created", "onRoomCreated");
    bind<RoomDeletedPayload>("room_deleted", "onRoomDeleted");
    bind<RoomUpdatedPayload>("room_updated", "onRoomUpdated");
    bind<AllStatusesResetPayload>("all_statuses_reset", "onAllStatusesReset");
    bind<RoomMemberJoinedPayload>("room_member_joined", "onRoomMemberJoined");
    bind<RoomMemberLeftPayload>("room_member_left", "onRoomMemberLeft");
    bind<TypingPayload>("user_typing_start", "onUserTypingStart");
    bind<TypingPayload>("user_typing_stop", "onUserTypingStop");
    bind<MemberProfileUpdatedPayload>("member_profile_updated", "onMemberProfileUpdated");

    socket.connect();

    return () => {
      socket.disconnect();
      socket.removeAllListeners();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, []);

  const emit = useCallback((event: string, data?: unknown) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const joinHousehold = useCallback(
    (householdId: string) => emit("join_household", { householdId }),
    [emit]
  );

  const leaveHousehold = useCallback(
    (householdId: string) => emit("leave_household", { householdId }),
    [emit]
  );

  const joinRoom = useCallback(
    (roomId: string) => emit("join_room", { roomId }),
    [emit]
  );

  const leaveRoom = useCallback(
    (roomId: string) => emit("leave_room", { roomId }),
    [emit]
  );

  const emitTypingStart = useCallback(
    (householdId: string) => emit("typing_start", { householdId }),
    [emit]
  );

  const emitTypingStop = useCallback(
    (householdId: string) => emit("typing_stop", { householdId }),
    [emit]
  );

  const setHandlers = useCallback((handlers: SocketHandlers) => {
    handlersRef.current = { ...handlersRef.current, ...handlers };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        joinHousehold,
        leaveHousehold,
        joinRoom,
        leaveRoom,
        emitTypingStart,
        emitTypingStop,
        setHandlers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
