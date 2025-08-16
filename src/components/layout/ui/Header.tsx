import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

export function Header() {
  const { data: session, status } = useSession();
  return (
    <header className="flex h-12 w-full items-center justify-center border-b px-4">
      <div className="flex w-full max-w-5xl items-center justify-between">
        <h1 className="font-bold">Acme</h1>
        <div className="flex flex-row items-center gap-2">
          {status === "loading" ? (
            <>
              <Button>
                <Loader2 className="size-4 animate-spin" />
              </Button>{" "}
            </>
          ) : status === "unauthenticated" ? (
            <>
              <Button asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          ) : (
            <>
              <Button>{session?.user.name}</Button>
              <Button onClick={() => signOut()}>Sign Out</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
