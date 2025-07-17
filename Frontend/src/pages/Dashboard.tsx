// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getUserId } from "@/utils/jwt";
import { getNotifications } from "@/api/notification";
import NotificationsCard from "@/components/notificationsCard/NotificationsCard";
import CandidateList from "@/components/candidate/CandidateList";
import NotesPanel from "@/components/note/NotesPanel";
import { Button } from "@/components/ui/button";

const SOCKET_URL = "http://localhost:5000";

export default function Dashboard() {
  const userId = getUserId() || "";
  const username = sessionStorage.getItem("username") || "";

  const [notifications, setNotifications] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [highlightNoteId, setHighlightNoteId] = useState<string>();

  useEffect(() => {
    getNotifications().then(setNotifications);

    // 🚀 read token from sessionStorage
    const token = sessionStorage.getItem("token") || "";
    const socket: Socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token },
    });

    socket.emit("joinUser", userId);
    socket.on("notification", (n) =>
      setNotifications((prev) => [n, ...prev])
    );

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4 bg-white border-b">
        <div className="text-lg font-medium">Hi, {username}</div>
        <Button
          variant="outline"
          onClick={() => {
            sessionStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </Button>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <aside className="w-1/4 border-r bg-white flex flex-col overflow-y-auto">
          <NotificationsCard
            notifications={notifications}
            onNavigateTo={(candidateId, noteId) => {
              setSelected({ _id: candidateId });
              setHighlightNoteId(noteId);
            }}
          />
          <CandidateList onSelect={setSelected} />
        </aside>
        <section className="flex-1 p-4 overflow-y-auto">
          {selected ? (
            <>
              <h2 className="text-2xl font-bold mb-2">{selected.name}</h2>
              <p className="text-blue-700 mb-4">
                Candidate Email: {selected.email}
              </p>
              <NotesPanel
                candidateId={selected._id}
                userId={userId}
                highlightNoteId={highlightNoteId}
              />
            </>
          ) : (
            <div className="text-gray-400">
              Select a candidate to view notes.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
