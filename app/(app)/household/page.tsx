"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import {
  createHousehold,
  joinHousehold,
  leaveHousehold,
  deleteHousehold,
  createRoom,
  joinRoom,
  leaveRoom,
  deleteRoom,
  updateRoom,
  resetAllHouseholdStatuses,
  getHouseholds,
} from "@/lib/api";
import type { Household, Room } from "@/lib/types";

// ─── Reusable modal ───────────────────────────────────────────────────────────

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 px-4 pb-safe">
      <div className="bg-bg-elevated border border-border-default rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary text-xl leading-none"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Status dot ───────────────────────────────────────────────────────────────

const STATUS_BG: Record<string, string> = {
  green: "bg-status-green",
  yellow: "bg-status-yellow",
  red: "bg-status-red",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HouseholdPage() {
  const {
    user,
    households,
    activeHousehold,
    rooms,
    members,
    setActiveHouseholdLocal,
    refreshRooms,
    refreshMembers,
  } = useApp();

  // Modals
  const [modal, setModal] = useState<
    | "createHousehold"
    | "joinHousehold"
    | "createRoom"
    | "joinRoom"
    | "renameRoom"
    | "resetConfirm"
    | "deleteHouseholdConfirm"
    | "leaveHouseholdConfirm"
    | null
  >(null);

  const closeModal = () => setModal(null);

  // Form state
  const [hhName, setHhName] = useState("");
  const [hhPass, setHhPass] = useState("");
  const [hhCode, setHhCode] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomPass, setRoomPass] = useState("");
  const [roomId, setRoomId] = useState("");
  const [renameTarget, setRenameTarget] = useState<Room | null>(null);
  const [renameVal, setRenameVal] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const isAdmin =
    activeHousehold &&
    members.find((m) => m.user_id === user?.id)?.role === "admin";

  async function run<T>(fn: () => Promise<{ success: boolean; error?: string; data?: T }>) {
    setBusy(true);
    setErr("");
    const res = await fn();
    setBusy(false);
    if (!res.success) {
      setErr(res.error ?? "Something went wrong.");
      return false;
    }
    return true;
  }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  async function handleCreateHousehold() {
    const ok = await run(() => createHousehold(hhName.trim(), hhPass));
    if (ok) {
      const res = await getHouseholds();
      const hhs = res.data?.households ?? [];
      if (hhs.length > 0) setActiveHouseholdLocal(hhs[hhs.length - 1]);
      closeModal();
      setHhName(""); setHhPass("");
    }
  }

  async function handleJoinHousehold() {
    const ok = await run(() => joinHousehold(hhCode.trim().toUpperCase(), hhPass));
    if (ok) {
      const res = await getHouseholds();
      const hhs = res.data?.households ?? [];
      if (hhs.length > 0) setActiveHouseholdLocal(hhs[hhs.length - 1]);
      closeModal();
      setHhCode(""); setHhPass("");
    }
  }

  async function handleCreateRoom() {
    if (!activeHousehold) return;
    const ok = await run(() =>
      createRoom(activeHousehold.id, roomName.trim(), roomPass || undefined)
    );
    if (ok) { await refreshRooms(); closeModal(); setRoomName(""); setRoomPass(""); }
  }

  async function handleJoinRoom() {
    const ok = await run(() => joinRoom(roomId.trim(), roomPass || undefined));
    if (ok) { await refreshRooms(); closeModal(); setRoomId(""); setRoomPass(""); }
  }

  async function handleLeaveRoom(r: Room) {
    const ok = await run(() => leaveRoom(r.id));
    if (ok) await refreshRooms();
  }

  async function handleDeleteRoom(r: Room) {
    const ok = await run(() => deleteRoom(r.id));
    if (ok) await refreshRooms();
  }

  async function handleRenameRoom() {
    if (!renameTarget) return;
    const ok = await run(() => updateRoom(renameTarget.id, { room_name: renameVal.trim() }));
    if (ok) { await refreshRooms(); closeModal(); setRenameTarget(null); setRenameVal(""); }
  }

  async function handleResetStatuses() {
    if (!activeHousehold) return;
    const ok = await run(() => resetAllHouseholdStatuses(activeHousehold.id));
    if (ok) { await refreshRooms(); closeModal(); }
  }

  async function handleDeleteHousehold() {
    if (!activeHousehold) return;
    const ok = await run(() => deleteHousehold(activeHousehold.id));
    if (ok) { window.location.href = "/home"; }
  }

  async function handleLeaveHousehold() {
    if (!activeHousehold) return;
    const ok = await run(() => leaveHousehold(activeHousehold.id));
    if (ok) { window.location.href = "/home"; }
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-0 px-4 py-4">

      {/* Household selector */}
      <section className="bg-bg-card rounded-2xl overflow-hidden mb-4">
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Household
          </h3>
        </div>

        {activeHousehold ? (
          <>
            <div className="px-4 pb-3">
              <p className="font-semibold">{activeHousehold.household_name}</p>
              <p className="text-xs text-text-muted mt-0.5">
                Code: <span className="font-mono text-text-secondary">{activeHousehold.household_code}</span>
              </p>
            </div>

            {/* Switch household */}
            {households.length > 1 && (
              <div className="border-t border-border-default px-4 py-2">
                <p className="text-xs text-text-muted mb-2">Switch household</p>
                <div className="flex flex-col gap-1">
                  {households.map((hh) => (
                    <button
                      key={hh.id}
                      onClick={() => setActiveHouseholdLocal(hh)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        hh.id === activeHousehold.id
                          ? "bg-brand-purple/20 text-brand-purple-light"
                          : "hover:bg-bg-elevated text-text-secondary"
                      }`}
                    >
                      {hh.household_name}
                      {hh.id === activeHousehold.id && (
                        <span className="text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="px-4 pb-4 text-sm text-text-muted">
            No household yet. Create or join one below.
          </p>
        )}

        <div className="border-t border-border-default divide-y divide-border-default">
          <button
            onClick={() => setModal("createHousehold")}
            className="w-full flex items-center gap-2 px-4 py-3.5 hover:bg-bg-elevated transition-colors text-sm font-medium text-left"
          >
            + Create household
          </button>
          <button
            onClick={() => setModal("joinHousehold")}
            className="w-full flex items-center gap-2 px-4 py-3.5 hover:bg-bg-elevated transition-colors text-sm font-medium text-left"
          >
            Join with code
          </button>
        </div>
      </section>

      {/* Members */}
      {activeHousehold && members.length > 0 && (
        <section className="bg-bg-card rounded-2xl overflow-hidden mb-4">
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Members ({members.length})
            </h3>
          </div>
          <div className="divide-y divide-border-default">
            {members.map((m) => (
              <div key={m.user_id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-purple flex items-center justify-center text-white text-sm font-bold">
                    {(m.display_name ?? m.username).slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {m.display_name ?? m.username}
                    </p>
                    <p className="text-xs text-text-muted">@{m.username}</p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    m.role === "admin"
                      ? "bg-brand-purple/20 text-brand-purple-light"
                      : "bg-bg-elevated text-text-muted"
                  }`}
                >
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Rooms */}
      {activeHousehold && (
        <section className="bg-bg-card rounded-2xl overflow-hidden mb-4">
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Rooms ({rooms.length})
            </h3>
          </div>

          {rooms.length > 0 && (
            <div className="divide-y divide-border-default">
              {rooms.map((r) => (
                <div key={r.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${STATUS_BG[r.status]}`}
                    />
                    <span className="text-sm font-medium">{r.room_name}</span>
                  </div>
                  {(isAdmin || activeHousehold.allow_member_room_management) && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setRenameTarget(r);
                          setRenameVal(r.room_name);
                          setModal("renameRoom");
                        }}
                        className="p-1.5 hover:bg-bg-elevated rounded-lg transition-colors"
                        title="Rename"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-text-muted">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleLeaveRoom(r)}
                        className="p-1.5 hover:bg-bg-elevated rounded-lg transition-colors"
                        title="Leave"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-text-muted">
                          <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                        </svg>
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteRoom(r)}
                          className="p-1.5 hover:bg-bg-elevated rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-red-400">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-border-default divide-y divide-border-default">
            {(isAdmin || activeHousehold.allow_member_room_management) && (
              <button
                onClick={() => setModal("createRoom")}
                className="w-full flex items-center gap-2 px-4 py-3.5 hover:bg-bg-elevated transition-colors text-sm font-medium text-left"
              >
                + Create room
              </button>
            )}
            <button
              onClick={() => setModal("joinRoom")}
              className="w-full flex items-center gap-2 px-4 py-3.5 hover:bg-bg-elevated transition-colors text-sm font-medium text-left"
            >
              Join room by ID
            </button>
          </div>
        </section>
      )}

      {/* Danger zone */}
      {activeHousehold && (
        <section className="bg-bg-card rounded-2xl overflow-hidden mb-4">
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-xs font-semibold text-red-500 uppercase tracking-wider">
              Danger Zone
            </h3>
          </div>
          <div className="divide-y divide-border-default">
            {isAdmin && (
              <button
                onClick={() => setModal("resetConfirm")}
                className="w-full flex items-center gap-2 px-4 py-3.5 hover:bg-bg-elevated transition-colors text-sm text-text-secondary text-left"
              >
                Reset all room statuses
              </button>
            )}
            <button
              onClick={() => setModal("leaveHouseholdConfirm")}
              className="w-full flex items-center gap-2 px-4 py-3.5 hover:bg-bg-elevated transition-colors text-sm text-red-400 text-left"
            >
              Leave household
            </button>
            {isAdmin && (
              <button
                onClick={() => setModal("deleteHouseholdConfirm")}
                className="w-full flex items-center gap-2 px-4 py-3.5 hover:bg-bg-elevated transition-colors text-sm text-red-400 text-left"
              >
                Delete household
              </button>
            )}
          </div>
        </section>
      )}

      {/* ─── Modals ─────────────────────────────────────────────────────────── */}

      {modal === "createHousehold" && (
        <Modal title="Create Household" onClose={closeModal}>
          <div className="flex flex-col gap-3">
            <input
              placeholder="Household name"
              value={hhName}
              onChange={(e) => setHhName(e.target.value)}
              className="input-field"
            />
            <input
              type="password"
              placeholder="Password"
              value={hhPass}
              onChange={(e) => setHhPass(e.target.value)}
              className="input-field"
            />
            {err && <p className="text-red-400 text-sm">{err}</p>}
            <button
              onClick={handleCreateHousehold}
              disabled={busy || !hhName.trim() || !hhPass.trim()}
              className="btn-primary"
            >
              {busy ? "Creating…" : "Create"}
            </button>
          </div>
        </Modal>
      )}

      {modal === "joinHousehold" && (
        <Modal title="Join Household" onClose={closeModal}>
          <div className="flex flex-col gap-3">
            <input
              placeholder="8-character code"
              value={hhCode}
              onChange={(e) => setHhCode(e.target.value)}
              maxLength={8}
              className="input-field font-mono uppercase"
            />
            <input
              type="password"
              placeholder="Password"
              value={hhPass}
              onChange={(e) => setHhPass(e.target.value)}
              className="input-field"
            />
            {err && <p className="text-red-400 text-sm">{err}</p>}
            <button
              onClick={handleJoinHousehold}
              disabled={busy || !hhCode.trim() || !hhPass.trim()}
              className="btn-primary"
            >
              {busy ? "Joining…" : "Join"}
            </button>
          </div>
        </Modal>
      )}

      {modal === "createRoom" && (
        <Modal title="Create Room" onClose={closeModal}>
          <div className="flex flex-col gap-3">
            <input
              placeholder="Room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="input-field"
            />
            <input
              type="password"
              placeholder="Password (optional)"
              value={roomPass}
              onChange={(e) => setRoomPass(e.target.value)}
              className="input-field"
            />
            {err && <p className="text-red-400 text-sm">{err}</p>}
            <button
              onClick={handleCreateRoom}
              disabled={busy || !roomName.trim()}
              className="btn-primary"
            >
              {busy ? "Creating…" : "Create Room"}
            </button>
          </div>
        </Modal>
      )}

      {modal === "joinRoom" && (
        <Modal title="Join Room" onClose={closeModal}>
          <div className="flex flex-col gap-3">
            <input
              placeholder="Room ID (UUID)"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="input-field font-mono text-xs"
            />
            <input
              type="password"
              placeholder="Password (if required)"
              value={roomPass}
              onChange={(e) => setRoomPass(e.target.value)}
              className="input-field"
            />
            {err && <p className="text-red-400 text-sm">{err}</p>}
            <button
              onClick={handleJoinRoom}
              disabled={busy || !roomId.trim()}
              className="btn-primary"
            >
              {busy ? "Joining…" : "Join Room"}
            </button>
          </div>
        </Modal>
      )}

      {modal === "renameRoom" && renameTarget && (
        <Modal title="Rename Room" onClose={closeModal}>
          <div className="flex flex-col gap-3">
            <input
              placeholder="New name"
              value={renameVal}
              onChange={(e) => setRenameVal(e.target.value)}
              className="input-field"
            />
            {err && <p className="text-red-400 text-sm">{err}</p>}
            <button
              onClick={handleRenameRoom}
              disabled={busy || !renameVal.trim()}
              className="btn-primary"
            >
              {busy ? "Saving…" : "Save"}
            </button>
          </div>
        </Modal>
      )}

      {modal === "resetConfirm" && (
        <Modal title="Reset All Statuses?" onClose={closeModal}>
          <p className="text-text-muted text-sm mb-5">
            All rooms will be set to green (All Clear).
          </p>
          {err && <p className="text-red-400 text-sm mb-3">{err}</p>}
          <div className="flex gap-3">
            <button onClick={closeModal} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={handleResetStatuses} disabled={busy} className="btn-primary flex-1">
              {busy ? "Resetting…" : "Reset"}
            </button>
          </div>
        </Modal>
      )}

      {modal === "leaveHouseholdConfirm" && (
        <Modal title="Leave Household?" onClose={closeModal}>
          <p className="text-text-muted text-sm mb-5">
            You will be removed from {activeHousehold?.household_name}.
          </p>
          {err && <p className="text-red-400 text-sm mb-3">{err}</p>}
          <div className="flex gap-3">
            <button onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleLeaveHousehold} disabled={busy} className="btn-danger flex-1">
              {busy ? "Leaving…" : "Leave"}
            </button>
          </div>
        </Modal>
      )}

      {modal === "deleteHouseholdConfirm" && (
        <Modal title="Delete Household?" onClose={closeModal}>
          <p className="text-text-muted text-sm mb-5">
            This permanently deletes {activeHousehold?.household_name} and all its rooms and messages.
          </p>
          {err && <p className="text-red-400 text-sm mb-3">{err}</p>}
          <div className="flex gap-3">
            <button onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleDeleteHousehold} disabled={busy} className="btn-danger flex-1">
              {busy ? "Deleting…" : "Delete"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
