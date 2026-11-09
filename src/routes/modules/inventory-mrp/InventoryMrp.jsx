import { useCallback, useEffect, useMemo, useState } from "react";
import { FileBarChart2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

import {
  useFetchInventoryMrpQuery,
  useExtractInventoryMrpMutation,
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
  // EXTRACT FETCH INVENTORY MRP
  // ================================================================

  const [extractInventoryMrp, { isLoading: isExtracting }] =
    useExtractInventoryMrpMutation();

  // ================================================================
  // DERIVED TABLE DATA
  // ================================================================
  const tableData = inventoryMrpData;
  // console.log("tableData:", tableData);
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

  const handleExtract = async () => {
    try {
      const blob = await extractInventoryMrp().unwrap();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "inventory-mrp.xlsx";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      toast.add({
        type: "success",
        title: "Export successful",
        description: "Inventory MRP has been exported.",
      });
    } catch (error) {
      console.error("Inventory MRP extraction error:", error);

      toast.add({
        type: "error",
        title: "Export failed",
        description: "Unable to export Inventory MRP.",
      });
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">
            View and monitor inventory levels, stock availability, and item
            quantities to keep track of current inventory status.
          </p>
        </div>

        <Button onClick={handleExtract} disabled={isExtracting}>
          {isExtracting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <FileBarChart2 className="mr-2 size-4" />
          )}
          {isExtracting ? "Exporting..." : "Export"}
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
