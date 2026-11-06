import { useMemo } from "react";
import { Package, MoreHorizontal, Eye, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import StatusToggle from "../../../components/StatusToggle";
import TableWrapper from "../../../components/tables/TableWrapper";

const TransferInTable = ({
  data,
  isFetching,
  isError,
  error,
  status,
  onStatusChange,
  onView,
  onAction,
  page,
  onPageChange,
  pageSize,
  onPageSizeChange,
  search,
  onSearchChange,
}) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: () => <div className="text-center">ID</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              {row.original.id || "—"}
            </span>
          </div>
        ),
      },
      {
        id: "number_of_items",
        accessorFn: (row) => row.items?.length ?? 0,
        header: () => <div className="text-center">No. of Items</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <Badge
              variant="secondary"
              className="font-mono text-sm font-medium"
            >
              <Package className="h-4 w-4" />
              {row.original.items?.length ?? 0}
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: "transfer_date",
        header: () => <div className="text-center">Transfer Date</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              {row.original.transfer_date
                ? new Date(row.original.transfer_date).toLocaleDateString(
                    "en-PH",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    },
                  )
                : "—"}
            </span>
          </div>
        ),
      },
      {
        id: "transferred_by",
        accessorFn: (row) =>
          `${row.sender?.first_name ?? ""} ${row.sender?.last_name ?? ""}`.trim(),
        header: () => <div className="text-center">Transferred By</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              {row.original.sender
                ? `${row.original.sender.first_name} ${row.original.sender.last_name}`
                : "—"}
            </span>
          </div>
        ),
      },
      {
        id: "remarks",
        accessorFn: (row) => row.stock?.remarks ?? "",
        header: () => <div className="text-center">Remarks</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <span
              className="block max-w-48 truncate text-sm text-muted-foreground"
              title={row.original.remarks || ""}
            >
              {row.original.remarks || "—"}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
          const status = row.original.status;

          return (
            <div className="text-center">
              <Badge
                variant={
                  status === "accepted"
                    ? "success"
                    : status === "rejected"
                      ? "destructive"
                      : "warning"
                }
                className="capitalize"
              >
                {status || "—"}
              </Badge>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-center">Action</div>,
        cell: ({ row }) => {
          const item = row.original;
          const isPending = item.status === "pending";

          return (
            <div className="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open actions</span>
                    </Button>
                  }
                />

                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => onView(item)}
                    className="cursor-pointer"
                  >
                    <Eye className="mr-1 size-5" />
                    View
                  </DropdownMenuItem>

                  {isPending && (
                    <>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => onAction(item, "accept")}
                        className="cursor-pointer text-green-600 focus:text-sidebar-foreground"
                      >
                        <Check className="mr-1 size-5" />
                        Accept
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onAction(item, "reject")}
                        className="cursor-pointer text-destructive focus:text-sidebar-foreground"
                      >
                        <X className="mr-1 size-5" />
                        Reject
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [onView, onAction],
  );

  return (
    <TableWrapper
      columns={columns}
      data={data?.data ?? []}
      paginationData={data}
      isFetching={isFetching}
      isError={isError}
      error={error}
      searchKey="name"
      searchValue={search}
      onSearchChange={onSearchChange}
      page={page}
      onPageChange={onPageChange}
      pageSize={pageSize}
      onPageSizeChange={onPageSizeChange}
      filterSlot={
        <StatusToggle
          value={status}
          onChange={onStatusChange}
          options={["pending", "accepted", "rejected"]}
        />
      }
    />
  );
};

export default TransferInTable;
