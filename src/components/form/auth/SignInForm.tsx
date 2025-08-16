"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { SignInSchema } from "@/server/schema/AuthSchema";
import { Eye, EyeOff, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

type SignInFormProps = {
  onLogin: (values: SignInSchema) => void;
  isLoading: boolean;
};

export function SignInForm(props: SignInFormProps) {
  const form = useFormContext<SignInSchema>();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <form
      onSubmit={form.handleSubmit(props.onLogin)}
      className="flex h-full w-full flex-col justify-center gap-4"
    >
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="john_doe@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  {...field}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="hover:text-foreground absolute top-0 right-0 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit" className="w-full" disabled={props.isLoading}>
        <Loader2Icon
          className={cn(
            "mr-1 size-4 animate-spin",
            !props.isLoading && "sr-only",
          )}
        />
        Sign In
      </Button>
    </form>
  );
}
