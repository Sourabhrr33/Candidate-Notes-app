import { useEffect, useState } from "react";
import { getCandidates } from "@/api/candidate";

export default function CandidateList({ onSelect }: { onSelect: (candidate: any) => void }) {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCandidates()
      .then(setCandidates)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading candidates...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Candidates</h2>
      <ul className="divide-y border rounded">
        {candidates.map(c => (
          <li
            key={c._id}
            className="p-2 cursor-pointer hover:bg-gray-100"
            onClick={() => onSelect(c)}
          >
            <strong>{c.name}</strong> <br />
            <span className="text-xs text-gray-500">{c.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
