import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  ArchiveRestore,
  ArchiveX,
  MoreHorizontal,
  UserPlus,
  Pencil,
} from "lucide-react";

import { useMemo } from "react";

import StatusToggle from "../../../components/StatusToggle";
import TableWrapper from "../../../components/tables/TableWrapper";
import { PERMISSION_OPTIONS } from "./dialog/AddRoleDialog";

const RolesTable = ({
  data,
  isFetching,
  isError,
  error,
  status,
  handleStatusChange,
  onArchive,
  onRestore,
  onEdit,
  onCreate,
  page,
  onPageChange,
  pageSize,
  onPageSizeChange,
  search,
  onSearchChange,
}) => {
  const columns = useMemo(
    () => [
      // ============================================================
      // NAME
      // ============================================================
      {
        accessorKey: "name",
        header: "Role Name",
        cell: ({ row }) => {
          const { name } = row.original;

          const roleName = name;

          return (
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground capitalize">
                {roleName || "—"}
              </p>
            </div>
          );
        },
      },

      // ============================================================
      // PERMISSIONS
      // ============================================================
      {
        accessorKey: "permissions",
        header: "Permissions",
        cell: ({ row }) => {
          const permissions = row.getValue("permissions");

          if (!Array.isArray(permissions) || permissions.length === 0) {
            return <span className="text-sm text-muted-foreground">—</span>;
          }

          const visiblePermissions = permissions.slice(0, 3);
          const remainingCount = permissions.length - 3;

          return (
            <div className="flex flex-wrap items-center gap-1.5">
              {visiblePermissions.map((value) => {
                const option = PERMISSION_OPTIONS.find(
                  (item) => item.value === value,
                );

                return (
                  <Badge
                    key={value}
                    variant="outline"
                    className={`
                      rounded-md
                      px-2 py-2.5
                      text-xs font-medium
                      ${
                        option?.badgeClass ||
                        "border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                      }
                    `}
                  >
                    {option?.label || value}
                  </Badge>
                );
              })}

              {remainingCount > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="inline-flex">
                        <Badge
                          variant="default"
                          className="cursor-pointer rounded-full px-2 py-2.5 text-xs font-medium"
                        >
                          +{remainingCount}
                        </Badge>
                      </span>
                    </TooltipTrigger>

                    <TooltipContent
                      side="top"
                      align="center"
                      className="max-w-xs"
                    >
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold">
                          Additional Permissions
                        </span>

                        {permissions.slice(3).map((value) => {
                          const option = PERMISSION_OPTIONS.find(
                            (item) => item.value === value,
                          );

                          return (
                            <span key={value} className="text-xs">
                              {option?.label || value}
                            </span>
                          );
                        })}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          );
        },
      },

      // ============================================================
      // STATUS
      // ============================================================
      {
        accessorKey: "deleted_at",
        header: "Status",
        cell: () => {
          const showArchived = status === "archived";

          const statusConfig = showArchived
            ? {
                label: "Archived",
                dot: "bg-muted-foreground",
                className:
                  "bg-secondary text-secondary-foreground border-border",
              }
            : {
                label: "Active",
                dot: "bg-emerald-500",
                className:
                  "bg-active-status-bg text-success-foreground border-success/40",
              };

          return (
            <Badge
              variant={showArchived ? "archived" : "success"}
              className={`
                gap-1.5
                rounded-full
                px-2
                py-2.5
                text-xs
                font-medium
              `}
            >
              <span
                aria-hidden="true"
                className={`
                  h-1.5
                  w-1.5
                  rounded-full
                  ${statusConfig.dot}
                `}
              />

              {statusConfig.label}
            </Badge>
          );
        },
      },

      // ============================================================
      // ACTIONS
      // ============================================================
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,

        cell: ({ row }) => (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Actions for ${
                      row.original.username || "user"
                    }`}
                    className="
                      h-8
                      w-8
                      cursor-pointer
                      rounded-md
                      text-muted-foreground
                      transition-colors
                      hover:bg-muted
                      hover:text-foreground
                      focus-visible:ring-2
                      focus-visible:ring-ring
                    "
                  />
                }
              >
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={6}
                className="
                  w-44
                  rounded-xl
                  p-1.5
                  shadow-lg
                "
              >
                {/* ==================================================
                    PENDING
                ================================================== */}
                {status === "pending" ? (
                  <DropdownMenuItem
                    onClick={() => onCreate(row.original)}
                    className="
                      cursor-pointer
                      gap-2
                      rounded-lg
                      px-3
                      py-2
                      text-sm
                      text-emerald-600
                      focus:bg-emerald-50
                      focus:text-emerald-700
                      dark:text-emerald-400
                      dark:focus:bg-emerald-950/40
                      dark:focus:text-emerald-300
                    "
                  >
                    <UserPlus className="h-4 w-4" />

                    <span>Create Role</span>
                  </DropdownMenuItem>
                ) : status === "archived" ? (
                  /* ==================================================
                     ARCHIVED
                  ================================================== */
                  <DropdownMenuItem
                    onSelect={() => onRestore(row.original)}
                    className="
                      cursor-pointer
                      gap-2
                      rounded-lg
                      px-3
                      py-2
                      text-sm
                      text-emerald-600
                      focus:bg-emerald-50
                      focus:text-emerald-700
                      dark:text-emerald-400
                      dark:focus:bg-emerald-950/40
                      dark:focus:text-emerald-300
                    "
                  >
                    <ArchiveRestore className="h-4 w-4" />

                    <span>Restore</span>
                  </DropdownMenuItem>
                ) : (
                  /* ==================================================
                     ACTIVE
                  ================================================== */
                  <>
                    <DropdownMenuItem
                      onClick={() => onEdit(row.original)}
                      className="
                        cursor-pointer
                        gap-2
                        rounded-lg
                        px-3
                        py-2
                        text-sm
                      "
                    >
                      <Pencil className="h-4 w-4" />

                      <span>Edit</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1" />

                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onArchive(row.original)}
                      className="
                        cursor-pointer
                        gap-2
                        rounded-lg
                        px-3
                        py-2
                        text-sm
                      "
                    >
                      <ArchiveX className="h-4 w-4" />

                      <span>Archive</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [onCreate, onEdit, onArchive, onRestore, status],
  );

  return (
    <TableWrapper
      columns={columns}
      data={data?.data || []}
      paginationData={data}
      isFetching={isFetching}
      isError={isError}
      error={error}
      searchKey="username"
      searchValue={search}
      onSearchChange={onSearchChange}
      page={page}
      onPageChange={onPageChange}
      pageSize={pageSize}
      onPageSizeChange={onPageSizeChange}
      filterSlot={
        <StatusToggle
          value={status}
          onChange={handleStatusChange}
          options={["active", "archived"]}
        />
      }
    />
  );
};

export default RolesTable;
