"use client";

import ApiClient from "@/api-client/";
import { ControlledInput } from "@/components/ControlledInput";
import { ControlledSelect } from "@/components/ControlledSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useNetworkErrorToast } from "@/hooks/useNetworkError";
import { User } from "@/type/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const BaseUserSchema = z.object({
  email: z.string().min(1, "Required"),
  password: z.string().min(1, "Required"),
});

const AdminUserSchema = BaseUserSchema.extend({
  role: z.enum(["ADMIN", "SU_ADMIN"]),
});

const PortalUserSchema = BaseUserSchema.extend({
  role: z.enum(["PORTAL"]),
  portalId: z.string().min(1, "Required"),
});

const formSchema = z.discriminatedUnion("role", [
  AdminUserSchema,
  PortalUserSchema,
]);

const apiClient = new ApiClient();

type DialogProps = {
  open: boolean;
  onClose: () => void;
  user?: User;
};

export default function CreateUserDialog(props: DialogProps) {
  const { open, onClose, user } = props;

  const router = useRouter();

  const queryClient = useQueryClient();

  const { showErrorToast } = useNetworkErrorToast();

  const updatePasswordMutation = useMutation({
    mutationFn: (data: { userId: string; newPassword: string }) =>
      apiClient.changePassword(data),
    onError: (error) => {
      showErrorToast();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      onClose();
    },
  });

  const createUserMutation = useMutation({
    mutationFn: ({ data }: { data: z.infer<typeof formSchema> }) =>
      apiClient.postUser(data),
    onError: (error) => {
      showErrorToast();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      onClose();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  React.useEffect(() => {
    if (!user) {
      return;
    }
    if (user.roles[0] === "PORTAL") {
      form.reset({
        email: user.email,
        role: "PORTAL",
        portalId: "user.portalId",
      });
    } else {
      form.reset({
        email: user.email,
        role: user.roles[0],
      });
    }
  }, [form, user]);

  const role = form.watch("role");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] sm:min-w-full lg:min-w-[720px] flex flex-col">
        <DialogHeader>
          <DialogTitle>{user ? "Update password" : "Create User"}</DialogTitle>
          <DialogDescription>
            To update password, please enter new password and save.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="w-full space-y-6"
            onSubmit={form.handleSubmit((data) => {
              if (user) {
                updatePasswordMutation.mutate({
                  userId: user.id,
                  newPassword: data.password,
                });
              } else {
                createUserMutation.mutate({ data });
              }
            })}
          >
            <ControlledInput
              name="email"
              label="Username"
              placeholder="Username"
              disabled={!!user}
            />
            <ControlledInput
              name="password"
              label="Password"
              placeholder="Password"
            />
            <ControlledSelect
              name="role"
              label="Role"
              placeholder="Role"
              items={[
                { name: "Admin", id: "ADMIN" },
                { name: "Super Admin", id: "SU_ADMIN" },
                { name: "Portal", id: "PORTAL" },
              ]}
              disabled={!!user}
            />
            {role === "PORTAL" ? (
              <ControlledInput
                name="portalId"
                label="Portal Id"
                placeholder="Portal Id"
                disabled={!!user}
              />
            ) : null}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={
                  createUserMutation.isPending ||
                  updatePasswordMutation.isPending
                }
                className="w-full"
              >
                {createUserMutation.isPending ||
                updatePasswordMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
