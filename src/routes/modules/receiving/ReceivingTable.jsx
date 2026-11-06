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
        id: "number_of_items",
        accessorFn: (row) => row.inventories?.length ?? 0,
        header: () => <div className="text-center">No. of Items</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <Badge variant="secondary" className="font-mono text-sm font-medium">
              <Package className="[&>svg]:size-5.5" />
              {row.original.inventories?.length ?? 0}
            </Badge>
          </div>
         
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
        header: () => <div className="text-center">Supplier</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <p className="truncate text-sm font-medium text-foreground">
              {row.original.supplier_name || "—"}
            </p>
          </div>
          
        ),
      },
      {
        accessorKey: "received_date",
        header: () => <div className="text-center">Receiving Date</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              {row.original.received_date || "—"}
            </span>
          </div>
          
        ),
      },
      {
        accessorKey: "remarks",
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
    [onEdit, status],
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
