import { Archive, Loader2, ShieldAlert, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogMedia,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const DEFAULT_ICONS = {
  archive: Archive,
  delete: Trash2,
  warning: ShieldAlert,
};

const DeleteConfirm = ({
  open,
  onClose,
  onConfirm,
  isLoading = false,

  title = "Archive this record?",
  description = "Are you sure you want to archive the selected record? You can restore it later if needed.",
  actionLabel = "Confirm",
  loadingLabel = "Processing...",
  cancelLabel = "Cancel",

  icon: CustomIcon,
  variant = "destructive",
  iconType = "warning",

  showCancel = true,
}) => {
  const Icon =
    CustomIcon ?? DEFAULT_ICONS[iconType] ?? ShieldAlert;

  const isDestructive = variant === "destructive";

  const handleConfirm = async (event) => {
    event.preventDefault();

    if (isLoading) return;

    await onConfirm?.();
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && !isLoading) {
          onClose?.();
        }
      }}
    >
      <AlertDialogContent
        size="sm"
        className="gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-md"
      >
        <AlertDialogHeader className="items-center gap-4 px-7 pb-6 pt-8 text-center">
          <AlertDialogMedia
            className={`flex size-16 items-center justify-center rounded-2xl ring-8 ${
              isDestructive
                ? "bg-destructive/10 text-destructive ring-destructive/5 dark:bg-destructive/15"
                : "bg-primary/10 text-primary ring-primary/5"
            }`}
          >
            <Icon className="size-7" strokeWidth={1.8} />
          </AlertDialogMedia>

          <div className="space-y-2">
            <AlertDialogTitle className="text-xl font-semibold tracking-tight">
              {title}
            </AlertDialogTitle>

            <AlertDialogDescription className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
              {description}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-col-reverse gap-2 border-t bg-muted/30 px-6 py-4 sm:flex-row sm:justify-center">
          {showCancel && (
            <AlertDialogCancel
              className="h-10 w-full min-w-28 rounded-lg border bg-background px-5 font-medium sm:w-auto"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelLabel}
            </AlertDialogCancel>
          )}

          <AlertDialogAction
            className={`h-10 w-full min-w-28 gap-2 rounded-lg px-5 font-medium sm:w-auto ${
              isDestructive
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }`}
            onClick={handleConfirm}
            disabled={isLoading}
            variant={variant}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {loadingLabel}
              </>
            ) : (
              <>
                <Icon className="size-4" />
                {actionLabel}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirm;