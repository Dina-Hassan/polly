'use client'

import Link from "next/link";
import { useAuth } from "./(auth)/context";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthLinks() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className="flex items-center space-x-6">
      <Link href="/polls" className="text-sm font-medium hover:text-indigo-600">Polls</Link>
      <Link href="/polls/create" className="text-sm font-medium hover:text-indigo-600">Create Poll</Link>
      {user ? (
        <>
          <span className="text-sm font-medium">{user.email}</span>
          <button onClick={handleLogout} className="text-sm font-medium hover:text-indigo-600">Logout</button>
        </>
      ) : (
        <>
          <Link href="/login" className="text-sm font-medium hover:text-indigo-600">Login</Link>
          <Link href="/register" className="text-sm font-medium hover:text-indigo-600">Register</Link>
        </>
      )}
    </nav>
  );
}
