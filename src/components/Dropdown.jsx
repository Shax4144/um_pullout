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
  const getItemValue = (item) =>
    item.value ?? item.id ?? item._id;

  const selectedItem = data.find(
    (item) => String(getItemValue(item)) === String(value ?? ""),
  );

  const capitalizeWords = (value = "") =>
    String(value)
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const getItemLabel = (item) => {
    if (!item) return "";
  
    if (item.label != null) {
      return capitalizeWords(item.label);
    }
  
    if (item.code) {
      return `${item.code} - ${capitalizeWords(item.name)}`;
    }
  
    if (item.symbol) {
      return `${item.symbol} - ${capitalizeWords(item.name)}`;
    }
  
    if (item.first_name || item.last_name) {
      const fullName = capitalizeWords(
        `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim()
      );
  
      const warehouse = item.warehouse;
  
      if (warehouse) {
        return `${fullName} (${warehouse.code} - ${capitalizeWords(warehouse.name)})`;
      }
  
      return fullName;
    }
  
    return capitalizeWords(item.name ?? "");
  };

  return (
    <Select
      value={value != null && value !== "" ? String(value) : ""}
      onValueChange={onChange}
      disabled={isLoading}
    >
      <SelectTrigger className="h-9 w-full">
        <SelectValue placeholder={isLoading ? "Loading..." : placeholder}>
          {selectedItem ? getItemLabel(selectedItem) : undefined}
        </SelectValue>
      </SelectTrigger>

      <SelectContent alignItemWithTrigger={false}>
        {data.map((item) => {
          const itemValue = getItemValue(item);

          return (
            <SelectItem key={itemValue} value={String(itemValue)}>
              {item.first_name || item.last_name ? (
                <div className="flex flex-col gap-1">
                  <span className="font-medium">
                    {`${item.first_name ?? ""} ${item.last_name ?? ""}`.trim()}
                  </span>

                  {item.warehouse && (
                    <span className="text-xs text-muted-foreground">
                      {item.warehouse.code} - {item.warehouse.name}
                    </span>
                  )}
                </div>
              ) : (
                getItemLabel(item)
              )}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default Dropdown;

