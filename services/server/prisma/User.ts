import { prisma } from "@/providers/prisma";

type returncheckExistingUser = {
  exists: boolean;
  userId: number | null;
};

export const checkExistingUser = async (
  email: string,
): Promise<returncheckExistingUser> => {
  try {
    const userId = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!userId) {
      return {
        exists: false,
        userId: null,
      };
    }

    return {
      exists: true,
      userId: userId.id,
    };
  } catch (error) {
    // Basic error handling: log and return a safe default
    // In production, consider structured logging or rethrowing a custom error
    // eslint-disable-next-line no-console
    console.error("checkExistingUser error:", error);
    return {
      exists: false,
      userId: null,
    };
  }
};

type CreateUserParams = {
  email: string;
  name: string;
  profileId: string | null;
  googleId: string;
};

export const createUser = async ({
  email,
  name,
  profileId,
  googleId,
}: CreateUserParams) => {
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        profileImgId: profileId,
        googleId,
      },
    });

    return user;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("createUser error:", error);
    throw error;
  }
};
