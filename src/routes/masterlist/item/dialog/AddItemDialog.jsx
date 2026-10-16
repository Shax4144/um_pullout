import { useEffect, useState } from "react";
import { Package, Save } from "lucide-react";

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

import CategoriesDropdown from "@/components/dropdowns/CategoriesDropdown";
import { useLazyFetchCategoriesQuery } from "../../../../api/masterlist/categories.api"

const EMPTY_ITEM = {
  code: "",
  name: "",
  category: "",
  uom: "",
  warehouse: "",
};

const AddItemDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading,
  selectedRow,
}) => {
  const isEditMode = Boolean(selectedRow?.id);
  const [formData, setFormData] = useState(EMPTY_ITEM);

  // =======================================
  // CATEGORY DROPDOWN
  // =======================================
  const [
    fetchCategories,
    {
      data: categoriesData,
      isFetching: isFetchingCategories,
      isError: isCategoriesError,
    },
  ] = useLazyFetchCategoriesQuery();

  useEffect(() => {
    if (open) {
      fetchCategories({
        status: 1,
        page: 0,
      });
    }
  }, [open, fetchCategories]);

  // =======================================
  // prefill on edit
  // =======================================
  useEffect(() => {
    if (!open) return;

    setFormData({
      code: selectedRow?.code ?? "",
      name: selectedRow?.name ?? "",
      category: selectedRow?.category ?? "",
      uom: selectedRow?.uom ?? "",
      warehouse: selectedRow?.warehouse ?? "",
    });
  }, [selectedRow, open]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onConfirm({
      ...formData,
      code: formData.code.trim(),
      name: formData.name.trim(),
      category: formData.category.trim(),
      uom: formData.uom.trim(),
      warehouse: formData.warehouse.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-xl rounded-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Package className="size-5" />
            </div>

            <div>
              <DialogTitle>
                {isEditMode ? "Edit Item" : "Add Item"}
              </DialogTitle>

              <DialogDescription>
                {isEditMode
                  ? "Update the inventory item details."
                  : "Add a new item to inventory."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form id="item-form" onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              disabled={isLoading}
              required
              placeholder="e.g. ITEM-001"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              required
              placeholder="e.g. Ballpen"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <CategoriesDropdown
                categoriesData={categoriesData?.data ?? []}
                value={formData.category}
                onChange={(value) =>
                  setFormData((current) => ({
                    ...current,
                    category: value,
                  }))
                }
                open={open}
                isLoading={
                  isLoading || isFetchingCategories
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="uom">UOM</Label>
              <Input
                id="uom"
                name="uom"
                value={formData.uom}
                onChange={handleChange}
                disabled={isLoading}
                required
                placeholder="e.g. Piece"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="warehouse">Warehouse</Label>
            <Input
              id="warehouse"
              name="warehouse"
              value={formData.warehouse}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>

          <Button
            type="submit"
            form="item-form"
            disabled={isLoading}
          >
            <Save className="mr-1 size-4" />
            {isLoading ? "Saving..." : isEditMode ? "Save changes" : "Add item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;