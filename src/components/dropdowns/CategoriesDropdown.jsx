import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const CategoriesDropdown = ({ categoriesData = [], value, onChange, isLoading }) => {
  return (
    <Select value={value ?? ""} onValueChange={onChange} disabled={isLoading}>
      <SelectTrigger className="h-8 w-full">
        <SelectValue placeholder={isLoading ? "Loading..." : "Select Category"} />
      </SelectTrigger>

      <SelectContent alignItemWithTrigger={false}
        className="border border-border/20"
      >
        {categoriesData.map((category) => (
          <SelectItem key={category.id} value={String(category.name)}>
            {category.code} - {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategoriesDropdown;
