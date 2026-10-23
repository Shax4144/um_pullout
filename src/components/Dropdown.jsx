import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const Dropdown = ({
  data = [],
  value,
  onChange,
  isLoading = false,
  placeholder = "Select an option",
}) => {
  const selectedItem = data.find(
    (item) => String(item.id ?? item._id) === String(value ?? "")
  );

  const getItemLabel = (item) => {
    if (!item) return "";

    if (item.code) {
      return `${item.code} - ${item.name}`;
    }

    if (item.symbol) {
      return `${item.symbol} - ${item.name}`;
    }

    return item.name ?? "";
  };

  return (
    <Select
      value={value != null && value !== "" ? String(value) : ""}
      onValueChange={onChange}
      disabled={isLoading}
    >
      <SelectTrigger className="h-9 w-full">
        <SelectValue
          placeholder={isLoading ? "Loading..." : placeholder}
        >
          {selectedItem ? getItemLabel(selectedItem) : undefined}
        </SelectValue>
      </SelectTrigger>

      <SelectContent alignItemWithTrigger={false}>
        {data.map((item) => {
          const id = item.id ?? item._id;

          return (
            <SelectItem key={id} value={String(id)}>
              {getItemLabel(item)}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default Dropdown;