// src/components/note/NotesPanel.tsx
import { useEffect, useRef, useState } from "react";
import { getNotes, addNote } from "@/api/note";   // <-- import addNote
import { getUsers } from "@/api/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export default function NotesPanel({
  candidateId,
  userId,
  highlightNoteId,
}: {
  candidateId: string;
  userId: string;
  highlightNoteId?: string;
}) {
  const [notes, setNotes] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [tagged, setTagged] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);

  // Fetch notes & users
  useEffect(() => {
    setLoading(true);
    getNotes(candidateId).then(setNotes).finally(() => setLoading(false));
    getUsers().then(setUsers);
  }, [candidateId]);

  // Highlight scroll
  useEffect(() => {
    if (highlightNoteId) {
      const el = document.getElementById(highlightNoteId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-blue-500");
        setTimeout(() => el.classList.remove("ring-2", "ring-blue-500"), 3000);
      }
    }
  }, [notes, highlightNoteId]);

  // Listen for new notes via Socket.io
  useEffect(() => {
    const token = sessionStorage.getItem("token") || "";
    const socket: Socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token },
    });
    socketRef.current = socket;

    socket.emit("joinRoom", candidateId);
    socket.on("noteAdded", note => {
        setNotes(prev => [...prev, note]);
      });
    return () => {
      socket.emit("leaveRoom", candidateId);
      socket.disconnect();
    };
  }, [candidateId]);

  // Autocomplete @mentions
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setText(val);
    const match = val.match(/@(\w*)$/);
    if (match) {
      const q = match[1].toLowerCase();
      setSuggestions(
        users.filter(
          (u) =>
            u._id !== userId &&
            (q === "" ||
              u.name.toLowerCase().includes(q) ||
              u.email.toLowerCase().includes(q))
        )
      );
    } else {
      setSuggestions([]);
    }
  };
  const handleSuggestionClick = (u: any) => {
    setText((t) => t.replace(/@\w*$/, `@${u.name} `));
    setTagged((prev) => [...prev, u._id]);
    setSuggestions([]);
  };

  // *** NEW: submit via REST API ***
// before, you probably had setNotes([...prev, ...]) here—remove that.
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !socketRef.current) return;
  
    try {
      // just POST to your REST API
      await addNote(candidateId, { text, taggedUserIds: tagged });
      // clear out the input (no local setNotes!)
      setText("");
      setTagged([]);
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };
  

  if (loading) return <div>Loading notes…</div>;

  return (
    <div>
      <div className="mb-2 font-semibold">Notes</div>
      <div className="space-y-2 max-h-64 overflow-y-auto border rounded p-2 bg-gray-50">
        {notes.map((n) => (
          <div
            key={n._id}
            id={n._id}
            className="p-2 bg-white rounded shadow text-sm mb-2"
          >
            <strong>{n.senderId?.name || "Someone"}:</strong>{" "}
            {n.text.split(/(@\w+)/).map((chunk: string, i: number) =>
              chunk.startsWith("@") ? (
                <span key={i} className="text-blue-600 font-semibold">
                  {chunk}
                </span>
              ) : (
                chunk
              )
            )}
            <div className="text-gray-400 text-xs">
              {new Date(n.createdAt).toLocaleString()}
            </div>
            {n.taggedUserIds?.length > 0 && (
              <div className="text-xs text-purple-600">
                Tagged: {n.taggedUserIds.map((u: any) => u.name).join(", ")}
              </div>
            )}
          </div>
        ))}
        {notes.length === 0 && (
          <div className="text-gray-400">No notes yet.</div>
        )}
      </div>

      <form className="mt-2 flex gap-2 relative" onSubmit={handleSubmit}>
        <Input
          value={text}
          onChange={handleTextChange}
          placeholder="Add a note… Use @ to tag!"
        />
        <Button type="submit">Send</Button>

        {suggestions.length > 0 && (
          <div className="absolute left-0 top-full mt-1 w-60 bg-white border shadow z-10 rounded">
            {suggestions.map((u) => (
              <div
                key={u._id}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSuggestionClick(u)}
              >
                {u.name}{" "}
                <span className="text-gray-400 text-xs">({u.email})</span>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}
