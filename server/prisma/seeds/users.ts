import { Role } from "../../generated/prisma";

export const users = [
  //Usuario 1 
  {
    username: "vale01",
    email: "valeriajj181@gmail.com",
    password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
    role: Role.ADMIN,
    lastLogin: new Date('2025-06-14T15:30:00Z')
  },
  //Usuario 2
  {
    username: "jhass11",
    email: "jhasimarias@gmail.com",
    password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
    role: Role.ADMIN,
    lastLogin: new Date('2025-05-14T15:30:00Z')
  },

  //Usuario 3
  {
    username: "raquel",
    email: "usuario-cliente1@prueba.com",
    password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
    lastLogin: new Date('2023-05-14T15:30:00Z')
  },

  //Usuario 4
  {
    username: "pablojj",
    email: "pablo@gmail.com",
    password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
    lastLogin: new Date('2024-12-14T15:30:00Z')
  },

   //Usuario 5
  {
    username: "sebasuc",
    email: "sebas@gmail.com",
    password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
    lastLogin: new Date('2025-12-14T15:30:00Z')
  },
];
