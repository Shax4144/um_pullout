
import { Trash2Icon, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogMedia,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const DeleteConfirm = ({ open, onClose, onConfirm, isLoading }) => {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <AlertDialogContent size="sm" className="gap-6 p-7">
        <AlertDialogHeader className="gap-3">
          <AlertDialogMedia className="size-12 rounded-lg bg-destructive/10 text-destructive dark:bg-destructive/20">
            <Trash2Icon className="size-6" />
          </AlertDialogMedia>

          <AlertDialogTitle className="text-xl font-semibold">
            Are you sure you want to archive this?
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel
            className="h-11 rounded-[0.35rem]"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            className="h-11 rounded-[0.35rem] border border-red-500"
            variant="destructive"
            onClick={async (e) => {
              e.preventDefault();
              await onConfirm();
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Archiving...
              </>
            ) : (
              "Archive"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirm;
