import api from "./axios";

export const getNotes = (candidateId: string) =>
  api.get(`/notes/${candidateId}`).then(res => res.data);

export const addNote = (
  candidateId: string,
  note: { text: string; taggedUserIds?: string[] }
) => api.post(`/notes/${candidateId}`, note).then(res => res.data);
