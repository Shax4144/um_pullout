import { useCallback, useEffect, useMemo, useState } from "react";

import { ArchiveRestore, Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import AddUomDialog from "./dialog/AddUomDialog";
import ActionConfirm from "../../../components/ActionConfirm";
import { toast } from "@/components/ui/toast";

import { useSelectedRow } from "../../../context/SelectedRowProvider";

import {
  useFetchUomsQuery,
  useLazyFetchUomByIdQuery,
  usePostUomMutation,
  useUpdateUomMutation,
  useArchiveUomMutation,
} from "../../../api/masterlist/uom.api";

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
  const [actionType, setActionType] = useState("archive");
  const [openAction, setOpenAction] = useState(false);

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
  // FETCH Units Of Measure
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
  // FETCH Units Of Measure
  // ================================================================

  const [fetchUomById, { isFetching: isFetchingUomDetails }] =
    useLazyFetchUomByIdQuery();

  // ================================================================
  // DERIVED TABLE DATA
  // ================================================================
  const tableData = useMemo(() => {
    return uomsData;
  });
  const tableIsFetching = isFetchingUoms;
  const tableIsError = isUomsError;
  const tableError = uomsError;

  // ================================================================
  // MUTATIONS
  // ================================================================

  const [createUom, { isLoading: isCreating }] = usePostUomMutation();

  const [updateUom, { isLoading: isUpdating }] = useUpdateUomMutation();

  const [archiveUom, { isLoading: isArchiving }] = useArchiveUomMutation();

  const isMutationLoading = isCreating || isUpdating || isArchiving;

  // ================================================================
  // DIALOG STATE
  // ================================================================

  const [openCreate, setOpenCreate] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [openRestore, setOpenRestore] = useState(false);

  const [mode, setMode] = useState("create");

  const { selectedRow, setSelectedRow, clearSelectedRow } = useSelectedRow();

  // ================================================================
  // STATUS
  // ================================================================

  const statusMeta = useMemo(() => {
    const meta = {
      active: {
        label: "Active",
        description: "Manage the unit of measure.",
      },

      archived: {
        label: "Archived",
        description: "View and restore archived units of measure.",
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
  }, [clearSelectedRow, isMutationLoading]);

  // ================================================================
  // EDIT USER
  // ================================================================

  const handleOpenEdit = useCallback(
    async (uom) => {
      if (isMutationLoading || isFetchingUomDetails) {
        return;
      }

      try {
        const response = await fetchUomById(uom.id).unwrap();

        const uomDetails = response?.data ?? response;
        setSelectedRow(uomDetails);
        setMode("edit");
        setOpenCreate(true);
      } catch (error) {
        const message =
          error?.data?.message ??
          "Unable to retrieve the details of unit of measure.";

        toast.add({
          type: "error",
          title: "Unable to load the unit of measure",
          description: message,
        });

        console.error("Failed to fetch unit of measure:", error);
      }
    },
    [isMutationLoading, isFetchingUomDetails, fetchUomById, setSelectedRow],
  );

  // ================================================================
  // CONFIRM ACTION
  // ================================================================

  const handleOpenAction = useCallback(
    (uom, actionType) => {
      if (isMutationLoading) return;

      setSelectedRow(uom);
      setActionType(actionType);
      setOpenAction(true);
    },
    [isMutationLoading, setSelectedRow],
  );

  const handleCloseAction = useCallback(() => {
    if (isArchiving) return;

    setOpenAction(false);
    clearSelectedRow();
  }, [isArchiving, clearSelectedRow]);

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

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
  }, []);

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
  }, [isCreating, isUpdating, clearSelectedRow]);

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
          const response = await updateUom({
            id: selectedRow.id,
            ...userData,
          }).unwrap();

          toast.add({
            type: "success",
            title: "Unit of Measure updated",
            description:
              response?.message ??
              "The unit of measure has been updated successfully.",
          });
        } else {
          const response = await createUom(userData).unwrap();

          toast.add({
            type: "success",
            title: "Unit of Measure created",
            description:
              response?.message ??
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

        console.error("Failed to create/update unit of measure:", error);
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

  const handleConfirmAction = useCallback(async () => {
    if (!selectedRow || isArchiving) return;

    const isRestore = actionType === "restore";
    const actionLabel = isRestore ? "restored" : "archived";

    try {
      const response = await archiveUom(selectedRow.id).unwrap();

      toast.add({
        type: "success",
        title: `Unit of Measure ${actionLabel}`,
        description:
          response?.message ??
          `The unit of measure has been ${actionLabel} successfully.`,
      });

      setOpenAction(false);
      clearSelectedRow();
    } catch (error) {
      const message =
        error?.data?.message ??
        error?.data?.errors?.[0]?.detail ??
        `An error occurred while ${isRestore ? "restoring" : "archiving"} the unit of measure.`;

      toast.add({
        type: "error",
        title: `Unable to ${isRestore ? "restore" : "archive"} unit of measure`,
        description: message,
      });

      console.error(
        `Failed to ${isRestore ? "restore" : "archive"} unit of measure:`,
        error,
      );
    }
  }, [selectedRow, isArchiving, actionType, archiveUom, clearSelectedRow]);

  // ================================================================
  // KEEP PAGINATION VALID
  //
  // Example:
  // User is on page 5 and archives the last remaining user
  // on page 5. After refetch, page 5 no longer exists.
  // Automatically move back to the last valid page.
  // ================================================================

  useEffect(() => {
    const lastPage = tableData?.last_page;

    if (!lastPage || tableIsFetching || page <= 1) {
      return;
    }

    if (page > lastPage) {
      setPage(lastPage);
    }
  }, [tableData?.last_page, tableIsFetching, page]);

  // ================================================================
  // DISPLAY COUNT
  // ================================================================

  const totalRows = tableData?.total ?? 0;

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
          onAction={handleOpenAction}
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
          RESTORE CONFIRMATION
      ============================================================ */}
      <ActionConfirm
        actionType={actionType}
        open={openAction}
        onClose={handleCloseAction}
        onConfirm={handleConfirmAction}
        isLoading={isArchiving}
      />
    </div>
  );
};

export default Uom;
