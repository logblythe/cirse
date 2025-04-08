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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const BaseUserSchema = z.object({
  email: z.string().min(1, "Required"),
  password: z
    .string()
    .min(1, "Required")
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must have at least one uppercase letter, one number, and one special character"
    ),
});

const formSchema = BaseUserSchema.extend({
  role: z.enum(["PORTAL"]),
  portalId: z.string().min(1, "Required"),
});

const apiClient = new ApiClient();

type DialogProps = {
  open: boolean;
  onClose: () => void;
  portalId: string;
};

export default function CreatePortalUserDialog(props: DialogProps) {
  const { open, onClose, portalId } = props;

  const queryClient = useQueryClient();

  const { showErrorToast } = useNetworkErrorToast();

  const createUserMutation = useMutation({
    mutationFn: ({ data }: { data: z.infer<typeof formSchema> }) =>
      apiClient.postUser(data),
    onError: (error) => {
      showErrorToast(error.message);
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
    form.reset({
      email: "",
      password: "",
      role: "PORTAL",
      portalId,
    });
  }, [form, portalId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] sm:min-w-full lg:min-w-[720px] flex flex-col">
        <DialogHeader>
          <DialogTitle>{"Create Portal User"}</DialogTitle>
          <DialogDescription>
            Enter the username and password for the new portal user.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="w-full space-y-6"
            onSubmit={form.handleSubmit((data) => {
              createUserMutation.mutate({ data });
            })}
          >
            <ControlledInput
              name="email"
              label="Username"
              placeholder="Username"
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
              items={[{ name: "Portal", id: "PORTAL" }]}
              disabled
            />
            <ControlledInput
              name="portalId"
              label="Portal Id"
              placeholder="Portal Id"
              disabled
            />
            <div className="pt-4">
              <Button
                type="submit"
                disabled={createUserMutation.isPending}
                className="w-full"
              >
                {createUserMutation.isPending ? (
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
