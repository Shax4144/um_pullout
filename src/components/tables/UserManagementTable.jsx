import {
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  SearchX,
  X,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

// ------------------------------------------------------------------
// TanStack Table v9
//
// This table currently uses:
// - Core table functionality
// - Server-side search
// - Server-side pagination
//
// No client-side filtering/sorting/pagination is registered because
// your backend is already responsible for those operations.
// ------------------------------------------------------------------

const features = tableFeatures({});

const UserManagementTable = ({
  columns,
  data,
  paginationData,
  searchKey,
  searchValue,
  onSearchChange,
  filterSlot,
  isFetching,
  isError,
  error,
  page,
  onPageChange,
  pageSize,
  onPageSizeChange,
}) => {
  // ----------------------------------------------------------------
  // TABLE
  // ----------------------------------------------------------------

  const table = useTable({
    features,
    columns,
    data,
  });

  // ----------------------------------------------------------------
  // PAGINATION
  // ----------------------------------------------------------------

  const currentPage =
    paginationData?.current_page ??
    paginationData?.currentPage ??
    page ??
    1;

  const lastPage =
    paginationData?.last_page ??
    paginationData?.lastPage ??
    1;

  const from = paginationData?.from ?? 0;
  const to = paginationData?.to ?? 0;
  const totalRows = paginationData?.total ?? 0;

  const hasPreviousPage =
    currentPage > 1 &&
    Boolean(paginationData?.prev_page_url);

  const hasNextPage =
    currentPage < lastPage &&
    Boolean(paginationData?.next_page_url);

  // ----------------------------------------------------------------
  // PAGE NUMBERS
  // ----------------------------------------------------------------

  const pageNumbers = useMemo(() => {
    const delta = 1;
    const pages = [];

    for (let i = 1; i <= lastPage; i++) {
      const isFirst = i === 1;
      const isLast = i === lastPage;

      const isNearCurrent =
        i >= currentPage - delta &&
        i <= currentPage + delta;

      if (
        isFirst ||
        isLast ||
        isNearCurrent
      ) {
        pages.push(i);
      }
    }

    const result = [];

    for (let i = 0; i < pages.length; i++) {
      const current = pages[i];
      const previous = pages[i - 1];

      if (
        previous &&
        current - previous > 1
      ) {
        result.push("ellipsis");
      }

      result.push(current);
    }

    return result;
  }, [currentPage, lastPage]);

  // ----------------------------------------------------------------
  // ERROR
  // ----------------------------------------------------------------

  const apiError = error?.data?.errors?.[0];

  const status = error?.status;

  const errorMessages = {
    400: "Invalid request.",
    401: "Unauthorized.",
    403: "You don't have permission to view this data.",
    404: "No records found.",
    500: "Something went wrong. Please try again later.",
  };

  const errorMessage =
    apiError?.detail ||
    errorMessages[status] ||
    "Failed to load data.";

  // ----------------------------------------------------------------
  // TABLE STATE
  // ----------------------------------------------------------------

  const rows = table.getRowModel().rows;

  const hasRows = rows.length > 0;

  const hasExistingData =
    Array.isArray(data) &&
    data.length > 0;

  const visibleColumnCount =
    // table.getVisibleLeafColumns().length ||
    columns.length;

  // ----------------------------------------------------------------
  // SEARCH
  // ----------------------------------------------------------------

  const handleClearSearch = () => {
    onSearchChange?.("");
  };

  // ----------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------

  return (
    <div
      className="
        flex
        max-h-[calc(100vh-250px)]
        min-h-0
        flex-col
        overflow-hidden
        rounded-xl
        border
        bg-background
        shadow-sm
      "
    >
      {/* ============================================================
          TOOLBAR
      ============================================================ */}

      <div
        className="
          flex
          flex-col
          gap-3
          border-b
          bg-background
          px-4
          py-3
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        {/* Filter */}
        {filterSlot && (
          <div className="flex min-w-0 shrink-0 items-center">
            {filterSlot}
          </div>
        )}

        {/* Search */}
        {searchKey && (
          <div
            className="
              relative
              w-full
              sm:ml-auto
              sm:max-w-sm
            "
          >
            <Search
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-muted-foreground
              "
            />

            <Input
              placeholder={`Search ${searchKey}...`}
              value={searchValue ?? ""}
              onChange={(event) =>
                onSearchChange?.(
                  event.target.value,
                )
              }
              aria-label={`Search ${searchKey}`}
              className="
                h-9
                w-full
                pl-9
                pr-9
                shadow-sm
              "
            />

            {searchValue && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClearSearch}
                aria-label="Clear search"
                className="
                  absolute
                  right-1
                  top-1/2
                  h-7
                  w-7
                  -translate-y-1/2
                  cursor-pointer
                  rounded-md
                  text-muted-foreground
                  hover:text-foreground
                "
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* ============================================================
          TABLE
      ============================================================ */}

      <div className="min-h-0 flex-1 overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(
              (headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="
                    border-b
                    hover:bg-transparent
                  "
                >
                  {headerGroup.headers.map(
                    (header) => (
                      <TableHead
                        key={header.id}
                        className="
                          sticky
                          top-0
                          z-10
                          whitespace-nowrap
                          border-b
                          bg-muted/95
                          px-4
                          py-2.5
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-white
                          backdrop-blur
                        "
                      >
                        {header.isPlaceholder ? null : (
                          <table.FlexRender
                            header={header}
                          />
                        )}
                      </TableHead>
                    ),
                  )}
                </TableRow>
              ),
            )}
          </TableHeader>

          <TableBody>
            {/* ======================================================
                ERROR
            ====================================================== */}

            {isError ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumnCount}
                  className="h-60 px-4"
                >
                  <div
                    className="
                      flex
                      flex-col
                      items-center
                      justify-center
                      gap-3
                      text-center
                    "
                  >
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-destructive/10
                        text-destructive
                      "
                    >
                      <AlertCircle className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Unable to load records
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : !hasExistingData && isFetching ? (
              /* ====================================================
                 INITIAL LOADING
              ==================================================== */

              Array.from({ length: 7 }).map(
                (_, rowIndex) => (
                  <TableRow
                    key={`skeleton-${rowIndex}`}
                  >
                    {columns.map(
                      (_, columnIndex) => (
                        <TableCell
                          key={`skeleton-${rowIndex}-${columnIndex}`}
                          className="px-4 py-3"
                        >
                          <Skeleton
                            className="
                              h-4
                              w-full
                              max-w-[180px]
                            "
                          />
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                ),
              )
            ) : hasRows ? (
              /* ====================================================
                 DATA
              ==================================================== */

              rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="
                    border-b
                    transition-colors
                    hover:bg-muted/50
                    data-[state=selected]:bg-muted
                    last:border-0
                  "
                >
                  {row.getVisibleCells().map(
                    (cell) => (
                      <TableCell
                        key={cell.id}
                        className="
                          whitespace-nowrap
                          px-4
                          py-3
                          align-middle
                        "
                      >
                        <table.FlexRender
                          cell={cell}
                        />
                      </TableCell>
                    ),
                  )}
                </TableRow>
              ))
            ) : (
              /* ====================================================
                 EMPTY
              ==================================================== */

              <TableRow>
                <TableCell
                  colSpan={visibleColumnCount}
                  className="h-60 px-4"
                >
                  <div
                    className="
                      flex
                      flex-col
                      items-center
                      justify-center
                      gap-3
                      text-center
                    "
                  >
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-muted
                        text-muted-foreground
                      "
                    >
                      {searchValue ? (
                        <SearchX className="h-5 w-5" />
                      ) : (
                        <Search className="h-5 w-5" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {searchValue
                          ? "No matching records"
                          : "No records found"}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {searchValue
                          ? "Try adjusting your search or filters."
                          : "There are currently no records to display."}
                      </p>
                    </div>

                    {searchValue && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleClearSearch}
                        className="
                          mt-1
                          cursor-pointer
                        "
                      >
                        Clear search
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* ==========================================================
            FETCHING INDICATOR

            Existing rows stay visible while a new server request
            is loading.
        ========================================================== */}

        {isFetching &&
          hasExistingData &&
          !isError && (
            <div
              className="
                pointer-events-none
                sticky
                bottom-0
                flex
                items-center
                justify-center
                gap-2
                border-t
                bg-background/90
                px-4
                py-2
                text-xs
                text-muted-foreground
                backdrop-blur
              "
              aria-live="polite"
            >
              <Loader2
                className="
                  h-3.5
                  w-3.5
                  animate-spin
                "
              />

              Updating results...
            </div>
          )}
      </div>

      {/* ============================================================
          PAGINATION
      ============================================================ */}

      <div
        className="
          flex
          flex-col
          gap-3
          border-t
          bg-background
          px-4
          py-3
          text-sm
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        {/* ----------------------------------------------------------
            ROW COUNT
        ---------------------------------------------------------- */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-3
            sm:justify-start
          "
        >
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              Show
            </span>

            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                const newSize = Number(value);

                onPageSizeChange(newSize);
                onPageChange(1);
              }}
            >
              <SelectTrigger
                className="h-8 w-[68px]"
                aria-label="Rows per page"
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent
                position="popper"
                className="w-[68px] min-w-0"
              >
                {[10, 20, 50].map(
                  (size) => (
                    <SelectItem
                      key={size}
                      value={String(size)}
                    >
                      {size}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>

            <span
              className="
                hidden
                text-muted-foreground
                sm:inline
              "
            >
              rows
            </span>
          </div>

          <span className="text-muted-foreground">
            <span className="font-medium text-foreground">
              {from}–{to}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {totalRows}
            </span>
          </span>
        </div>

        {/* ----------------------------------------------------------
            DESKTOP PAGINATION
        ---------------------------------------------------------- */}

        <div
          className="
            hidden
            items-center
            gap-1
            md:flex
          "
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              onPageChange(
                currentPage - 1,
              )
            }
            disabled={
              !hasPreviousPage ||
              isFetching
            }
            aria-label="Previous page"
            className="
              cursor-pointer
              gap-1
              text-muted-foreground
              hover:text-foreground
            "
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {pageNumbers.map(
              (item, index) => {
                if (
                  item ===
                  "ellipsis"
                ) {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        text-muted-foreground
                      "
                    >
                      …
                    </span>
                  );
                }

                const isActive =
                  currentPage === item;

                return (
                  <Button
                    key={item}
                    type="button"
                    variant={
                      isActive
                        ? "outline"
                        : "ghost"
                    }
                    size="sm"
                    onClick={() =>
                      onPageChange(item)
                    }
                    disabled={
                      isFetching ||
                      isActive
                    }
                    aria-label={`Go to page ${item}`}
                    aria-current={
                      isActive
                        ? "page"
                        : undefined
                    }
                    className="
                      h-8
                      w-8
                      cursor-pointer
                      p-0
                      tabular-nums
                    "
                  >
                    {item}
                  </Button>
                );
              },
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              onPageChange(
                currentPage + 1,
              )
            }
            disabled={
              !hasNextPage ||
              isFetching
            }
            aria-label="Next page"
            className="
              cursor-pointer
              gap-1
              text-muted-foreground
              hover:text-foreground
            "
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* ----------------------------------------------------------
            MOBILE PAGINATION
        ---------------------------------------------------------- */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-2
            md:hidden
          "
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onPageChange(
                currentPage - 1,
              )
            }
            disabled={
              !hasPreviousPage ||
              isFetching
            }
            aria-label="Previous page"
            className="
              cursor-pointer
              gap-1
            "
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <span
            className="
              text-xs
              text-muted-foreground
            "
          >
            Page{" "}
            <span className="font-medium text-foreground">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {lastPage}
            </span>
          </span>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onPageChange(
                currentPage + 1,
              )
            }
            disabled={
              !hasNextPage ||
              isFetching
            }
            aria-label="Next page"
            className="
              cursor-pointer
              gap-1
            "
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserManagementTable;