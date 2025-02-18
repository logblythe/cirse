export const apiUrls = {
  auth: {
    login: "/auth/login",
  },
  users: {
    get: "/users",
    post: "/users",
    delete: "/users",
    changePassword: "/users/change-password",
  },
  events: {
    get: "/events",
    deleteEventById: (eventId: string) => `/event?id=${eventId}`,
    getSwoogoEvents: "/event/swoogo",
    saveEvent: "/event",
  },
  portalsManagement: {
    getEventPortals: (eventId: string) =>
      `/portals-mgmt/events/${eventId}/portals`,
  },
};
