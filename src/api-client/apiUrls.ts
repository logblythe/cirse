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
    updateCustomFields: (portalId: string) =>
      `/portals-mgmt/portals/${portalId}/custom-fields`,
  },
  files: {
    uploadAndCreateJob: (portalId: string) =>
      `/files/portals/${portalId}/upload`,
    jobs: (portalId: string) => `/files/portals/${portalId}/jobs`,
  },
};
