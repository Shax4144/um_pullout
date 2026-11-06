import { useMemo } from "react";
import { Package, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import StatusToggle from "../../../components/StatusToggle";
import TableWrapper from "../../../components/tables/TableWrapper";

const MiscIssueTable = ({
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
        id: "id",
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
      {
        id: "number_of_items",
        accessorFn: (row) => row.miscellaneous_issues?.length ?? 0,
        header: () => <div className="text-center">No. of Items</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <Badge
              variant="secondary"
              className="font-mono text-sm font-medium"
            >
              <Package className="[&>svg]:size-5.5" />
              {row.original.miscellaneous_issues?.length ?? 0}
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: "date",
        header: () => <div className="text-center">Transaction Date</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              {row.original.date || "—"}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "transaction_type",
        header: () => <div className="text-center">Transaction Type</div>,
        cell: ({ row }) => {
          const type = row.original.transaction_type;

          const formattedType = type
            ? type
                .split(/[-_ ]/)
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            : "—";

          return (
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                {formattedType}
              </span>
            </div>
          );
        },
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
          const issue = row.original;

          return (
            <div className="flex justify-center">
              <Button
                variant="action"
                size="lg"
                aria-label={`View miscellaneous issue ${issue.id}`}
                title="View"
                className="h-8 w-8 cursor-pointer rounded-md"
                onClick={() => onEdit(issue)}
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

export default MiscIssueTable;
