import { createCookieSessionStorage, redirect } from "remix";
import bcrypt from "bcrypt";
import { db } from "./db.server";
type LoginForm = {
  username: string;
  password: string;
};

export async function register({ username, password }: LoginForm) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { username, passwordHash },
  });
  return user;
}

export async function login({ username, password }: LoginForm) {
  const existingUser = await db.user.findFirst({ where: { username } });
  if (!existingUser) return null;
  const passwordMatch = await bcrypt.compare(
    password,
    existingUser.passwordHash
  );
  if (!passwordMatch) return null;
  return existingUser;
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("Must environment variable SESSION_SECRET");
}

const storage = createCookieSessionStorage({
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
    path: "/", // 应用到整个app
    name: "RJ_session",
    secrets: [sessionSecret],
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  // return new Response('xxx', { status: 302, headers: { location: '/' } });
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  if (!userId) {
    const params = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${params}`);
  }
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (!userId) return null;
  return db.user.findUnique({ where: { id: userId } });
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/jokes", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
