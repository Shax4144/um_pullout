import { useCallback, useEffect, useMemo, useState } from "react";

import { ArchiveRestore, Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import MiscReceiptDialog from "./dialog/MiscReceiptDialog";
import ActionConfirm from "../../../components/ActionConfirm";
import { toast } from "@/components/ui/toast";

import { useSelectedRow } from "../../../context/SelectedRowProvider";

import {
  useFetchMiscReceiptsQuery,
  useLazyFetchMiscReceiptByIdQuery,
  usePostMiscReceiptMutation,
  useUpdateMiscReceiptMutation,
  useArchiveMiscReceiptMutation,
} from "../../../api/modules/misc-receipt.api";

// import { useLazyFetchReceivingQuery } from "../../../api/modules/receiving.api"

import MiscReceiptTable from "./MiscReceiptTable";

const MiscReceipt = () => {
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
  // FETCH MISC RECEIPTS
  // ================================================================

  const {
    data: miscReceiptsData,
    isFetching: isFetchingMiscReceipts,
    isError: isMiscReceiptsError,
    error: miscReceiptsError,
  } = useFetchMiscReceiptsQuery(
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
  // FETCH MISC RECEIPTS
  // ================================================================

  const [
    fetchMiscReceiptById,
    { isFetching: isFetchingMiscReceiptDetails }
  ] = useLazyFetchMiscReceiptByIdQuery();

  // ================================================================
  // FETCH MISC RECEIPTS WITH BATCH NUMBER LOOK UP
  // ================================================================
  //
  // const [
  //   fetchBatchNumber,
  //   {
  //     isFetching: isFetchingBatchNumber,
  //   },
  // ] = useLazyFetchReceivingQuery();

  // const handleBatchLookup = useCallback(
  //   async (batchNo) => {
  //     const normalizedBatchNo = batchNo.trim();

  //     if (!normalizedBatchNo) {
  //       throw new Error("Please enter a batch number.");
  //     }

  //     // Fetch the receiving record using the entered batch number.
  //     const response = await fetchBatchNumber({
  //       search: normalizedBatchNo,
  //       pagination: "none",
  //     }).unwrap();

  //     return response;
  //   },
  //   [fetchBatchNumber],
  // );

  // ================================================================
  // DERIVED TABLE DATA
  // ================================================================
  const tableData = useMemo(() => {
    return miscReceiptsData;
  });
  const tableIsFetching = isFetchingMiscReceipts;
  const tableIsError = isMiscReceiptsError;
  const tableError = miscReceiptsError;

  // ================================================================
  // MUTATIONS
  // ================================================================

  const [createMiscReceipt, { isLoading: isCreating }] =
    usePostMiscReceiptMutation();

  const [updateMiscReceipt, { isLoading: isUpdating }] =
    useUpdateMiscReceiptMutation();

  const [archiveMiscReceipt, { isLoading: isArchiving }] =
    useArchiveMiscReceiptMutation();

  const isMutationLoading = isCreating || isUpdating || isArchiving;

  // ================================================================
  // DIALOG STATE
  // ================================================================

  const [openCreate, setOpenCreate] = useState(false);

  const [mode, setMode] = useState("create");

  const { selectedRow, setSelectedRow, clearSelectedRow } = useSelectedRow();

  // ================================================================
  // STATUS
  // ================================================================

  const statusMeta = useMemo(() => {
    const meta = {
      active: {
        label: "Active",
        description:
          "Manage miscellaneous receipts and record additional items received beyond the expected delivery quantity.",
      },

      archived: {
        label: "Archived",
        description: "View and restore archived miscellaneous receipts.",
      },
    };

    return meta[status] ?? meta.active;
  }, [status]);

  // ================================================================
  // OPEN CREATE
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
  // EDIT RECEIPT
  // ================================================================

  const handleOpenEdit = useCallback(
    async (receipt) => {
      if (isMutationLoading || isFetchingMiscReceiptDetails) {
        return;
      }
      try {
        const response = await fetchMiscReceiptById(receipt.id).unwrap();

        const miscReceiptDetails = response?.data ?? response;
        setSelectedRow(miscReceiptDetails);
        setMode("edit");
        setOpenCreate(true);
      } catch(error) {
        const message =
          error?.data?.message
          ?? "Unable to retreive miscellaneous receipt details."

        toast.add({
          type: "error",
          title: "Unable to load miscellaneous receipt",
          description: message,
        });

        console.error("Failed to fetch miscellaneous receipt", error);
      }
    },
    [
      isMutationLoading,
      isFetchingMiscReceiptDetails,
      fetchMiscReceiptById,
      setSelectedRow,
    ],
  );

  // ================================================================
  // CONFIRM ACTION
  // ================================================================

  const handleOpenAction = useCallback(
    (item, actionType) => {
      if (isMutationLoading) return;
  
      setSelectedRow(item);
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
          const response = await updateMiscReceipt({
            id: selectedRow.id,
            ...userData,
          }).unwrap();

          toast.add({
            type: "success",
            title: "Miscellaneous receipt updated",
            description:
              response?.message ??
              "The miscellaneous receipt has been updated successfully.",
          });
        } else {
          const response = await createMiscReceipt(userData).unwrap();

          toast.add({
            type: "success",
            title: "Miscellaneous receipt created",
            description:
              response?.message ??
              "The miscellaneous receipt has been created successfully.",
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
          "An error occurred while processing the miscellaneous receipt.";

        toast.add({
          type: "error",
          title: "Unable to save miscellaneous receipt",
          description: message,
        });

        console.error("Failed to create/update miscellaneous receipt:", error);
      }
    },
    [
      isCreating,
      isUpdating,
      selectedRow,
      mode,
      updateMiscReceipt,
      createMiscReceipt,
      clearSelectedRow,
    ],
  );

  // ================================================================
  // ACTION MUTATION
  // ================================================================
  
  const handleConfirmAction = useCallback(async () => {
    if (!selectedRow || isArchiving) return;
  
    const isRestore = actionType === "restore";
    const actionLabel = isRestore ? "restored" : "archived";
  
    try {
      const response = await archiveMiscReceipt(selectedRow.id).unwrap();
  
      toast.add({
        type: "success",
        title: `Miscellaneous Receipt ${actionLabel}`,
        description:
          response?.message ??
          `The receipt has been ${actionLabel} successfully.`,
      });
  
      setOpenAction(false);
      clearSelectedRow();
    } catch (error) {
      const message =
        error?.data?.message ??
        error?.data?.errors?.[0]?.detail ??
        `An error occurred while ${isRestore ? "restoring" : "archiving"} the receipt.`;
  
      toast.add({
        type: "error",
        title: `Unable to ${isRestore ? "restore" : "archive"} receipt`,
        description: message,
      });
  
      console.error(`Failed to ${isRestore ? "restore" : "archive"} receipt:`, error);
    }
  }, [
    selectedRow,
    isArchiving,
    actionType,
    archiveMiscReceipt,
    clearSelectedRow,
  ]);

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
          Add Receipt
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
        <MiscReceiptTable
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
      <MiscReceiptDialog
        open={openCreate}
        onClose={handleCloseCreate}
        onConfirm={handleCreateOrUpdate}
        isLoading={isCreating || isUpdating}
        mode={mode}
        selectedRow={selectedRow}
        // onBatchLookup={handleBatchLookup}
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

export default MiscReceipt;
