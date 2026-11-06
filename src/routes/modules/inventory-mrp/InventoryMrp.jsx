import { useCallback, useEffect, useMemo, useState } from "react";
import { FileBarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

import {
  useFetchInventoryMrpQuery,
  useLazyFetchInventoryMrpByIdQuery,
} from "../../../api/modules/inventory-mrp.api";

import InventoryMrpTable from "./InventoryMrpTable";

const InventoryMrp = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

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
  // FETCH INVENTORY MRP
  // ================================================================

  const {
    data: inventoryMrpData,
    isFetching: isFetchingInventoryMrp,
    isError: isInventoryMrpError,
    error: inventoryMrpError,
  } = useFetchInventoryMrpQuery(
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
    return inventoryMrpData;
  });
  const tableIsFetching = isFetchingInventoryMrp;
  const tableIsError = isInventoryMrpError;
  const tableError = inventoryMrpError;

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

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">
            View and monitor inventory levels, stock availability, and item
            quantities to keep track of current inventory status.
          </p>
        </div>

        <Button
          type="button"
          // onClick={}
          // disabled={}
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
          <FileBarChart2 className="size-5"/>
          Extract Inventory
        </Button>
      </div>

      {/* ============================================================
          TABLE
      ============================================================ */}
      <div className="min-h-0 flex-1">
        <InventoryMrpTable
          data={tableData}
          isFetching={tableIsFetching}
          isError={tableIsError}
          error={tableError}
          page={page}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          search={search}
          onSearchChange={handleSearchChange}
        />
      </div>
    </div>
  );
};

export default InventoryMrp;
