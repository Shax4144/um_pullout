import { useMemo } from "react";
import {
  Package,
  Eye
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import StatusToggle from "../../../components/StatusToggle";
import TableWrapper from "../../../components/tables/TableWrapper";

const ReceivingTable = ({
  data,
  isFetching,
  isError,
  error,
  status,
  onStatusChange,
  onEdit,
  onArchive,
  onRestore,
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
        id: "number_of_items",
        accessorFn: (row) => row.inventories?.length ?? 0,
        header: "No. of Items",
        cell: ({ row }) => (
          <Badge variant="secondary" className="font-mono text-sm font-medium">
            <Package className="[&>svg]:size-5.5" />
            {row.original.inventories?.length ?? 0}
          </Badge>
        ),
      },
      // {
      //   accessorKey: "batch_no",
      //   header: "Batch No.",
      //   cell: ({ row }) => (
      //     <span className="text-sm text-muted-foreground">
      //       {row.original.batch_no || "—"}
      //     </span>
      //   ),
      // },
      {
        accessorKey: "supplier_name",
        header: "Supplier",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground">
            {row.original.supplier_name || "—"}
          </p>
        ),
      },
      {
        accessorKey: "received_date",
        header: "Receiving Date",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.received_date || "—"}
          </span>
        ),
      },
      {
        id: "account_title",
        accessorFn: (row) =>
          row.inventories
            ?.map((inventory) => inventory.account_title?.name)
            .filter(Boolean)
            .join(", ") ?? "",
        header: "Account Title",
        cell: ({ row }) => {
          const inventories = row.original.inventories ?? [];

          return (
            <div className="flex max-w-64 flex-col gap-1">
              {inventories.length ? (
                inventories.map((inventory) => (
                  <span
                    key={inventory.id}
                    className="truncate text-sm text-muted-foreground"
                    title={inventory.account_title?.name}
                  >
                    {inventory.account_title?.name || "—"}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </div>
          );
        },
      },
      // {
      //   id: "uom",
      //   header: "UOM",
      //   cell: ({ row }) => {
      //     const inventories = row.original.inventories ?? [];

      //     return (
      //       <div className="flex flex-col gap-1">
      //         {inventories.length ? (
      //           inventories.map((inventory) => (
      //             <Badge key={inventory.id} variant="secondary">
      //               {inventory.uom?.symbol || "—"}
      //             </Badge>
      //           ))
      //         ) : (
      //           <Badge variant="secondary">—</Badge>
      //         )}
      //       </div>
      //     );
      //   },
      // },
      // {
      //   id: "actual_received",
      //   header: "Actual Received",
      //   cell: ({ row }) => {
      //     const inventories = row.original.inventories ?? [];

      //     return (
      //       <div className="flex flex-col gap-1">
      //         {inventories.length ? (
      //           inventories.map((inventory) => (
      //             <span key={inventory.id} className="text-sm tabular-nums">
      //               {inventory.actual_received ?? 0}
      //             </span>
      //           ))
      //         ) : (
      //           <span className="text-sm text-muted-foreground">—</span>
      //         )}
      //       </div>
      //     );
      //   },
      // },
      {
        accessorKey: "remarks",
        header: "Remarks",
        cell: ({ row }) => (
          <span
            className="block max-w-48 truncate text-sm text-muted-foreground"
            title={row.original.remarks || ""}
          >
            {row.original.remarks || "—"}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-center">View</div>,
        cell: ({ row }) => {
          const item = row.original;
      
          return (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                aria-label={`View receiving ${item.id}`}
                title="View"
                className="h-8 w-8 cursor-pointer rounded-md"
                onClick={() => onEdit(item)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      }
    ],
    [onArchive, onEdit, onRestore, status],
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
          options={[]}
        />
      }
    />
  );
};

export default ReceivingTable;
