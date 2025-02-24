import ApiClient from "@/api-client";
import { Switch } from "@/components/ui/switch";
import { useNetworkErrorToast } from "@/hooks/useNetworkError";
import { User } from "@/type/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const apiClient = new ApiClient();

export const UserToggleSwitch = ({ user }: { user: User }) => {
  const [value, setValue] = useState(user.enabled);

  const queryClient = useQueryClient();

  const { showErrorToast } = useNetworkErrorToast();

  const { isPending, mutate } = useMutation({
    mutationFn: () => apiClient.toggleUserAccess({ userId: user.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      showErrorToast();
    },
  });
  return (
    <Switch
      checked={value}
      onCheckedChange={(value) => {
        setValue(value);
        mutate();
      }}
      disabled={isPending}
    />
  );
  return <div>UserToggleSwitch</div>;
};
