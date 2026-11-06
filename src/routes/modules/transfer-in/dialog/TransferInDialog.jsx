import { ArrowLeftRight, Package, X, PackageCheck } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const formatDate = (value, dateFormat = "MMM dd, yyyy") => {
  if (!value) return "—";

  const parsed =
    value instanceof Date ? value : parseISO(String(value).replace(" ", "T"));

  return isValid(parsed) ? format(parsed, dateFormat) : "—";
};

const formatName = (person) => {
  if (!person) return "—";

  const firstName = person.first_name ?? "";
  const lastName = person.last_name ?? "";

  return `${firstName} ${lastName}`.trim() || "—";
};

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return status
    .split(/[-_ ]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "secondary";
    case "accepted":
      return "default";
    case "rejected":
      return "destructive";
    default:
      return "outline";
  }
};

const TransferInDialog = ({
  open,
  onClose,
  selectedRow,
  onAction,
  isLoading,
}) => {
  const transfer = selectedRow;

  const items = transfer?.items ?? [];

  const getItemDetails = (transferItem) => {
    const inventory = transferItem.inventory ?? {};

    return {
      inventoryId: transferItem.inventory_id ?? inventory.id ?? "—",
      stockId: inventory.stock_id ?? "—",
      code: inventory.item?.code ?? "—",
      name: inventory.item?.name ?? "—",
      uom: inventory.uom?.symbol ?? inventory.uom?.name ?? "—",
      accountTitle: inventory.account_title?.name ?? "—",
      bondedWarehouseId: transferItem.bonded_warehouse_id ?? "—",
      quantity: Number(transferItem.quantity ?? 0),
    };
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ArrowLeftRight className="size-5" />
            </div>

            <div className="grid gap-1">
              <DialogTitle>Transfer In Details</DialogTitle>
              <DialogDescription>
                Review the incoming transfer information and its transferred
                items.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        {/* Transfer Details */}
        <section className="grid gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Transfer Information</h3>

            <Badge variant={getStatusVariant(transfer?.status)}>
              {formatStatus(transfer?.status)}
            </Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="grid gap-1">
              <span className="text-xs text-muted-foreground">
                Transfer No.
              </span>
              <span className="text-sm font-medium">{transfer?.id ?? "—"}</span>
            </div>

            <div className="grid gap-1">
              <span className="text-xs text-muted-foreground">
                Transfer Date
              </span>
              <span className="text-sm font-medium">
                {formatDate(transfer?.transfer_date)}
              </span>
            </div>

            <div className="grid gap-1">
              <span className="text-xs text-muted-foreground">
                Release Date
              </span>
              <span className="text-sm font-medium">
                {formatDate(transfer?.release_date)}
              </span>
            </div>

            <div className="grid gap-1">
              <span className="text-xs text-muted-foreground">
                Transferred By
              </span>
              <span className="text-sm font-medium">
                {formatName(transfer?.sender)}
              </span>
            </div>

            <div className="grid gap-1">
              <span className="text-xs text-muted-foreground">
                Transferred To
              </span>
              <span className="text-sm font-medium">
                {formatName(transfer?.recipient)}
              </span>
            </div>

            <div className="grid gap-1">
              <span className="text-xs text-muted-foreground">Decided By</span>
              <span className="text-sm font-medium">
                {formatName(transfer?.decided_by_user)}
              </span>
            </div>

            <div className="grid gap-1 sm:col-span-2 lg:col-span-3">
              <span className="text-xs text-muted-foreground">
                Decision Date
              </span>
              <span className="text-sm font-medium">
                {formatDate(transfer?.decided_at, "MMM dd, yyyy hh:mm a")}
              </span>
            </div>
          </div>

          <div className="grid gap-2">
            <span className="text-xs text-muted-foreground">Remarks</span>
            <div className="min-h-12 rounded-md border bg-muted/30 p-3 text-sm">
              {transfer?.remarks || "No remarks provided."}
            </div>
          </div>

          {transfer?.status?.toLowerCase() === "rejected" &&
            transfer?.rejection_reason && (
              <div className="grid gap-2">
                <span className="text-xs text-muted-foreground">
                  Rejection Reason
                </span>
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
                  {transfer.rejection_reason}
                </div>
              </div>
            )}
        </section>

        <Separator />

        {/* Transferred Items */}
        <section className="grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Transferred Items</h3>
              <p className="text-sm text-muted-foreground">
                Items included in this incoming transfer.
              </p>
            </div>

            <Badge variant="outline" className="gap-1">
              <Package className="size-3.5" />
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </Badge>
          </div>

          <div className="w-full overflow-x-auto rounded-md border shadow-md">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="min-w-28 text-center">
                    Item Code
                  </TableHead>
                  <TableHead className="min-w-48">Item Name</TableHead>
                  <TableHead className="min-w-20 text-center">UOM</TableHead>
                  <TableHead className="min-w-48 text-center">
                    Account Title
                  </TableHead>
                  <TableHead className="min-w-28 text-center">
                    Quantity
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No transferred items found.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((transferItem, index) => {
                    const item = getItemDetails(transferItem);

                    return (
                      <TableRow key={transferItem.id ?? index}>
                        <TableCell className="text-center font-medium">
                          {item.code}
                        </TableCell>

                        <TableCell className="text-center">
                          {item.name}
                        </TableCell>

                        <TableCell className="text-center">
                          {item.uom}
                        </TableCell>

                        <TableCell className="text-center">
                          {item.accountTitle}
                        </TableCell>

                        <TableCell className="text-center font-medium tabular-nums">
                          {item.quantity.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        <Separator />

        <DialogFooter className="gap-2 sm:justify-between">
          {transfer?.status?.toLowerCase() === "pending" ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => onClose()}
                disabled={isLoading}
              >
                Cancel
              </Button>

              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => onAction(transfer, "reject")}
                  disabled={isLoading}
                >
                  <X className="mr-1 size-5" />
                  Reject
                </Button>

                <Button
                  type="button"
                  onClick={() => onAction(transfer, "accept")}
                  disabled={isLoading}
                >
                  <PackageCheck className="mr-1 size-5" />
                  Accept
                </Button>
              </div>
            </>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransferInDialog;
