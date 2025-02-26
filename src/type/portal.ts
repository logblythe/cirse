export type Field = {
  id: string;
  name: string;
  enabled: boolean;
};

export type Portal = {
  id: string;
  name: string;
  requiresOnlineUser: boolean;
  sessionFields: Field[];
  presentationFields: Field[];
};
