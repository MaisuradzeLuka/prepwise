"use server";

import { auth, db } from "@/firebase/admin";
import { User, UserCredentials } from "@/types";
import { cookies } from "next/headers";

const oneDay = 60 * 60 * 24;

export const signUp = async (credentials: UserCredentials) => {
  const { email, fullname, uid } = credentials;

  try {
    const userRecords = await db.collection("users").doc(uid).get();

    if (userRecords.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in instead",
      };
    }

    await db.collection("users").doc(uid).set({ email, name: fullname });

    return {
      success: true,
      message: "Account created successfully!",
    };
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      return {
        success: false,
        message: "Email already in use. Please sign in instead",
      };
    }

    return {
      success: false,
      message: "Could not create account. Please try again later.",
    };
  }
};

export const signIn = async ({
  email,
  idToken,
}: {
  email: string;
  idToken: string;
}) => {
  try {
    const userRecords = await auth.getUserByEmail(email);

    if (!userRecords) {
      return {
        success: false,
        message: "User doesn't exist. Create an account instead",
      };
    }

    await setSessionCookie(idToken);

    return {
      success: true,
      message: "User logged in successfuly",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Couldn't sign in user. Try again later",
    };
  }
};

export const setSessionCookie = async (idToken: string) => {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: oneDay * 1000,
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: oneDay * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
};

export const getCurrentUser = async () => {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    const userRecords = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecords.exists) return null;

    return {
      ...(userRecords.data() as User),
      id: userRecords.id,
    };
  } catch (error: any) {
    console.log(error);

    return null;
  }
};

export const isAuthenticated = async () => {
  const user = await getCurrentUser();

  return !!user;
};
