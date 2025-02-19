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
    getPortalTemplates: "/portals-mgmt/portal-templates",
    getPortalDetails: (portalId: string) => `/portals-mgmt/portals/${portalId}`,
    addPortalToEvent: (eventId: string) =>
      `/portals-mgmt/events/${eventId}/portals`,
    removePortalFromEvent: (portalId: string) =>
      `/portals-mgmt/portals/${portalId}`,
  },
};
