import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const CategoriesDropdown = ({
  categoriesData = [],
  value,
  onChange,
  isLoading,
}) => {
  const selectedCategory = categoriesData.find(
    (category) => String(category.id) === String(value ?? ""),
  );

  return (
    <Select
      value={value == null ? "" : String(value)}
      onValueChange={onChange}
      disabled={isLoading}
    >
      <SelectTrigger className="h-8 w-full">
        <SelectValue placeholder={isLoading ? "Loading..." : "Select Category"}>
          {selectedCategory
            ? `${selectedCategory.code} - ${selectedCategory.name}`
            : undefined}
        </SelectValue>
      </SelectTrigger>

      <SelectContent
        alignItemWithTrigger={false}
        className="border border-border/20"
      >
        {categoriesData.map((category) => (
          <SelectItem key={category.id} value={String(category.id)}>
            {category.code} - {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategoriesDropdown;
