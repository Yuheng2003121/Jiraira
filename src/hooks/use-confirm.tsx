import ResponsiveModal from "@/components/ResponsiveModal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

type ButtonProps = React.ComponentProps<typeof Button>;
const useConfirm = (
  title: string,
  message: string,
  variant: ButtonProps["variant"]
): [() => React.ReactNode, () => Promise<boolean>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () => {
    return new Promise<boolean>((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmDialog = () => {
    return (
      <ResponsiveModal isOpen={promise !== null} onOpenChange={handleClose}>
        <Card className="w-full h-full border-none shadow-none p-4">
          <CardContent className="p-0">
            <CardHeader className="p-0">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{message}</CardDescription>
            </CardHeader>
            <div className="mt-4 w-full flex flex-col gap-4 lg:flex-row items-center justify-end">
              <Button
                onClick={handleCancel}
                variant={"outline"}
                className="w-full lg:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                variant={variant}
                className="w-full lg:w-auto"
              >
                Confirm
              </Button>
            </div>
          </CardContent>
        </Card>
      </ResponsiveModal>
    );
  };

  return [ConfirmDialog, confirm];
};

export default useConfirm;
