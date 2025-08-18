import { sign, Secret, SignOptions } from "jsonwebtoken";
import { Role } from "../../generated/prisma";

export function generateToken(user: {
  id: number;
  email: string;
  role: Role;
}): string {
  const secretKey = process.env.SECRET_KEY;

  if (!secretKey) {
    throw new Error("SECRET_KEY no esta definido en la variables de entorno");
  }
  const jwtSecret: Secret = secretKey;
  const jwtOptions: SignOptions = {
    expiresIn: "1h",
  };

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  try {
    return sign(payload, jwtSecret, jwtOptions);
  } catch (error) {
    console.error("Error creando JWT:", error);
    throw new Error("Fallo al genera JWT.");
  }
}
