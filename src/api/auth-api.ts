import { apiRequest } from "@/src/api/http";
import type { AuthUser, User } from "@/src/types/models";

const toAuthUser = (user: User): AuthUser => ({
  id: user.id,
  username: user.username,
  email: user.email,
});

export const loginApi = async (email: string, password: string): Promise<AuthUser> => {
  const normalizedEmail = email.trim().toLowerCase();
  const users = await apiRequest<User[]>("/users", { method: "GET" }, { email: normalizedEmail });
  const user = users.find((item) => item.password === password);

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  return toAuthUser(user);
};

export const signupApi = async (username: string, email: string, password: string): Promise<AuthUser> => {
  const normalizedEmail = email.trim().toLowerCase();
  const users = await apiRequest<User[]>("/users", { method: "GET" }, { email: normalizedEmail });
  const alreadyExists = users.length > 0;

  if (alreadyExists) {
    throw new Error("Email already exists.");
  }

  const newUser: User = {
    id: `user-${Date.now()}-${Math.floor(Math.random() * 10_000)}`,
    username: username.trim(),
    email: normalizedEmail,
    password,
  };

  const created = await apiRequest<User>("/users", {
    method: "POST",
    body: JSON.stringify(newUser),
  });

  return toAuthUser(created);
};
