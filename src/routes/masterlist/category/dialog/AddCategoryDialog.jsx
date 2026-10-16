import { useEffect, useState } from "react";
import { Shapes, Save } from "lucide-react";

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

const EMPTY_ITEM = {
  code: "",
  name: "",
};

const AddCategoryDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading,
  selectedRow,
}) => {
  const isEditMode = Boolean(selectedRow?.id);
  const [formData, setFormData] = useState(EMPTY_ITEM);

  useEffect(() => {
    if (!open) return;

    setFormData({
      code: selectedRow?.code ?? "",
      name: selectedRow?.name ?? "",
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
    });
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-xl rounded-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shapes className="size-5" />
            </div>

            <div>
              <DialogTitle>
                {isEditMode ? "Edit Category" : "Add Category"}
              </DialogTitle>

              <DialogDescription>
                {isEditMode
                  ? "Update the inventory category details."
                  : "Add a new category to inventory."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form id="category-form" onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              disabled={isLoading}
              required
              placeholder="e.g. BG"
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
              placeholder="e.g. Bag"
            />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>

          <Button
            type="submit"
            form="category-form"
            disabled={isLoading}
          >
            <Save className="mr-1 size-4" />
            {isLoading ? "Saving..." : isEditMode ? "Save changes" : "Add category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;