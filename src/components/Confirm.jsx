import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2 } from 'lucide-react'

const Confirm = ({open, onClose, onConfirm, isLoading}) => {
  return (
		<AlertDialog
			open={open}
			openChange={(isOpen) => {
				if (!isOpen) onClose()
			}}
		>
			<AlertDialogContent size="sm">
				<AlertDialogHeader>
					<AlertDialogTitle>Confirm your action</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to proceed?
					</AlertDialogDescription>
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
						variant=""
						className="rounded-[0.35rem]"
						onClick={async (e) => {
							e.preventDefault()
							await onConfirm()
						}}
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Confirming...
							</>
						) : (
							"Confirm"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default Confirm