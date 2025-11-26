// app/not-found.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFoundRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/"); // redirect to home
  }, [router]);

  return null;
}
