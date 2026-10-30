
import {
  Archive,
  Loader2,
  ShieldAlert,
  Trash2,
  RotateCcw,
  Check,
} from "lucide-react";

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

const ACTION_CONFIG = {
  normal: {
    icon: Check,
    title: "Are you sure?",
    description: "Are you sure you want to proceed with this action?",
    actionLabel: "Confirm",
    loadingLabel: "Processing...",
    iconClass: "bg-primary/10 text-primary ring-primary/5",
    buttonClass: "bg-primary text-primary-foreground hover:bg-primary/90",
    variant: "default",
  },
  archive: {
    icon: Archive,
    title: "Archive this record?",
    description: "Are you sure you want to archive the selected record? You can restore it later if needed.",
    actionLabel: "Archive",
    loadingLabel: "Archiving...",
    iconClass: "bg-destructive/80 text-destructive-foreground ring-destructive/20",
    buttonClass: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    variant: "default",
  },
  restore: {
    icon: RotateCcw,
    title: "Restore this record?",
    description: "Are you sure you want to restore the selected record?",
    actionLabel: "Restore",
    loadingLabel: "Restoring...",
    iconClass: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/5 dark:text-emerald-400",
    buttonClass: "bg-emerald-600 text-white hover:bg-emerald-700",
    variant: "default",
  },
  delete: {
    icon: Trash2,
    title: "Delete this record?",
    description: "This action cannot be undone. Are you sure you want to delete the selected record?",
    actionLabel: "Delete",
    loadingLabel: "Deleting...",
    iconClass: "bg-destructive/10 text-destructive ring-destructive/5",
    buttonClass: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    variant: "destructive",
  },
};

const ActionConfirm = ({
  open,
  onClose,
  onConfirm,
  isLoading = false,

  actionType = "normal",

  title,
  description,
  actionLabel,
  loadingLabel,
  cancelLabel = "Cancel",

  icon: CustomIcon,
  showCancel = true,
}) => {
  const config = ACTION_CONFIG[actionType] ?? ACTION_CONFIG.normal;

  const Icon = CustomIcon ?? config.icon;

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
            className={`flex size-16 items-center justify-center rounded-2xl ring-8 ${config.iconClass}`}
          >
            <Icon className="size-7" strokeWidth={1.8} />
          </AlertDialogMedia>

          <div className="space-y-2">
            <AlertDialogTitle className="text-xl font-semibold tracking-tight">
              {title ?? config.title}
            </AlertDialogTitle>

            <AlertDialogDescription className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
              {description ?? config.description}
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
            className={`h-10 w-full min-w-28 gap-2 rounded-lg px-5 font-medium sm:w-auto ${config.buttonClass}`}
            onClick={handleConfirm}
            disabled={isLoading}
            variant={config.variant}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {loadingLabel ?? config.loadingLabel}
              </>
            ) : (
              <>
                <Icon className="size-4" />
                {actionLabel ?? config.actionLabel}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ActionConfirm;
