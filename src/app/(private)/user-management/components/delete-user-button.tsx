import ApiClient from "@/api-client";
import { TooltipWrapper } from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useNetworkErrorToast } from "@/hooks/useNetworkError";
import { User } from "@/type/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";

const apiClient = new ApiClient();

export const DeleteUserButton = ({ user }: { user: User }) => {
  const queryClient = useQueryClient();

  const { showErrorToast } = useNetworkErrorToast();

  const { isPending, mutate } = useMutation({
    mutationFn: () => apiClient.deleteUser({ userId: user.id }),
    onSuccess: () => {
      toast({
        description: (
          <p>
            Your user <b>{user.email}</b>has been deleted
          </p>
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      showErrorToast();
    },
  });

  return (
    <TooltipWrapper content={"Delete"}>
      <Button
        variant="outline"
        size="icon"
        className="text-red-500"
        onClick={() => mutate()}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </TooltipWrapper>
  );
};
