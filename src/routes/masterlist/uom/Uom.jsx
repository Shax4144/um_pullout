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
import { Badge } from "@/components/ui/badge";

import AddUomDialog from "./dialog/AddUomDialog";
import Confirm from "../../../components/Confirm";
import DeleteConfirm from "../../../components/DeleteConfirm";
import { toast } from "@/components/ui/toast";

import { useSelectedRow } from "../../../context/SelectedRowProvider";

import {
  useFetchUomsQuery,
  usePostUomMutation,
  useUpdateUomMutation,
  useArchiveUomMutation,
} from "../../../api/masterlist/uom.api"

import UomTable from "./UomTable";

const Uom = () => {
  // ================================================================
  // TABLE STATE
  // ================================================================

  const [status, setStatus] = useState("active");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
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
    data: uomsData,
    isFetching: isFetchingUoms,
    isError: isUomsError,
    error: uomsError,
  } = useFetchUomsQuery(
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
    return uomsData;
  });
  const tableIsFetching = isFetchingUoms
  const tableIsError = isUomsError;
  const tableError = uomsError;

  // ================================================================
  // MUTATIONS
  // ================================================================

  const [
    createUom,
    { isLoading: isCreating },
  ] = usePostUomMutation();

  const [
    updateUom,
    { isLoading: isUpdating },
  ] = useUpdateUomMutation();

  const [
    archiveUom,
    { isLoading: isArchiving },
  ] = useArchiveUomMutation();

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
          "Manage the unit of measure.",
      },

      archived: {
        label: "Archived",
        description:
          "View and restore archived units of measure.",
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
    (role) => {
      if (isMutationLoading) {
        return;
      }

      setSelectedRow(role);
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
    (role) => {
      if (isMutationLoading) {
        return;
      }

      setSelectedRow(role);
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
    (user) => {
      if (isMutationLoading) {
        return;
      }

      setSelectedRow(user);
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
    async (userData) => {
      if (isCreating || isUpdating) {
        return;
      }

      try {
        if (selectedRow && mode === "edit") {
          const response =
            await updateUom({
              id: selectedRow.id,
              ...userData,
            }).unwrap();

          toast.add({
            type: "success",
            title: "Unit of Measure updated",
            description: response?.message ??
              "The unit of measure has been updated successfully.",
          });
        } else {
          const response =
            await createUom(userData).unwrap();

          toast.add({
            type: "success",
            title: "Unit of Measure created",
            description: response?.message ??
              "The unit of measure has been created successfully.",
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
          "An error occurred while processing the unit of measure.";

        toast.add({
          type: "error",
          title: "Unable to save unit of measure",
          description: message,
        });

        console.error(
          "Failed to create/update unit of measure:",
          error,
        );
      }
    },
    [
      isCreating,
      isUpdating,
      selectedRow,
      mode,
      updateUom,
      createUom,
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
          await archiveUom(
            selectedRow.id,
          ).unwrap();

          toast.add({
            type: "success",
            title: "Unit of Measure archived",
            description: response?.message ??
              "The unit of measure has been archived successfully.",
          });

        setOpenArchive(false);
        clearSelectedRow();
      } catch (error) {
        const message =
          error?.data?.message ??
          error?.data?.errors?.[0]?.detail ??
          "An error occurred while archiving the unit of measure.";

        toast.add({
          type: "error",
          title: "Unable to archive unit of measure",
          description: message,
        });

        console.error(
          "Failed to archive unit of measure:",
          error,
        );
      }
    },
    [
      selectedRow,
      isArchiving,
      archiveUom,
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
          await archiveUom(
            selectedRow.id,
          ).unwrap();

        toast.add({
          type: "success",
          title: "Unit of Measure restored",
          description: response?.message ??
            "The unit of measure has been restored successfully.",
        });

        setOpenRestore(false);
        clearSelectedRow();
      } catch (error) {
        const message =
          error?.data?.message ??
          error?.data?.errors?.[0]?.detail ??
          "An error occurred while restoring the unit of measure.";

        toast.add({
          type: "error",
          title: "Unable to restore unit of measure",
          description: message,
        });

        console.error(
          "Failed to restore unit of measure:",
          error,
        );
      }
    },
    [
      selectedRow,
      isArchiving,
      archiveUom,
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
          Add UOM
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
        <UomTable
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
          CREATE / EDIT / PENDING DIALOG
      ============================================================ */}
      <AddUomDialog
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

export default Uom;
