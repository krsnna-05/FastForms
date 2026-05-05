import jwt from "jsonwebtoken";
import { jwtConfig } from "@/config";

export const generateJWT = async (userId: string) => {
  if (!jwtConfig.jwt_secret || !jwtConfig.jwt_expiration || !userId) {
    throw new Error(
      "JWT secret, expiration time, and user ID must be provided",
    );
  }

  const payload = {
    sub: userId,
  };

  const token = jwt.sign(payload, jwtConfig.jwt_secret, {
    expiresIn: convertExpirationHoursToSecond(),
  });

  return token;
};

export const verifyJWT = async (token: string) => {
  try {
    const decoded = jwt.verify(token, jwtConfig.jwt_secret as jwt.Secret);
    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
};

const convertExpirationHoursToSecond = (): number => {
  const expiration = jwtConfig.jwt_expiration;

  if (!expiration) {
    throw new Error("JWT expiration time must be provided");
  }

  const seconds = 60 * 60 * parseInt(expiration); // Default to 1 hour

  return seconds;
};
