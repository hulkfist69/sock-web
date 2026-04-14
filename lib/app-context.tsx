"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import type { User, Household, Room, HouseholdMember } from "./types";
import { getCurrentUser, getHouseholds, getHouseholdRooms, getHouseholdMembers } from "./api";
import { clearToken, getToken } from "./auth";

interface AppState {
  user: User | null;
  households: Household[];
  activeHousehold: Household | null;
  rooms: Room[];
  members: HouseholdMember[];
  activeRoom: Room | null;
  loading: boolean;

  setActiveHouseholdLocal: (h: Household) => void;
  setActiveRoomLocal: (r: Room | null) => void;
  setRooms: Dispatch<SetStateAction<Room[]>>;
  refreshRooms: () => Promise<void>;
  refreshMembers: () => Promise<void>;
  signOut: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [activeHousehold, setActiveHousehold] = useState<Household | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  // Bootstrap: load user + households on mount
  useEffect(() => {
    async function init() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const [userRes, hhRes] = await Promise.all([
        getCurrentUser(),
        getHouseholds(),
      ]);

      if (!userRes.success) {
        // Token likely invalid
        clearToken();
        router.push("/signin");
        return;
      }

      setUser(userRes.data ?? null);

      const hhs = hhRes.data?.households ?? [];
      setHouseholds(hhs);

      if (hhs.length > 0) {
        setActiveHousehold(hhs[0]);
        await loadRoomsAndMembers(hhs[0].id);
      }

      setLoading(false);
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadRoomsAndMembers(householdId: string) {
    const [roomsRes, membersRes] = await Promise.all([
      getHouseholdRooms(householdId),
      getHouseholdMembers(householdId),
    ]);
    const fetchedRooms = roomsRes.data?.rooms ?? [];
    setRooms(fetchedRooms);
    setMembers((membersRes.data?.members ?? []) as HouseholdMember[]);
    // Default active room to first
    if (fetchedRooms.length > 0) setActiveRoom(fetchedRooms[0]);
  }

  const setActiveHouseholdLocal = useCallback((h: Household) => {
    setActiveHousehold(h);
    setRooms([]);
    setActiveRoom(null);
    loadRoomsAndMembers(h.id);
  }, []);

  const setActiveRoomLocal = useCallback((r: Room | null) => {
    setActiveRoom(r);
  }, []);

  const refreshRooms = useCallback(async () => {
    if (!activeHousehold) return;
    const res = await getHouseholdRooms(activeHousehold.id);
    setRooms(res.data?.rooms ?? []);
  }, [activeHousehold]);

  const refreshMembers = useCallback(async () => {
    if (!activeHousehold) return;
    const res = await getHouseholdMembers(activeHousehold.id);
    setMembers((res.data?.members ?? []) as HouseholdMember[]);
  }, [activeHousehold]);

  const signOut = useCallback(() => {
    clearToken();
    router.push("/");
  }, [router]);

  return (
    <AppContext.Provider
      value={{
        user,
        households,
        activeHousehold,
        rooms,
        members,
        activeRoom,
        loading,
        setActiveHouseholdLocal,
        setActiveRoomLocal,
        setRooms,
        refreshRooms,
        refreshMembers,
        signOut,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
