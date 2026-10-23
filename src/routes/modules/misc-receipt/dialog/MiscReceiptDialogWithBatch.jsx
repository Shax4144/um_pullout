import { useEffect, useState } from "react";
import { Package, Save, Search, X, Loader2 } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

import Datepicker from "../../../../components/Datepicker";

import AccountTitlesDropdown from "@/components/dropdowns/AccountTitlesDropdown";

const normalizeDate = (value) => {
  if (!value) return new Date();

  const date = value instanceof Date ? value : parseISO(value);

  return isValid(date) ? date : new Date();
};

const createEmptyForm = () => ({
  transaction_date: new Date(),
  supplier: "",
  remarks: "",
  items: [],
});

const getBatchResponse = (response) => {
  const result = response?.data ?? response;
  const record = Array.isArray(result) ? result[0] : result;

  if (!record) return null;

  // Supports either a receipt-shaped response or a stock-shaped response.
  const stock = record.stock ?? record;

  return {
    stock,
    transaction_date: record.transaction_date ?? null,
    supplier: stock.supplier_name ?? "",
    remarks: stock.remarks ?? "",
    inventories: stock.inventories ?? record.inventories ?? [],
    batch_no: stock.batch_no ?? record.batch_no ?? "",
  };
};

const mapInventory = (inventory) => ({
  id: inventory.id,
  inventory_id: inventory.id,

  item_code: inventory.item?.code ?? "",
  item_name: inventory.item?.name ?? "",

  uom_id: inventory.uom?.id ?? null,
  uom: inventory.uom?.symbol ?? "",

  quantity: "",

  account_title_id: "",
});

const MiscReceiptDialogWithBatch = ({
  open,
  onClose,
  onConfirm,
  isLoading = false,
  selectedRow,
  onBatchLookup,
}) => {
  const isEditMode = Boolean(selectedRow?.stock?.id ?? selectedRow?.id);

  const [formData, setFormData] = useState(createEmptyForm);
  const [batchNo, setBatchNo] = useState("");
  const [batchDetails, setBatchDetails] = useState(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState("");

  const isBusy = isLoading || isLookingUp;

  // Reset or prefill the dialog when it opens.
  useEffect(() => {
    if (!open) return;

    setLookupError("");

    if (selectedRow) {
      const record = getBatchResponse(selectedRow);

      setBatchNo(record?.batch_no ?? "");

      setBatchDetails(record);

      setFormData({
        transaction_date: normalizeDate(record?.transaction_date),
        supplier: record?.supplier ?? "",
        remarks: record?.remarks ?? "",
        items: (record?.inventories ?? []).map(mapInventory),
      });
    } else {
      setBatchNo("");
      setBatchDetails(null);
      setFormData(createEmptyForm());
    }
  }, [open, selectedRow]);

  const handleDetailChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleBatchLookup = async (event) => {
    event?.preventDefault();

    const requestedBatchNo = batchNo.trim();

    if (!requestedBatchNo || isBusy || isEditMode) return;

    if (typeof onBatchLookup !== "function") {
      setLookupError(
        "Batch lookup is not connected. Pass your batch API through onBatchLookup.",
      );
      return;
    }

    setIsLookingUp(true);
    setLookupError("");
    setBatchDetails(null);

    setFormData((current) => ({
      ...current,
      transaction_date: null,
      supplier: "",
      remarks: "",
      items: [],
    }));

    try {
      const response = await onBatchLookup(requestedBatchNo);
      const record = getBatchResponse(response);

      if (!record?.batch_no || !record?.stock?.id) {
        throw new Error("No valid receiving batch was found.");
      }

      if (record.batch_no.toLowerCase() !== requestedBatchNo.toLowerCase()) {
        throw new Error("The returned batch number does not match.");
      }

      const inventories = record.inventories;

      setBatchNo(record.batch_no);
      setBatchDetails(record);

      setFormData({
        transaction_date: normalizeDate(record.transaction_date),
        supplier: record.supplier,
        remarks: "",
        items: inventories.map(mapInventory),
      });

      if (inventories.length === 0) {
        setLookupError("This batch has no inventory items.");
      }
    } catch (error) {
      setBatchDetails(null);

      setFormData((current) => ({
        ...current,
        transaction_date: null,
        supplier: "",
        remarks: "",
        items: [],
      }));

      setLookupError(
        error?.data?.message ??
          error?.message ??
          "Unable to retrieve batch details. Please try again.",
      );
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleClearBatch = () => {
    setBatchNo("");
    setBatchDetails(null);
    setLookupError("");
    setFormData(createEmptyForm());
  };

  const handleAccountTitleChange = (index, accountTitleId) => {
    setFormData((current) => ({
      ...current,
      items: current.items.map((item, i) =>
        i === index ? { ...item, account_title_id: accountTitleId } : item,
      ),
    }));
  };

  const handleQuantityChange = (index, value) => {
    // Allow only nonnegative whole numbers or decimals.
    if (value !== "" && !/^\d*\.?\d*$/.test(value)) return;

    setFormData((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, quantity: value } : item,
      ),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!batchDetails?.stock?.id) {
      setLookupError("Please search for a valid batch number first.");
      return;
    }

    const payload = {
      stock_id: Number(batchDetails.stock.id),

      transaction_date: format(formData.transaction_date, "yyyy-MM-dd"),

      remarks: formData.remarks.trim(),

      miscellaneous_receipt_inventory: formData.items.map((item) => ({
        inventory_id: Number(item.inventory_id ?? item.id),
        quantity: Number(item.quantity),
        account_title_id: Number(item.account_title_id),
      })),
    };

    await onConfirm(payload);
  };

  const canSubmit =
    !isBusy &&
    !isEditMode &&
    Boolean(batchDetails?.stock?.id) &&
    formData.transaction_date instanceof Date &&
    isValid(formData.transaction_date) &&
    formData.items.length > 0 &&
    formData.items.every(
      (item) =>
        Number.isInteger(Number(item.inventory_id)) &&
        Number(item.inventory_id) > 0 &&
        Number.isInteger(Number(item.uom_id)) &&
        Number(item.uom_id) > 0 &&
        Number.isInteger(Number(item.account_title_id)) &&
        Number(item.account_title_id) > 0 &&
        item.quantity !== "" &&
        Number.isFinite(Number(item.quantity)) &&
        Number(item.quantity) >= 0,
    );

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isBusy) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Package className="size-5" />
            </div>

            <div>
              <DialogTitle>
                {isEditMode ? "View Receipt" : "Miscellaneous Receipt"}
              </DialogTitle>

              <DialogDescription>
                Retrieve a batch to populate the receipt details and items.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <form
          id="receiving-form"
          onSubmit={handleSubmit}
          className="grid gap-6 py-2"
        >
          <section className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-12 sm:items-center">
              <div className="sm:col-span-7">
                <h3 className="text-sm font-semibold">Receipt Details</h3>
                <p className="text-sm text-muted-foreground">
                  Search for a batch to retrieve its details.
                </p>
              </div>

              <div className="sm:col-span-5">
                <Label htmlFor="batch_no" className="sr-only">
                  Batch Number
                </Label>

                <div className="relative flex flex-col items-center gap-1">
                  <div className="relative flex w-full items-center">
                    <Input
                      id="batch_no"
                      value={batchNo}
                      onChange={(event) => setBatchNo(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleBatchLookup();
                        }
                      }}
                      placeholder="Enter batch number"
                      className="h-9 pl-3 pr-20 shadow-sm"
                      disabled={isBusy || isEditMode}
                    />

                    {batchNo && !isEditMode && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleClearBatch}
                        aria-label="Clear batch number"
                        title="Clear batch number"
                        className="absolute right-10 top-1/2 h-7 w-7 -translate-y-1/2"
                        disabled={isBusy}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleBatchLookup()}
                      disabled={!batchNo.trim() || isBusy || isEditMode}
                      aria-label="Search batch"
                      title="Search batch"
                      className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                    >
                      {isLookingUp ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-start">
                    {lookupError && (
                      <p role="alert" className="text-sm text-destructive">
                        {lookupError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Transaction Date</Label>
                <Datepicker
                  variant="outline"
                  value={formData.transaction_date}
                  onChange={(date) =>
                    date &&
                    setFormData((current) => ({
                      ...current,
                      transaction_date: date,
                    }))
                  }
                  placeholder="Transaction date"
                  disabled
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  placeholder="Automatically populated from batch"
                  disabled
                />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="remarks">Remarks</Label>
                <span className="text-xs text-muted-foreground">
                  {formData.remarks.length}/250
                </span>
              </div>

              <Textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleDetailChange}
                placeholder="Enter additional remarks (optional)"
                maxLength={250}
                rows={3}
                disabled={isBusy || isEditMode || !batchDetails}
              />
            </div>
          </section>

          <Separator />

          <section className="grid gap-4">
            <div>
              <h3 className="text-sm font-semibold">Items</h3>
              <p className="text-sm text-muted-foreground">
                Item details are populated from the selected batch.
              </p>
            </div>

            <div className="w-full overflow-x-auto rounded-md shadow-lg">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="min-w-32">Item Code</TableHead>
                    <TableHead className="min-w-40">Item Name</TableHead>
                    <TableHead className="min-w-24">UOM</TableHead>
                    <TableHead className="min-w-40">Account Title</TableHead>
                    <TableHead className="min-w-36">Quantity</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLookingUp ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-muted-foreground"
                      >
                        <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                        Loading batch items...
                      </TableCell>
                    </TableRow>
                  ) : formData.items.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-muted-foreground"
                      >
                        {batchDetails
                          ? "No items found in this batch."
                          : "Search for a batch number to load its items."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    formData.items.map((item, index) => (
                      <TableRow key={item.id || `${item.item_id}-${index}`}>
                        <TableCell>{item.item_code || "—"}</TableCell>

                        <TableCell>
                          <span className="block max-w-48 truncate">
                            {item.item_name || "—"}
                          </span>
                        </TableCell>

                        <TableCell>{item.uom || "—"}</TableCell>

                        <TableCell>
                          <AccountTitlesDropdown
                            value={item.account_title_id}
                            onChange={(accountTitleId) =>
                              handleAccountTitleChange(index, accountTitleId)
                            }
                            open={open}
                            isLoading={isLoading}
                            disabled={isLoading || isEditMode}
                          />
                        </TableCell>

                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="any"
                            value={item.quantity}
                            onChange={(event) =>
                              handleQuantityChange(index, event.target.value)
                            }
                            placeholder="0"
                            disabled={isBusy || isEditMode}
                            className="min-w-28 hide-arrow"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </section>
        </form>

        <Separator />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isBusy}
          >
            {isEditMode ? "Close" : "Cancel"}
          </Button>

          {!isEditMode && (
            <Button type="submit" form="receiving-form" disabled={!canSubmit}>
              <Save className="mr-2 size-4" />
              {isLoading ? "Saving..." : "Receipt"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MiscReceiptDialogWithBatch;
