export type User = {
  id: string;
  email: string;
  enabled: boolean;
  roles: Array<"ADMIN" | "SU_ADMIN" | "PORTAL">;
};

export type UserPayload = {
  email: string;
  password: string;
} & ({ role: "PORTAL"; portalId: string } | { role: "ADMIN" | "SU_ADMIN" });
