"use client";

import ApiClient from "@/api-client/";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().min(1, "Required"),
  password: z.string().min(1, "Required"),
});

const apiClient = new ApiClient();

export default function LoginForm() {
  const { addUser } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: z.infer<typeof FormSchema>) => apiClient.login(data),
    onSuccess: (data) => {
      addUser({ ...data, expiresIn: new Date().getSeconds() + data.expiresIn });
      router.push("/events");
    },
    onError: () => {
      form.setError(
        "email",
        { message: "Invalid Credentials" },
        { shouldFocus: true }
      );
      form.setError("password", { message: "Invalid Credentials" });
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    loginMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form className="w-full space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
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
                <Input
                  type="password"
                  placeholder="Enter password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-4">
          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full"
            onClick={form.handleSubmit(onSubmit)}
          >
            {loginMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Sign In
          </Button>
        </div>
      </form>
    </Form>
  );
}
