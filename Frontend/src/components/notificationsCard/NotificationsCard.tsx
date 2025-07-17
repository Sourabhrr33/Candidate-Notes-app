// src/components/NotificationsCard.tsx
import { Badge } from "@/components/ui/badge";       // or your own
// import { toast } from "@/components/ui/use-toast";   
import { markNotificationRead } from "@/api/notification";

export default function NotificationsCard({
  notifications,
  onNavigateTo,
}: {
  notifications: any[];
  onNavigateTo: (candidateId: string, noteId: string) => void;
}) {
  return (
    <div className="p-2 w-full">
      <h3 className="font-semibold mb-2">
        Notifications{" "}
        {notifications.filter((n) => !n.read).length > 0 && (
          <Badge variant="destructive">
            {notifications.filter((n) => !n.read).length}
          </Badge>
        )}
      </h3>
      <ul className="space-y-1">
        {notifications.map((n) => (
          <li
            key={n._id}
            className={`p-2 rounded hover:bg-gray-100 cursor-pointer ${
              !n.read ? "bg-blue-50" : ""
            }`}
            onClick={() => {
              // navigate & highlight
              onNavigateTo(n.candidateId._id, n.noteId._id);
              // mark read
              if (!n.read) {
                markNotificationRead(n._id);
                n.read = true;
              }
            }}
          >
            <div className="text-sm">
              <strong>{n.candidateId.name}</strong>: {n.text}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(n.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
