import { useMemo } from "react";
import { Package, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import StatusToggle from "../../../components/StatusToggle";
import TableWrapper from "../../../components/tables/TableWrapper";

const MoveOrderTable = ({
  data,
  isFetching,
  isError,
  error,
  status,
  onStatusChange,
  onEdit,
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
        id: "stock-id",
        accessorFn: (row) => row.stock?.id ?? null,
        header: () => <div className="text-center">ID</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              {row.original.id || "—"}
            </span>
          </div>
        ),
      },
      // {
      //   id: "batch_no",
      //   accessorFn: (row) => row.stock?.batch_no ?? "",
      //   header: "Received Batch No.",
      //   cell: ({ row }) => (
      //     <p className="truncate text-sm font-medium text-foreground">
      //       {row.original.stock?.batch_no|| "—"}
      //     </p>
      //   ),
      // },
      {
        id: "number_of_items",
        accessorFn: (row) => row.stock?.inventories?.length ?? 0,
        header: () => <div className="text-center">No. of Items</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <Badge
              variant="secondary"
              className="font-mono text-sm font-medium"
            >
              <Package className="[&>svg]:size-5.5" />
              {row.original.move_inventory?.length ?? 0}
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: "requested_quantity",
        header: () => <div className="text-center">Requested</div>,
        cell: ({ row }) => {
          const totalQuantity = (row.original.move_inventory ?? []).reduce(
            (total, inventory) => total + Number(inventory.quantity || 0),
            0,
          );

          return (
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                {totalQuantity.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          );
        },
      },
      // {
      //   accessorKey: "released",
      //   header: () => <div className="text-center">Released</div>,
      //   cell: ({ row }) => (
      //     <div className="text-center">
      //       <span className="text-sm text-muted-foreground">
      //         {row.original.released || "0"}
      //       </span>
      //     </div>

      //   ),
      // },
      // {
      //   accessorKey: "remaining",
      //   header: () => <div className="text-center">Remaining</div>,
      //   cell: ({ row }) => (
      //     <div className="text-center">
      //       <span className="text-sm text-muted-foreground">
      //         {row.original.remaining || "0"}
      //       </span>
      //     </div>
      //   ),
      // },
      {
        accessorKey: "date",
        header: () => <div className="text-center">Order Date</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              {row.original.date || "—"}
            </span>
          </div>
        ),
      },
      // {
      //     id: "account_title",
      //     accessorFn: (row) =>
      //       row.stock?.inventories
      //         ?.map((inventory) => inventory.account_title?.name)
      //         .filter(Boolean)
      //         .join(", ") ?? "",
      //     header: "Account Title",
      //     cell: ({ row }) => {
      //       const inventories = row.original.stock?.inventories ?? [];

      //       // Display each unique account title once per batch.
      //       const accountTitles = [
      //         ...new Map(
      //           inventories
      //             .filter((inventory) => inventory.account_title?.name)
      //             .map((inventory) => [
      //               inventory.account_title.id,
      //               inventory.account_title.name,
      //             ])
      //         ).values(),
      //       ];

      //       return (
      //         <div className="flex max-w-64 flex-col gap-1">
      //           {accountTitles.length ? (
      //             accountTitles.map((name, index) => (
      //               <span
      //                 key={`${name}-${index}`}
      //                 className="truncate text-sm text-muted-foreground"
      //                 title={name}
      //               >
      //                 {name}
      //               </span>
      //             ))
      //           ) : (
      //             <span className="text-sm text-muted-foreground">—</span>
      //           )}
      //         </div>
      //       );
      //     },
      //   },
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
        id: "remarks",
        accessorFn: (row) => row.stock?.remarks ?? "",
        header: () => <div className="text-center">Remarks</div>,
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
                variant="action"
                size="lg"
                aria-label={`View receipt ${item.stock?.batch_no ?? ""}`}
                title="View"
                className="h-8 w-8 cursor-pointer rounded-md"
                onClick={() => onEdit(item)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [onEdit],
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
        <StatusToggle value={status} onChange={onStatusChange} options={[]} />
      }
    />
  );
};

export default MoveOrderTable;
