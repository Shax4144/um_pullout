import { useMemo } from "react";
import { Package, MoveDownLeft, MoveUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import StatusToggle from "../../../components/StatusToggle";
import TableWrapper from "../../../components/tables/TableWrapper";

const formatQuantity = (value) =>
  Number(value ?? 0).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });

const QuantityBadge = ({ value, variant = "secondary" }) => {
  const iconMap = {
    success: MoveDownLeft,
    destructive: MoveUpRight,
    secondary: Package,
  };

  const Icon = iconMap[variant] ?? Package;

  return value !== "0.000" ? (
    <Badge
      variant={variant}
      className="min-w-16 justify-center gap-2 tabular-nums text-sm"
    >
      <Icon className="size-4 shrink-0" />
      {formatQuantity(value)}
    </Badge>
  ) : (
      <p className="text-muted-foreground/80">
        0
      </p>
    
  );
};

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
        cell: ({ row }) => (
          <div className="flex justify-center">
            <QuantityBadge value={row.original.received} variant="success" />
          </div>
        ),
      },
      {
        accessorKey: "misc_receipt",
        header: () => <div className="text-center">Misc Receipt</div>,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <QuantityBadge
              value={row.original.misc_receipt}
              variant="success"
            />
          </div>
        ),
      },
      {
        accessorKey: "misc_issue",
        header: () => <div className="text-center">Misc Issue</div>,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <QuantityBadge
              value={row.original.misc_issue}
              variant="destructive"
            />
          </div>
        ),
      },
      {
        accessorKey: "move_order",
        header: () => <div className="text-center">Move Order</div>,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <QuantityBadge
              value={row.original.move_order}
              variant="destructive"
            />
          </div>
        ),
      },
      {
        accessorKey: "transfer_in",
        header: () => <div className="text-center">Transfer In</div>,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <QuantityBadge value={row.original.transfer_in} variant="success" />
          </div>
        ),
      },
      {
        accessorKey: "transfer_out",
        header: () => <div className="text-center">Transfer Out</div>,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <QuantityBadge
              value={row.original.transfer_out}
              variant="destructive"
            />
          </div>
        ),
      },
      {
        accessorKey: "stock_on_hand",
        header: () => <div className="text-center">Stock On Hand</div>,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <QuantityBadge
              value={row.original.stock_on_hand}
              variant="secondary"
            />
          </div>
        ),
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
