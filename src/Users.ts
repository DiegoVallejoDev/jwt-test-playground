import { sha256 } from "./sha256";

export const Users = [
  {
    id: 1,
    name: "John Doe",
    password: sha256("password"),
  },
  {
    id: 2,
    name: "admin",
    password: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
  },
];
