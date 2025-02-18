import { toast } from "@/components/ui/use-toast";

export const useNetworkErrorToast = () => {
  const showErrorToast = (message?: string) =>
    toast({
      variant: "destructive",
      title: message ? message : "Uh oh! Something went wrong.",
      description: message ? "" : "There was a problem with your request.",
    });

  return { showErrorToast };
};
