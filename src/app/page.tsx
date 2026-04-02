import Link from "next/link";
import LoginPage from "./(auth)/login/page";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      
      <LoginPage />
    </main>
  );
}