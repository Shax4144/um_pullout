import { useCallback, useEffect, useMemo, useState } from "react";

import { CloudSync, CloudCheck, CloudAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

import Confirm from "../../../components/Confirm";
import { toast } from "@/components/ui/toast";

import { useSelectedRow } from "../../../context/SelectedRowProvider";

import {
  useFetchAccountTitlesQuery,
  useLazyFetchAccountTitlesQuery,
  useSyncAccountTitlesMutation,
} from "../../../api/masterlist/account-titles.api";

import AccountTitleTable from "./AccountTitleTable";

const AccountTitle = () => {
  // ================================================================
  // TABLE STATE
  // ================================================================

  const [status, setStatus] = useState("active");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [openConfirmSync, setOpenConfirmSync] = useState(false);

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
    data: accountTitlesData,
    isFetching: isFetchingAccountTitles,
    isError: isAccountTitlesError,
    error: accountTitlesError,
  } = useFetchAccountTitlesQuery(
    {
      status: 1,
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
    return accountTitlesData ??  {};
  });
  const tableIsFetching = isFetchingAccountTitles;
  const tableIsError = isAccountTitlesError;
  const tableError = accountTitlesError;

  // ================================================================
  // MUTATIONS
  // ================================================================

  const [syncAccountTitle, { isLoading: isSyncing }] =
    useSyncAccountTitlesMutation();

  const isMutationLoading = isSyncing;

  // ================================================================
  // STATUS
  // ================================================================

  const statusMeta = useMemo(() => {
    const meta = {
      active: {
        label: "Active",
        description: "Manage the syncing of account titles.",
      },

      archived: {
        label: "Archived",
        description: "View and restore archived account titles.",
      },
    };

    return meta[status] ?? meta.active;
  }, [status]);

  // ================================================================
  // SYNC ACCOUNT TITLES
  // ================================================================

  const handleSync = useCallback(() => {
    if (isMutationLoading) {
      return;
    }

    setOpenConfirmSync(true);
  }, [isMutationLoading]);

  // Close confirmation Dialog
  const handleCloseSync = useCallback(() => {
    if (isMutationLoading) {
      return
    }

    setOpenConfirmSync(false);
  }, [isMutationLoading]);

  const handleConfirmSync = useCallback(async () => {
    if (isMutationLoading) {
      return;
    }

    try {
      const response = await syncAccountTitle().unwrap();

      toast.add({
        type: "success",
        title: "Account titles synced",
        description:
          response?.message ??
          "Account titles hahve been synchronized successfully."
      })

      setOpenConfirmSync(false);
    } catch (error) {
      const message =
        error?.data?.message ??
        error?.data?.errors?.[0]?.detail ??
        "An error occured while synchronizing account titles. Please try again later."

      toast.add({
        type: "error",
        title: "Unable to sync account titles",
        description: message,
      });

      console.error("Failed to sync account titles:", error);
    }
  }, [isMutationLoading, syncAccountTitle]);

  // ================================================================
  // STATUS CHANGE
  // ================================================================

  // const handleStatusChange = useCallback(
  //   (nextStatus) => {
  //     if (nextStatus === status) {
  //       return;
  //     }

  //     setStatus(nextStatus);
  //     setPage(1);
  //   },
  //   [status],
  // );

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
          onClick={handleSync}
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
          <CloudSync className="size-5" />
          {isSyncing ? "Syncing..." : "Sync Account Titles" }
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
        <AccountTitleTable
          data={tableData}
          isFetching={tableIsFetching}
          isError={tableIsError}
          error={tableError}
          status={status}
          // onStatusChange={handleStatusChange}
          page={page}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          search={search}
          onSearchChange={handleSearchChange}
        />
      </div>

      {/* ============================================================
          RESTORE CONFIRMATION
      ============================================================ */}
      <Confirm
        open={openConfirmSync}
        onClose={handleCloseSync}
        onConfirm={handleConfirmSync}
        isLoading={isSyncing}
      />
    </div>
  );
};

export default AccountTitle;
