import { useMemo } from "react";
import { Package, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import StatusToggle from "../../../components/StatusToggle";
import TableWrapper from "../../../components/tables/TableWrapper";

const MiscReceiptTable = ({
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
            <Badge variant="secondary" className="font-mono text-sm font-medium">
              <Package className="[&>svg]:size-5.5" />
              {row.original.miscellaneous_inventory?.length ?? 0}
            </Badge>
          </div>
          
        ),
      },
      {
        accessorKey: "transaction_date",
        header: () => <div className="text-center">Transaction Date</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              {row.original.transaction_date || "—"}
            </span>
          </div>
          
        ),
      },
      {
        accessorKey: "description",
        header:  () => <div className="text-center">Transaction Type</div>,
        cell: ({ row }) => {
          const description = row.original.description;

          const formattedDescription = description
            ? description
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            : "—";

          return (
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                {formattedDescription}
              </span>
            </div>
           
          );
        },
      },
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

export default MiscReceiptTable;
