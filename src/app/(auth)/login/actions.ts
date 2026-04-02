"use server";

import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { loginSchema } from "@/lib/validations/auth";

export async function loginAction(formData: FormData): Promise<void> {
  const rawData = {
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
  };

  const parsed = loginSchema.safeParse(rawData);

  if (!parsed.success) {
    redirect("/login?error=validation");
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch {
    redirect("/login?error=credentials");
  }

  redirect("/admin/dashboard");
}