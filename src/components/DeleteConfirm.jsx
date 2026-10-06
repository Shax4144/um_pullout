import { Trash2Icon, Loader2 } from "lucide-react"
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogMedia,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog"

const DeleteConfirm = ({ open, onClose, onConfirm, isLoading }) => {
	return (
		<AlertDialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose()
			}}
		>
			<AlertDialogContent size="sm">
				<AlertDialogHeader>
					<AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
						<Trash2Icon />
					</AlertDialogMedia>
					<AlertDialogTitle>
						Are you sure you want to archive this?
					</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel
						className="rounded-[0.35rem]"
						variant="outline"
						onClick={onClose}
						disabled={isLoading}
					>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						className="rounded-[0.35rem]"
						variant="destructive"
						onClick={async (e) => {
							e.preventDefault()
							await onConfirm()
						}}
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Archiving...
							</>
						) : (
							"Archive"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default DeleteConfirm
