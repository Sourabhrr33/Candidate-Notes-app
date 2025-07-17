import api from "./axios";

export const getNotifications = () => api.get("/notifications").then(r => r.data);


export const markNotificationRead = (id: string) =>
  api.post(`/notifications/${id}/read`).then((res) => res.data);
