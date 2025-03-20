export const apiUrls = {
  auth: {
    login: "/auth/login",
  },
  users: {
    get: "/users",
    post: "/users",
    delete: "/users",
    changePassword: "/users/change-password",
    toggleAccess: (userId: string) => `/users/${userId}/toggle-access`,
    me: "/users/me",
  },
  events: {
    get: "/events",
    importEvent: "/events",
    getEventDefinitions: "/events/definition",
    deleteEventById: (eventId: string) => `/events/${eventId}`,
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
    updateCustomFields: (portalId: string) =>
      `/portals-mgmt/portals/${portalId}/custom-fields`,
  },
  files: {
    uploadAndCreateJob: (portalId: string) =>
      `/files/portals/${portalId}/upload`,
    jobs: (portalId: string) => `/files/portals/${portalId}/jobs`,
  },
};
