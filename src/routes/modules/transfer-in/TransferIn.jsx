import { useCallback, useEffect, useMemo, useState } from "react";

import { ArchiveRestore, Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import TransferInDialog from "./dialog/TransferInDialog";
import ActionConfirm from "../../../components/ActionConfirm";
import { toast } from "@/components/ui/toast";

import { useSelectedRow } from "../../../context/SelectedRowProvider";

import {
  useFetchTransferItemsQuery,
  useLazyFetchTransferItemByIdQuery,
  useAcceptTranferItemMutation,
  useRejectTranferItemMutation,
} from "../../../api/modules/transfers.api";

import TransferInTable from "./TransferInTable";

const TransferIn = () => {
  // ================================================================
  // TABLE STATE
  // ================================================================

  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [actionType, setActionType] = useState("accept");
  const [openAction, setOpenAction] = useState(false);

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
  // FETCH TRANSFER ITEMS
  // ================================================================

  const {
    data: transferItemsData,
    isFetching: isFetchingtransferItems,
    isError: istransferItemsError,
    error: transferItemsError,
  } = useFetchTransferItemsQuery(
    {
      status: status,
      direction: "incoming",
      page,
      per_page: pageSize,
      search: debouncedSearch || undefined,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  // ================================================================
  // FETCH ITEM BY ID
  // ================================================================

  const [fetchTransferItemById, { isFetching: isFetchingTransferItemDetails }] =
    useLazyFetchTransferItemByIdQuery();

  // ================================================================
  // DERIVED TABLE DATA
  // ================================================================
  const tableData = useMemo(() => {
    return transferItemsData;
  });
  const tableIsFetching = isFetchingtransferItems;
  const tableIsError = istransferItemsError;
  const tableError = transferItemsError;

  // ================================================================
  // MUTATIONS
  // ================================================================

  const [acceptTransferItem, { isLoading: isAccepting }] =
    useAcceptTranferItemMutation();

  const [rejectTransferItem, { isLoading: isRejecting }] =
    useRejectTranferItemMutation();

  const isMutationLoading = isAccepting || isRejecting;

  // ================================================================
  // DIALOG STATE
  // ================================================================
  const { selectedRow, setSelectedRow, clearSelectedRow } = useSelectedRow();
  const [openView, setOpenView] = useState(false);

  // ================================================================
  // STATUS
  // ================================================================

  const statusMeta = useMemo(() => {
    const meta = {
      pending: {
        label: "Pending",
        description: "Manage pending transferred items.",
      },
      received: {
        label: "Active",
        description: "View received items.",
      },
      rejected: {
        label: "Rejected",
        description: "View rejected items.",
      },
    };

    return meta[status] ?? meta.pending;
  }, [status]);

  // ================================================================
  // VIEW ITEM
  // ================================================================

  const handleOpenView = useCallback(
    async (item) => {
      if (isFetchingTransferItemDetails || isMutationLoading) {
        return;
      }

      try {
        const response = await fetchTransferItemById(item.id).unwrap();

        const itemDetails = response?.data ?? response;

        setSelectedRow(itemDetails);
        setOpenView(true);
      } catch (error) {
        const message =
          error?.data?.message ??
          "Unable to retrieve the user account details.";

        toast.add({
          type: "error",
          title: "Unable to load item",
          description: message,
        });

        console.error("Failed to fetch item:", error);
      }
    },
    [
      setSelectedRow,
      fetchTransferItemById,
      isFetchingTransferItemDetails,
      isMutationLoading,
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
    if (isMutationLoading) return;

    setOpenAction(false);
  }, [isMutationLoading]);

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

  const handleCloseView = useCallback(() => {
    if (isMutationLoading || isFetchingTransferItemDetails) return;

    setOpenView(false);
    clearSelectedRow();
  }, [isMutationLoading, isFetchingTransferItemDetails, clearSelectedRow]);

  // ================================================================
  // ACTION MUTATION
  // ================================================================

  const handleConfirmAction = useCallback(
    async (reason) => {
      if (!selectedRow || isMutationLoading) return;

      try {
        let response;

        if (actionType === "accept") {
          response = await acceptTransferItem(selectedRow.id).unwrap();
        } else if (actionType === "reject") {
          if (!reason?.trim()) return;

          response = await rejectTransferItem({
            id: selectedRow.id,
            reason: reason.trim(),
          }).unwrap();
        } else {
          return;
        }

        const label = actionType === "accept" ? "accepted" : "rejected";

        toast.add({
          type: "success",
          title: `Transfer ${label}`,
          description:
            response?.message ?? `The transfer has been ${label} successfully.`,
        });

        setOpenAction(false);
        setOpenView(false);
        clearSelectedRow();
      } catch (error) {
        const message =
          error?.data?.message ??
          error?.data?.errors?.[0]?.detail ??
          "An error occurred while processing the transfer.";

        toast.add({
          type: "error",
          title: `Unable to ${actionType} transfer`,
          description: message,
        });

        console.error(`Failed to ${actionType} transfer:`, error);
      }
    },
    [
      selectedRow,
      isMutationLoading,
      actionType,
      acceptTransferItem,
      rejectTransferItem,
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
        <TransferInTable
          data={tableData}
          isFetching={tableIsFetching}
          isError={tableIsError}
          error={tableError}
          status={status}
          onStatusChange={handleStatusChange}
          onView={handleOpenView}
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
          VIEW / PENDING DIALOG
      ============================================================ */}
      <TransferInDialog
        open={openView}
        onClose={handleCloseView}
        selectedRow={selectedRow}
        onAction={handleOpenAction}
        isLoading={isMutationLoading}
      />

      {/* ============================================================
          RESTORE CONFIRMATION
      ============================================================ */}
      <ActionConfirm
        open={openAction}
        onClose={handleCloseAction}
        onConfirm={handleConfirmAction}
        isLoading={isMutationLoading}
        actionType={actionType}
        requireReason={actionType === "reject"}
        reasonLabel="Rejection Reason"
        reasonPlaceholder="Enter the reason for rejecting this transfer..."
      />
    </div>
  );
};

export default TransferIn;
