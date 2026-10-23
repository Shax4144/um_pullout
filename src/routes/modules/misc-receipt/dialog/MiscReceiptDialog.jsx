import { useEffect, useState } from "react";
import {
  Package,
  Save,
  Plus,
  Trash2,
  ChevronsUpDown,
  Check,
  Loader2,
} from "lucide-react";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import Datepicker from "../../../../components/Datepicker";
import AccountTitlesDropdown from "@/components/dropdowns/AccountTitlesDropdown";

import { useLazyFetchItemsQuery } from "../../../../api/masterlist/items.api";

const createEmptyItem = () => ({
  item_id: "",
  item_code: "",
  item_name: "",
  uom: "",
  uom_id: "",
  account_title_id: "",
  quantity: "",
});

const createEmptyForm = () => ({
  transaction_date: new Date(),
  description: "",
  remarks: "",
  items: [createEmptyItem()],
});

const normalizeDate = (date) => {
  if (!date) return new Date();

  const parsed = date instanceof Date ? date : parseISO(date);

  return isValid(parsed) ? parsed : new Date();
};

const DESCRIPTION_TYPE = [
  { label: "Adjustment", value: "adjustment" },
  { label: "Ending Balance", value: "ending-balance" },
];

const MiscReceiptDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading,
  selectedRow,
}) => {
  const isEditMode = Boolean(selectedRow?.id);

  const [formData, setFormData] = useState(createEmptyForm);
  const [activeItemIndex, setActiveItemIndex] = useState(null);

  // =======================================
  // ITEM MASTERLIST - LAZY FETCH
  // =======================================
  const [
    fetchItems,
    { data: itemsData, isFetching: isFetchingItems, isError: isItemsError },
  ] = useLazyFetchItemsQuery();

  useEffect(() => {
    if (!open) return;

    fetchItems({
      status: 1,
      page: 0,
    });
  }, [open, fetchItems]);

  const masterItems = itemsData?.data ?? [];

  // =======================================
  // PREFILL / RESET FORM
  // =======================================
  useEffect(() => {
    if (!open) return;

    if (selectedRow) {
      setFormData({
        transaction_date: normalizeDate(selectedRow.transaction_date),
        description:
          DESCRIPTION_TYPE.find(
            (type) =>
              type.value === selectedRow.description ||
              type.label.toLowerCase() ===
                selectedRow.description?.toLowerCase(),
          )?.value ?? "",
        remarks: selectedRow.remarks ?? "",

        items: (
          selectedRow.miscellaneous_inventory ??
          selectedRow.inventories ??
          selectedRow.inventory ??
          selectedRow.items ??
          []
        ).map((inventory) => ({
          item_id: String(
            inventory.item?.id ?? inventory.item_id ?? inventory.id ?? "",
          ),

          item_code:
            inventory.item?.code ?? inventory.item_code ?? inventory.code ?? "",

          item_name:
            inventory.item?.name ?? inventory.item_name ?? inventory.name ?? "",

          uom:
            inventory.uom?.symbol ?? inventory.uom?.name ?? inventory.uom ?? "",

          uom_id: String(inventory.uom?.id ?? inventory.uom_id ?? ""),

          account_title_id: String(
            inventory.account_title?.id ?? inventory.account_title_id ?? "",
          ),

          quantity: String(inventory.quantity ?? ""),
        })),
      });
    } else {
      setFormData(createEmptyForm());
    }

    setActiveItemIndex(null);
  }, [open, selectedRow]);

  // =======================================
  // FORM HANDLERS
  // =======================================
  const handleDetailChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const addItem = () => {
    setFormData((current) => ({
      ...current,
      items: [...current.items, createEmptyItem()],
    }));
  };

  const removeItem = (index) => {
    setFormData((current) => ({
      ...current,
      items: current.items.filter((_, i) => i !== index),
    }));
  };

  const selectItem = (index, item) => {
    setFormData((current) => {
      const nextItems = [...current.items];

      nextItems[index] = {
        ...nextItems[index],
        item_id: item.id ?? item._id ?? item.item_id ?? "",
        item_code: item.code ?? item.item_code ?? "",
        item_name: item.name ?? item.item_name ?? "",
        uom: item.uom?.name ?? item.uom ?? "",
        uom_id: item.uom_id ?? item.uom?.id ?? item.uom?.uom_id ?? "",
      };

      return {
        ...current,
        items: nextItems,
      };
    });

    setActiveItemIndex(null);
  };

  const handleQuantityChange = (index, value) => {
    // Allow only whole, nonnegative numbers.
    if (value !== "" && !/^\d+$/.test(value)) return;

    setFormData((current) => ({
      ...current,
      items: current.items.map((item, i) =>
        i === index ? { ...item, quantity: value } : item,
      ),
    }));
  };

  const handleAccountTitleChange = (index, accountTitleId) => {
    setFormData((current) => ({
      ...current,
      items: current.items.map((item, i) =>
        i === index ? { ...item, account_title_id: accountTitleId } : item,
      ),
    }));
  };

  // =======================================
  // SUBMIT
  // =======================================
  const handleSubmit = (event) => {
    event.preventDefault();

    const miscellaneous_inventory = formData.items.map((item) => ({
      item_id: Number(item.item_id),
      uom_id: Number(item.uom_id),
      account_title_id: Number(item.account_title_id),
      quantity: Number(item.quantity),
    }));

    const hasInvalidInventory = miscellaneous_inventory.some(
      (item) =>
        !Number.isInteger(item.item_id) ||
        item.item_id <= 0 ||
        !Number.isInteger(item.uom_id) ||
        item.uom_id <= 0 ||
        !Number.isInteger(item.account_title_id) ||
        item.account_title_id <= 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 0,
    );

    const isValidDescription = DESCRIPTION_TYPE.some(
      (type) => type.value === formData.description,
    );

    if (
      !isValidDescription ||
      formData.items.length === 0 ||
      hasInvalidInventory
    ) {
      return;
    }

    const payload = {
      transaction_date: format(formData.transaction_date, "yyyy-MM-dd"),
      description: formData.description,
      remarks: formData.remarks.trim(),
      miscellaneous_inventory,
    };

    onConfirm(payload);
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Package className="size-5" />
            </div>

            <div>
              <DialogTitle>
                {isEditMode ? "View Miscellaneous Receipt" : "Miscellaneous Receipt"}
              </DialogTitle>

              <DialogDescription>
                Record the receipt details and quantities of items received.
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
          {/* =======================================
              RECEIVING DETAILS
          ======================================= */}
          <section className="grid gap-4">
            <div>
              <h3 className="text-sm font-semibold">Miscellaneous Receipt Details</h3>
              <p className="text-sm text-muted-foreground">
                Enter the receipt information and description type.
              </p>
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
                  placeholder="Select transaction date"
                  maxDate={new Date()}
                  disabled={isLoading || isEditMode}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description Type</Label>

                <Select
                  value={formData.description}
                  onValueChange={(value) =>
                    setFormData((current) => ({
                      ...current,
                      description: value,
                    }))
                  }
                  disabled={isLoading || isEditMode}
                >
                  <SelectTrigger id="description" className="w-full">
                    <SelectValue placeholder="Select description type">
                      {
                        DESCRIPTION_TYPE.find(
                          (type) => type.value === formData.description,
                        )?.label
                      }
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {DESCRIPTION_TYPE.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                disabled={isLoading || isEditMode}
              />
            </div>
          </section>

          <Separator />

          {/* =======================================
              RECEIVED ITEMS
          ======================================= */}
          <section className="grid gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold">Received Items</h3>
                <p className="text-sm text-muted-foreground">
                  Select items and record the quantities received.
                </p>
              </div>

              {!isEditMode && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addItem}
                  disabled={isLoading}
                >
                  <Plus className="mr-2 size-4" />
                  Add
                </Button>
              )}
            </div>

            {isItemsError && (
              <p className="text-sm text-destructive">
                Unable to load the item masterlist. Please try again.
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => fetchItems({ status: 1, page: 0 })}
                >
                  Retry
                </Button>
              </p>
            )}

            <div className="w-full overflow-x-auto rounded-md shadow-lg">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="min-w-48">Item Code</TableHead>
                    <TableHead className="min-w-40 ">Item Name</TableHead>
                    <TableHead className="min-w-24 ">UOM</TableHead>
                    <TableHead className="min-w-24 ">Account Title</TableHead>
                    <TableHead className="min-w-36 ">Quantity</TableHead>
                    {!isEditMode && (
                      <TableHead className="w-16 text-center">Action</TableHead>
                    )}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {formData.items.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={isEditMode ? 5 : 6}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No items added. Click Add to begin.
                      </TableCell>
                    </TableRow>
                  ) : (
                    formData.items.map((item, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Popover
                              open={activeItemIndex === index}
                              onOpenChange={(nextOpen) =>
                                setActiveItemIndex(nextOpen ? index : null)
                              }
                            >
                              <PopoverTrigger
                                render={
                                  <Button
                                    type="button"
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={activeItemIndex === index}
                                    className="w-full min-w-44 h-9 justify-between font-normal"
                                    disabled={isLoading || isEditMode}
                                  >
                                    <span className="truncate">
                                      {item.item_code || "Select item code"}
                                    </span>
                                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                                  </Button>
                                }
                              />
                              <PopoverContent
                                className="w-75 p-0"
                                align="start"
                              >
                                <Command>
                                  <CommandInput placeholder="Search item code or name..." />

                                  <CommandList>
                                    {isFetchingItems && (
                                      <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                                        <Loader2 className="size-4 animate-spin" />
                                        Loading items...
                                      </div>
                                    )}

                                    {!isFetchingItems &&
                                      masterItems.length === 0 && (
                                        <CommandEmpty>
                                          No items found.
                                        </CommandEmpty>
                                      )}

                                    <CommandGroup>
                                      {masterItems.map((masterItem) => {
                                        const code =
                                          masterItem.code ??
                                          masterItem.item_code ??
                                          "";
                                        const name =
                                          masterItem.name ??
                                          masterItem.item_name ??
                                          "";

                                        return (
                                          <CommandItem
                                            key={
                                              masterItem.id ??
                                              masterItem._id ??
                                              code
                                            }
                                            value={`${code} ${name}`}
                                            onSelect={() =>
                                              selectItem(index, masterItem)
                                            }
                                          >
                                            <Check
                                              className={`mr-2 size-4 ${
                                                item.item_code === code
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              }`}
                                            />

                                            <div className="flex min-w-0 flex-col">
                                              <span className="font-medium">
                                                {code}
                                              </span>
                                              <span className="truncate text-xs text-muted-foreground">
                                                {name}
                                              </span>
                                            </div>
                                          </CommandItem>
                                        );
                                      })}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </TableCell>

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
                              step="1"
                              inputMode="numeric"
                              value={item.quantity}
                              onChange={(event) =>
                                handleQuantityChange(index, event.target.value)
                              }
                              placeholder="0"
                              required
                              disabled={isLoading || isEditMode}
                              className="min-w-28 hide-arrow"
                            />
                          </TableCell>

                          {/* <TableCell>
                            <span
                              className={
                                remaining > 0
                                  ? "font-medium"
                                  : "text-muted-foreground"
                              }
                            >
                              {remaining}
                            </span>
                          </TableCell>*/}

                          {/* <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              inputMode="numeric"
                              value={item.actual_received}
                              onChange={(event) =>
                                handleQuantityChange(
                                  index,
                                  "actual_received",
                                  event.target.value,
                                )
                              }
                              placeholder="0"
                              disabled={isLoading || isEditMode}
                              className="min-w-28 hide-arrow"
                            />
                          </TableCell>*/}

                          {!isEditMode && (
                            <TableCell className="text-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => removeItem(index)}
                                disabled={isLoading}
                                aria-label={`Remove ${item.item_code || "item"}`}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </section>
        </form>

        <Separator />

        {!isEditMode ? (
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              form="receiving-form"
              disabled={
                isLoading ||
                !DESCRIPTION_TYPE.some(
                  (type) => type.value === formData.description,
                ) ||
                formData.items.length === 0 ||
                formData.items.some(
                  (item) =>
                    !item.item_id ||
                    !item.uom_id ||
                    !item.account_title_id ||
                    item.quantity === "" ||
                    !/^\d+$/.test(String(item.quantity)),
                )
              }
            >
              <Save className="mr-2 size-4" />
              {isLoading
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Receipt"}
            </Button>
          </DialogFooter>
        ) : (
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MiscReceiptDialog;
