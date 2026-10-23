import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArchiveRestore,
  Plus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import AddWarehouseDialog from "./dialog/AddWarehouseDialog";
import Confirm from "../../../components/Confirm";
import DeleteConfirm from "../../../components/DeleteConfirm";
import { toast } from "@/components/ui/toast";

import { useSelectedRow } from "../../../context/SelectedRowProvider";

import {
  useFetchWarehousesQuery,
  usePostWarehouseMutation,
  useUpdateWarehouseMutation,
  useArchiveWarehouseMutation,
} from "../../../api/masterlist/warehouses.api"

import WarehouseTable from "./WarehouseTable";

const Warehouse = () => {
  // ================================================================
  // TABLE STATE
  // ================================================================

  const [status, setStatus] = useState("active");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const isPending = status === "pending";
  const isArchived = status === "archived";

  // ================================================================
  // SEARCH DEBOUNCE
  // ================================================================

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const normalizedSearch = search.trim();

      setDebouncedSearch(normalizedSearch);
      setPage(1);
    }, 400);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [search]);

  // ================================================================
  // FETCH ACTIVE / ARCHIVED USERS
  // ================================================================

  const {
    data: warehousesData,
    isFetching: isFetchingWarehouses,
    isError: isWarehousesError,
    error: warehousesError,
  } = useFetchWarehousesQuery(
    {
      status: isArchived ? 0 : 1,
      page,
      per_page: pageSize,
      search: debouncedSearch || undefined,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  // ================================================================
  // DERIVED TABLE DATA
  // ================================================================
  
  const tableData = useMemo(() => {
    return warehousesData;
  });
  const tableIsFetching = isFetchingWarehouses
  const tableIsError = isWarehousesError;
  const tableError = warehousesError;
 
  // ================================================================
  // MUTATIONS
  // ================================================================

  const [
    createWarehouse,
    { isLoading: isCreating },
  ] = usePostWarehouseMutation();

  const [
    updateWarehouse,
    { isLoading: isUpdating },
  ] = useUpdateWarehouseMutation();

  const [
    archiveWarehouse,
    { isLoading: isArchiving },
  ] = useArchiveWarehouseMutation();

  const isMutationLoading =
    isCreating ||
    isUpdating ||
    isArchiving;

  // ================================================================
  // DIALOG STATE
  // ================================================================

  const [openCreate, setOpenCreate] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [openRestore, setOpenRestore] = useState(false);

  const [mode, setMode] = useState("create");

  const {
    selectedRow,
    setSelectedRow,
    clearSelectedRow,
  } = useSelectedRow();

  // ================================================================
  // STATUS
  // ================================================================

  const statusMeta = useMemo(() => {
    const meta = {
      active: {
        label: "Active",
        description:
          "Manage available warehouses.",
      },

      archived: {
        label: "Archived",
        description:
          "View and restore archived warehouses.",
      },
    };

    return meta[status] ?? meta.active;
  }, [status]);

  // ================================================================
  // CREATE
  // ================================================================

  const handleOpenCreate = useCallback(() => {
    if (isMutationLoading) {
      return;
    }

    clearSelectedRow();
    setMode("create");
    setOpenCreate(true);
  }, [
    clearSelectedRow,
    isMutationLoading,
  ]);

  // ================================================================
  // EDIT USER
  // ================================================================

  const handleOpenEdit = useCallback(
    (category) => {
      if (isMutationLoading) {
        return;
      }

      setSelectedRow(category);
      setMode("edit");
      setOpenCreate(true);
    },
    [
      setSelectedRow,
      isMutationLoading,
    ],
  );

  // ================================================================
  // ARCHIVE
  // ================================================================

  const handleOpenArchive = useCallback(
    (category) => {
      if (isMutationLoading) {
        return;
      }

      setSelectedRow(category);
      setOpenArchive(true);
    },
    [
      setSelectedRow,
      isMutationLoading,
    ],
  );

  // ================================================================
  // RESTORE
  // ================================================================

  const handleOpenRestore = useCallback(
    (category) => {
      if (isMutationLoading) {
        return;
      }

      setSelectedRow(category);
      setOpenRestore(true);
    },
    [
      setSelectedRow,
      isMutationLoading,
    ],
  );

  // ================================================================
  // STATUS CHANGE
  // ================================================================

  const handleStatusChange = useCallback(
    (nextStatus) => {
      if (nextStatus === status) {
        return;
      }

      setStatus(nextStatus);
      setPage(1);
    },
    [status],
  );

  // ================================================================
  // PAGE SIZE CHANGE
  // ================================================================

  const handlePageSizeChange = useCallback(
    (nextPageSize) => {
      if (nextPageSize === pageSize) {
        return;
      }

      setPageSize(nextPageSize);
      setPage(1);
    },
    [pageSize],
  );

  // ================================================================
  // SEARCH CHANGE
  // ================================================================

  const handleSearchChange = useCallback(
    (value) => {
      setSearch(value);
    },
    [],
  );

  // ================================================================
  // CLOSE CREATE / EDIT DIALOG
  // ================================================================

  const handleCloseCreate = useCallback(() => {
    if (isCreating || isUpdating) {
      return;
    }

    setOpenCreate(false);
    setMode("create");
    clearSelectedRow();
  }, [
    isCreating,
    isUpdating,
    clearSelectedRow,
  ]);

  // ================================================================
  // CREATE / UPDATE
  // ================================================================

  const handleCreateOrUpdate = useCallback(
    async (categoryData) => {
      if (isCreating || isUpdating) {
        return;
      }

      try {
        if (selectedRow && mode === "edit") {
          const response =
            await updateWarehouse({
              id: selectedRow.id,
              ...categoryData,
            }).unwrap();

          toast.add({
            type: "success",
            title: "Warehouse updated",
            description: response?.message ??
              "The warehouse has been updated successfully.",
          });
        } else {
          const response =
            await createWarehouse(categoryData).unwrap();

          console.log("payload", categoryData);
          toast.add({
            type: "success",
            title: "Warehouse created",
            description: response?.message ??
              "The warehouse has been created successfully.",
          });
        }

        setOpenCreate(false);
        setMode("create");
        clearSelectedRow();
        setPage(1);
      } catch (error) {
        const message =
          error?.data?.message ??
          error?.data?.errors?.[0]?.detail ??
          "An error occurred while processing the warehouse.";

        toast.add({
          type: "error",
          title: "Unable to save warehouse",
          description: message,
        });

        console.error(
          "Failed to create/update warehouse:",
          error,
        );
      }
    },
    [
      isCreating,
      isUpdating,
      selectedRow,
      mode,
      updateWarehouse,
      createWarehouse,
      clearSelectedRow,
    ],
  );

  // ================================================================
  // CLOSE ARCHIVE
  // ================================================================

  const handleCloseArchive = useCallback(() => {
    if (isArchiving) {
      return;
    }

    setOpenArchive(false);
    clearSelectedRow();
  }, [
    isArchiving,
    clearSelectedRow,
  ]);

  // ================================================================
  // ARCHIVE USER
  // ================================================================

  const handleConfirmArchive = useCallback(
    async () => {
      if (!selectedRow || isArchiving) {
        return;
      }

      try {
        const response =
          await archiveWarehouse(
            selectedRow.id,
          ).unwrap();

          toast.add({
            type: "success",
            title: "Warehouse archived",
            description: response?.message ??
              "The warehouse has been archived successfully.",
          });

        setOpenArchive(false);
        clearSelectedRow();
      } catch (error) {
        const message =
          error?.data?.message ??
          error?.data?.errors?.[0]?.detail ??
          "An error occurred while archiving the warehouse.";

        toast.add({
          type: "error",
          title: "Unable to archive warehouse",
          description: message,
        });

        console.error(
          "Failed to archive warehouse:",
          error,
        );
      }
    },
    [
      selectedRow,
      isArchiving,
      archiveWarehouse,
      clearSelectedRow,
    ],
  );

  // ================================================================
  // CLOSE RESTORE
  // ================================================================

  const handleCloseRestore = useCallback(() => {
    if (isArchiving) {
      return;
    }

    setOpenRestore(false);
    clearSelectedRow();
  }, [
    isArchiving,
    clearSelectedRow,
  ]);

  // ================================================================
  // RESTORE USER
  // ================================================================

  const handleConfirmRestore = useCallback(
    async () => {
      if (!selectedRow || isArchiving) {
        return;
      }

      try {
        /*
         * Preserved your existing archive mutation here.
         *
         * If your backend has a dedicated restore mutation,
         * replace this call with that mutation instead.
         */
        const response =
          await archiveWarehouse(
            selectedRow.id,
          ).unwrap();

        toast.add({
          type: "success",
          title: "User restored",
          description: response?.message ??
            "The user account has been restored successfully.",
        });

        setOpenRestore(false);
        clearSelectedRow();
      } catch (error) {
        const message =
          error?.data?.message ??
          error?.data?.errors?.[0]?.detail ??
          "An error occurred while restoring the user account.";

        toast.add({
          type: "error",
          title: "Unable to restore user",
          description: message,
        });

        console.error(
          "Failed to restore user:",
          error,
        );
      }
    },
    [
      selectedRow,
      isArchiving,
      archiveWarehouse,
      clearSelectedRow,
    ],
  );

  // ================================================================
  // KEEP PAGINATION VALID
  //
  // Example:
  // User is on page 5 and archives the last remaining user
  // on page 5. After refetch, page 5 no longer exists.
  // Automatically move back to the last valid page.
  // ================================================================

  useEffect(() => {
    const lastPage =
      tableData?.last_page;

    if (
      !lastPage ||
      tableIsFetching ||
      page <= 1
    ) {
      return;
    }

    if (page > lastPage) {
      setPage(lastPage);
    }
  }, [
    tableData?.last_page,
    tableIsFetching,
    page,
  ]);

  // ================================================================
  // DISPLAY COUNT
  // ================================================================

  const totalRows =
    tableData?.total ??
    0;

  return (
    <div
      className="
        flex
        h-full
        min-h-0
        flex-col
        gap-5
      "
    >
      {/* ============================================================
          PAGE HEADER
      ============================================================ */}
      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        {/* Title */}
        <div className="min-w-0">
          {/* <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Roles
            </h1>

            <Badge
              variant="secondary"
              className="
                rounded-full
                px-2
                py-0.5
                text-xs
                font-medium
              "
            >
              {statusMeta.label}
            </Badge>
          </div>*/}

          <p className="text-sm text-muted-foreground">
            {statusMeta.description}
          </p>
        </div>

        {/* Action */}
        <Button
          type="button"
          onClick={handleOpenCreate}
          disabled={isMutationLoading}
          className="
            h-10
            w-full
            cursor-pointer
            gap-2
            font-semibold
            sm:w-auto
            sm:min-w-32
          "
        >
          <Plus className="h-4 w-4" />
          Add Warehouse
        </Button>
      </div>

      {/* ============================================================
          TABLE
      ============================================================ */}
      <div
        className="
          min-h-0
          flex-1
        "
      >
        <WarehouseTable
          data={tableData}
          isFetching={tableIsFetching}
          isError={tableIsError}
          error={tableError}
          status={status}
          onStatusChange={handleStatusChange}
          onEdit={handleOpenEdit}
          onArchive={handleOpenArchive}
          onRestore={handleOpenRestore}
          page={page}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          search={search}
          onSearchChange={handleSearchChange}
        />
      </div>

      {/* ============================================================
          CREATE / EDIT DIALOG
      ============================================================ */}
      <AddWarehouseDialog
        open={openCreate}
        onClose={handleCloseCreate}
        onConfirm={handleCreateOrUpdate}
        isLoading={isCreating || isUpdating}
        mode={mode}
        selectedRow={selectedRow}
      />

      {/* ============================================================
          ARCHIVE CONFIRMATION
      ============================================================ */}
      <DeleteConfirm
        open={openArchive}
        onClose={handleCloseArchive}
        onConfirm={handleConfirmArchive}
        isLoading={isArchiving}
      />

      {/* ============================================================
          RESTORE CONFIRMATION
      ============================================================ */}
      <Confirm
        open={openRestore}
        onClose={handleCloseRestore}
        onConfirm={handleConfirmRestore}
        isLoading={isArchiving}
      />
    </div>
  );
};

export default Warehouse;
