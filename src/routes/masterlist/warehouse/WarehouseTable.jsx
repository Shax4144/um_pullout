import { useMemo } from "react";
import {
  ArchiveRestore,
  ArchiveX,
  MoreHorizontal,
  Pencil,
} from "lucide-react";

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

const WarehouseTable = ({
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
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => (
          <Badge variant="secondary" className="font-mono text-sm font-medium">
            {row.getValue("code") || "—"}
          </Badge>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <p className="truncate text-sm font-medium text-foreground">
            {row.getValue("name") || "—"}
          </p>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
          const warehouse = row.original;
          const isArchived = status === "archived";

          return (
            <div className="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Actions for ${warehouse.name}`}
                      className="h-8 w-8 cursor-pointer rounded-md hover:bg-muted/20"
                    />
                  }
                >
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-40 rounded-xl p-1.5">
                  {isArchived ? (
                    <DropdownMenuItem
                      onClick={() => onAction(warehouse, "restore")}
                      className="cursor-pointer gap-2 rounded-lg"
                    >
                      <ArchiveRestore className="h-4 w-4" />
                      Restore
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem
                        onClick={() => onEdit(warehouse)}
                        className="cursor-pointer gap-2 rounded-lg"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => onAction(warehouse, "archive")}
                        className="cursor-pointer gap-2 rounded-lg"
                      >
                        <ArchiveX className="h-4 w-4" />
                        Archive
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
    [onAction, onEdit, status],
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
          options={["active", "archived"]}
        />
      }
    />
  );
};

export default WarehouseTable;