"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { updateCurrentUser, deleteCurrentUser } from "@/lib/api";

function Avatar({
  user,
  size = 20,
}: {
  user: { display_name?: string | null; username: string; profile_image_url?: string | null };
  size?: number;
}) {
  const px = `${size * 4}px`;
  if (user.profile_image_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.profile_image_url}
        alt={user.display_name ?? user.username}
        style={{ width: px, height: px }}
        className="rounded-full object-cover"
      />
    );
  }
  const initials = (user.display_name ?? user.username).slice(0, 1).toUpperCase();
  return (
    <div
      style={{ width: px, height: px }}
      className="rounded-full bg-brand-purple flex items-center justify-center"
    >
      <span className="text-white font-bold text-xl">{initials}</span>
    </div>
  );
}

export default function SettingsPage() {
  const { user, signOut } = useApp();
  const [displayName, setDisplayName] = useState(user?.display_name ?? "");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSaveProfile() {
    if (!user || saving) return;
    setSaving(true);
    setSaveMsg("");
    const res = await updateCurrentUser({ display_name: displayName || undefined });
    setSaving(false);
    setSaveMsg(res.success ? "Saved!" : res.error ?? "Failed to save.");
    setTimeout(() => setSaveMsg(""), 3000);
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    const res = await deleteCurrentUser();
    setDeleting(false);
    if (res.success) {
      signOut();
    }
  }

  if (!user) return null;

  return (
    <div className="flex flex-col gap-0 px-4 py-4">
      {/* Profile header */}
      <div className="flex flex-col items-center py-8 gap-3">
        <Avatar user={user} size={20} />
        <div className="text-center">
          <p className="font-semibold text-lg">{user.display_name ?? user.username}</p>
          <p className="text-text-muted text-sm">@{user.username}</p>
        </div>
      </div>

      {/* Profile section */}
      <section className="bg-bg-card rounded-2xl overflow-hidden mb-4">
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Profile
          </h3>
        </div>

        <div className="px-4 pb-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">
              Display name
            </label>
            <input
              type="text"
              placeholder={user.username}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-bg-elevated border border-border-default rounded-xl px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-purple transition-colors text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">
              Username
            </label>
            <div className="w-full bg-bg-panel border border-border-default rounded-xl px-4 py-2.5 text-text-muted text-sm">
              @{user.username}
            </div>
            <p className="text-xs text-text-muted">Username cannot be changed.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="bg-brand-purple hover:bg-brand-purple-dark disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            {saveMsg && (
              <span
                className={`text-sm ${saveMsg === "Saved!" ? "text-status-green" : "text-red-400"}`}
              >
                {saveMsg}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Account section */}
      <section className="bg-bg-card rounded-2xl overflow-hidden mb-4">
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Account
          </h3>
        </div>
        <div className="divide-y divide-border-default">
          <button
            onClick={signOut}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-bg-elevated transition-colors text-left"
          >
            <span className="text-sm font-medium">Sign out</span>
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-text-muted">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
            </svg>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-bg-elevated transition-colors text-left"
          >
            <span className="text-sm font-medium text-red-400">
              Delete account
            </span>
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-red-400">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </button>
        </div>
      </section>

      {/* Legal links */}
      <section className="bg-bg-card rounded-2xl overflow-hidden mb-4">
        <div className="divide-y divide-border-default">
          <Link
            href="/privacy"
            className="flex items-center justify-between px-4 py-3.5 hover:bg-bg-elevated transition-colors"
          >
            <span className="text-sm text-text-secondary">Privacy Policy</span>
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-text-muted">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </Link>
          <Link
            href="/terms"
            className="flex items-center justify-between px-4 py-3.5 hover:bg-bg-elevated transition-colors"
          >
            <span className="text-sm text-text-secondary">Terms of Service</span>
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-text-muted">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </Link>
          <Link
            href="/support"
            className="flex items-center justify-between px-4 py-3.5 hover:bg-bg-elevated transition-colors"
          >
            <span className="text-sm text-text-secondary">Support</span>
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-text-muted">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Delete confirm modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="bg-bg-elevated border border-border-default rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg mb-2">Delete account?</h3>
            <p className="text-text-muted text-sm mb-6 leading-relaxed">
              This permanently deletes your account and removes you from all households. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 border border-border-strong text-text-primary py-2.5 rounded-xl text-sm font-medium hover:bg-bg-panel transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
