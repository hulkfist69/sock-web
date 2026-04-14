"use client";

import { useEffect, useState, useCallback } from "react";
import { useApp } from "@/lib/app-context";
import { useSocket } from "@/lib/socket";
import { updateRoomStatus } from "@/lib/api";
import type { Room, RoomStatus, RoomStatusChangedPayload } from "@/lib/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  green: {
    label: "All Clear",
    bg: "bg-status-green hover:bg-status-green-hover active:scale-95",
    text: "text-white",
    dot: "bg-status-green",
    cardText: "text-white",
  },
  yellow: {
    label: "Knock First",
    bg: "bg-status-yellow hover:bg-status-yellow-hover active:scale-95",
    text: "text-black",
    dot: "bg-status-yellow",
    cardText: "text-black",
  },
  red: {
    label: "Do Not Disturb",
    bg: "bg-status-red hover:bg-status-red-hover active:scale-95",
    text: "text-white",
    dot: "bg-status-red",
    cardText: "text-white",
  },
} as const;

// ─── Status buttons view ──────────────────────────────────────────────────────

function StatusButtons({
  room,
  onUpdate,
  updating,
}: {
  room: Room;
  onUpdate: (status: RoomStatus) => void;
  updating: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      {(["green", "yellow", "red"] as RoomStatus[]).map((s) => {
        const cfg = STATUS_CONFIG[s];
        const isActive = room.status === s;
        return (
          <button
            key={s}
            onClick={() => onUpdate(s)}
            disabled={updating}
            className={`
              flex-1 flex flex-col items-center justify-center gap-2 transition-all duration-200
              ${cfg.bg} ${cfg.text}
              ${isActive ? "opacity-100" : "opacity-70"}
              disabled:cursor-not-allowed
            `}
          >
            <span className="text-3xl font-semibold">{cfg.label}</span>
            {isActive && (
              <span className="text-sm opacity-75 font-medium">
                ✓ Current status
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Room cards view ──────────────────────────────────────────────────────────

function RoomCards({
  rooms,
  activeRoom,
  onSelect,
}: {
  rooms: Room[];
  activeRoom: Room | null;
  onSelect: (r: Room) => void;
}) {
  const cols =
    rooms.length === 1 ? "grid-cols-1" : rooms.length <= 4 ? "grid-cols-2" : "grid-cols-3";

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16">
        <div className="text-4xl mb-4">🏠</div>
        <p className="text-text-secondary font-medium mb-2">No rooms yet</p>
        <p className="text-text-muted text-sm">
          Go to Household to create or join a room.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${cols} gap-3 p-4`}>
      {rooms.map((room) => {
        const cfg = STATUS_CONFIG[room.status];
        const isActive = room.id === activeRoom?.id;
        return (
          <button
            key={room.id}
            onClick={() => onSelect(room)}
            className={`
              aspect-square ${cfg.bg} rounded-lg p-3
              flex flex-col items-center justify-center gap-1
              transition-all duration-150
              ${isActive ? "ring-2 ring-white ring-offset-2 ring-offset-bg-primary" : ""}
            `}
          >
            <span
              className={`text-sm font-semibold text-center leading-tight line-clamp-2 ${cfg.cardText}`}
            >
              {room.room_name}
            </span>
            <span
              className={`text-xs font-medium ${cfg.cardText} opacity-75`}
            >
              {cfg.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── No household placeholder ─────────────────────────────────────────────────

function NoHousehold() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 py-20 text-center">
      <div className="text-5xl mb-5">🔑</div>
      <h2 className="text-xl font-bold mb-3">No household yet</h2>
      <p className="text-text-muted text-sm leading-relaxed">
        Create a household or join one with a code. Head to the Household tab to get started.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { activeHousehold, rooms, setRooms, activeRoom, setActiveRoomLocal } =
    useApp();
  const { setHandlers, joinHousehold } = useSocket();
  const [view, setView] = useState<"cards" | "buttons">("cards");
  const [updating, setUpdating] = useState(false);

  // Join household socket room and subscribe to status changes
  useEffect(() => {
    if (!activeHousehold) return;
    joinHousehold(activeHousehold.id);

    setHandlers({
      onRoomStatusChanged: (payload: RoomStatusChangedPayload) => {
        setRooms((prev) =>
          prev.map((r) =>
            r.id === payload.roomId
              ? { ...r, status: payload.status, status_set_by: payload.setBy }
              : r
          )
        );
      },
    });
  }, [activeHousehold, joinHousehold, setHandlers, setRooms]);

  const handleStatusUpdate = useCallback(
    async (status: RoomStatus) => {
      if (!activeRoom || updating) return;
      setUpdating(true);

      // Optimistic update
      setRooms((prev) =>
        prev.map((r) =>
          r.id === activeRoom.id ? { ...r, status } : r
        )
      );

      const res = await updateRoomStatus(activeRoom.id, status);
      if (!res.success) {
        // Revert on failure
        setRooms((prev) =>
          prev.map((r) =>
            r.id === activeRoom.id ? { ...r, status: activeRoom.status } : r
          )
        );
      }
      setUpdating(false);
    },
    [activeRoom, updating, setRooms]
  );

  if (!activeHousehold) {
    return <NoHousehold />;
  }

  // Current room with up-to-date status from rooms array
  const currentRoom =
    activeRoom
      ? rooms.find((r) => r.id === activeRoom.id) ?? activeRoom
      : null;

  const myRooms = rooms; // All rooms shown for now (can filter by membership later)

  return (
    <div className="flex flex-col h-full">
      {/* View toggle */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <p className="text-xs text-text-muted">
            {activeHousehold.household_name}
          </p>
          {currentRoom && (
            <p className="text-sm font-semibold">
              {currentRoom.room_name}
            </p>
          )}
        </div>
        <button
          onClick={() => setView(view === "cards" ? "buttons" : "cards")}
          className="flex items-center gap-1.5 text-xs text-text-muted bg-bg-elevated rounded-full px-3 py-1.5 hover:text-text-primary transition-colors"
        >
          {view === "cards" ? (
            <>
              <span>⚡</span> Buttons view
            </>
          ) : (
            <>
              <span>⊞</span> Cards view
            </>
          )}
        </button>
      </div>

      {/* Status pill */}
      {currentRoom && (
        <div className="px-4 pb-3">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold
              ${
                currentRoom.status === "green"
                  ? "bg-status-green text-white"
                  : currentRoom.status === "yellow"
                    ? "bg-status-yellow text-black"
                    : "bg-status-red text-white"
              }
            `}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
            {STATUS_CONFIG[currentRoom.status].label}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {view === "buttons" && currentRoom ? (
          <div className="h-full">
            <StatusButtons
              room={currentRoom}
              onUpdate={handleStatusUpdate}
              updating={updating}
            />
          </div>
        ) : (
          <RoomCards
            rooms={myRooms}
            activeRoom={activeRoom}
            onSelect={(r) => {
              setActiveRoomLocal(r);
              setView("buttons");
            }}
          />
        )}
      </div>
    </div>
  );
}
