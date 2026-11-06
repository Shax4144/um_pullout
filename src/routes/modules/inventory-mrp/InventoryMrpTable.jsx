import { useMemo } from "react";
import { Package, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import StatusToggle from "../../../components/StatusToggle";
import TableWrapper from "../../../components/tables/TableWrapper";

const InventoryMrpTable = ({
  data,
  isFetching,
  isError,
  error,
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
        id: "id",
        accessorFn: (row) => row.id ?? null,
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
        accessorKey: "item_code",
        header: () => <div className="text-center">Item Code</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              {row.original.item_code || "—"}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "item_name",
        header: () => <div className="text-center">Item Name</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              {row.original.item_name || "—"}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "received",
        header: () => <div className="text-center">Received</div>,
        cell: ({ row }) => {
          const totalQuantity = (row.original.received ?? []).reduce(
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
      {
        accessorKey: "receipt",
        header: () => <div className="text-center">Misc Receipt</div>,
        cell: ({ row }) => {
          const totalQuantity = (row.original.receipt ?? []).reduce(
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
      {
        accessorKey: "issue",
        header: () => <div className="text-center">Misc Issue</div>,
        cell: ({ row }) => {
          const totalQuantity = (row.original.issue ?? []).reduce(
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

      {
        accessorKey: "move_order",
        header: () => <div className="text-center">Move Order</div>,
        cell: ({ row }) => {
          const totalQuantity = (row.original.move_order ?? []).reduce(
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
      {
        accessorKey: "transfer_in",
        header: () => <div className="text-center">Transfer In</div>,
        cell: ({ row }) => {
          const totalQuantity = (row.original.receipt ?? []).reduce(
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
      {
        accessorKey: "transfer_out",
        header: () => <div className="text-center">Transfer Out</div>,
        cell: ({ row }) => {
          const totalQuantity = (row.original.transfer_out ?? []).reduce(
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
      {
        accessorKey: "soh",
        header: () => <div className="text-center">Stock On Hand</div>,
        cell: ({ row }) => {
          const totalQuantity = (row.original.soh ?? []).reduce(
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
    ],
    [],
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
    />
  );
};

export default InventoryMrpTable;
