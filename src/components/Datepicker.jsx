import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Datepicker = ({
  variant,
  value,
  onChange,
  placeholder,
  disabled,
  minDate,
  maxDate,
}) => {
  
  const disabledDates = [
    ...(minDate ? [{ before: minDate }] : []),
    ...(maxDate ? [{ after: maxDate }] : []),
  ];

  return (
    <Field className="mx-auto">
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant={variant}
              id="date-picker-simple"
              className="justify-start rounded-sm overflow-hidden h-9"
              disabled={disabled}
            >
              {value ? (
                format(value, "PPP")
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </Button>
          }
        />
        <PopoverContent className="w-auto border border-muted p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            defaultMonth={value}
            disabled={disabledDates}
            startMonth={minDate}
            endMonth={maxDate}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
};

export default Datepicker;
