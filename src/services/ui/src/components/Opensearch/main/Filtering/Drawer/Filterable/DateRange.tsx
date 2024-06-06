import { useState, useMemo } from "react";
import {
  format,
  isAfter,
  isBefore,
  isValid,
  parse,
  startOfQuarter,
  startOfMonth,
  sub,
  getYear,
  endOfDay,
  startOfDay,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Calendar,
  Input,
} from "@/components";
import { opensearch } from "shared-types";
import {
  getNextBusinessDayTimestamp,
  offsetFromUtc,
  offsetToUtc,
} from "shared-utils";

type Props = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "value" | "onSelect"
> & {
  value: opensearch.RangeValue;
  onChange: (val: opensearch.RangeValue) => void;
  className?: string;
};

export function FilterableDateRange({ value, onChange, ...props }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>({
    from: value?.gte ? offsetToUtc(new Date(value?.gte)) : undefined,
    to: value?.lte ? offsetToUtc(new Date(value?.lte)) : undefined,
  });
  const [fromValue, setFromValue] = useState<string>(
    value?.gte ? format(offsetToUtc(new Date(value?.gte)), "MM/dd/yyyy") : "",
  );
  const [toValue, setToValue] = useState<string>(
    value?.lte ? format(offsetToUtc(new Date(value?.lte)), "MM/dd/yyyy") : "",
  );

  const handleClose = (updateOpen: boolean) => {
    setOpen(updateOpen);
  };

  const offsetRangeToUtc = (val: opensearch.RangeValue) => ({
    gte: val.gte ? offsetToUtc(new Date(val.gte)).toISOString() : undefined,
    lte: val.lte ? offsetToUtc(new Date(val.lte)).toISOString() : undefined,
  });

  const onFromInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minValidYear = 1960;
    const input = e.target.value;

    if (/^[0-9/]*$/.test(input)) {
      setFromValue(e.target.value);
      const date = parse(e.target.value, "MM/dd/yyyy", new Date());
      if (
        !isValid(date) ||
        getYear(date) < minValidYear ||
        isAfter(date, new Date())
      ) {
        return setSelectedDate({ from: undefined, to: selectedDate?.to });
      }
      if (selectedDate?.to && isAfter(date, selectedDate.to)) {
        setSelectedDate({ from: date, to: undefined });
        setToValue("");
      } else {
        setSelectedDate({ from: date, to: selectedDate?.to });
        onChange(
          offsetRangeToUtc({
            gte: date.toISOString(),
            lte: selectedDate?.to?.toISOString() || "",
          }),
        );
      }
    }
  };

  const onToInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minValidYear = 1960;
    const inputValue = e.target.value;

    if (/^[0-9/]*$/.test(inputValue)) {
      setToValue(e.target.value);
      const date = parse(inputValue, "MM/dd/yyyy", new Date());

      if (
        !isValid(date) ||
        getYear(date) < minValidYear ||
        isAfter(date, new Date())
      ) {
        return setSelectedDate({ from: selectedDate?.from, to: undefined });
      }

      if (selectedDate?.from && isBefore(date, selectedDate.from)) {
        setSelectedDate({ from: undefined, to: selectedDate.from });
        setFromValue("");
      } else {
        setSelectedDate({ from: selectedDate?.from, to: date });
        onChange(
          offsetRangeToUtc({
            gte: selectedDate?.from?.toISOString() || "",
            lte: endOfDay(date).toISOString(),
          }),
        );
      }
    }
  };

  const getDateRange = (
    startDate: Date,
    endDate: Date,
  ): opensearch.RangeValue => {
    return {
      gte: startDate.toISOString(),
      lte: endDate.toISOString(),
    };
  };

  const setPresetRange = (range: string) => {
    const today = startOfDay(new Date());
    let startDate = today;
    if (range === "quarter") {
      startDate = startOfQuarter(today);
    } else if (range === "month") {
      startDate = startOfMonth(today);
    } else if (range === "week") {
      startDate = sub(today, { days: 6 });
    }

    const rangeObject = getDateRange(startDate, endOfDay(today));
    onChange(offsetRangeToUtc(rangeObject));
    setSelectedDate({ from: startDate, to: today });
    setFromValue(format(startDate, "MM/dd/yyyy"));
    setToValue(format(today, "MM/dd/yyyy"));
  };

  // Calendar props
  const disableDates = [
    { after: offsetFromUtc(new Date(getNextBusinessDayTimestamp())) },
  ];

  const onSelect = (d: any) => {
    setSelectedDate(d);
    if (!!d?.from && !!d.to) {
      onChange(
        offsetRangeToUtc({
          gte: d.from.toISOString(),
          lte: endOfDay(d.to).toISOString(),
        }),
      );
      setFromValue(format(d.from, "MM/dd/yyyy"));
      setToValue(format(d.to, "MM/dd/yyyy"));
    } else if (!d?.from && !d?.to) {
      onChange(
        offsetRangeToUtc({
          gte: "",
          lte: "",
        }),
      );
      setFromValue("");
      setToValue("");
    } else if (d?.from && !d?.to) {
      setFromValue(format(d.from, "MM/dd/yyyy"));
      onChange(offsetRangeToUtc(getDateRange(d.from, endOfDay(d.from))));
    }
  };

  const label = useMemo(() => {
    const from = selectedDate?.from
      ? format(selectedDate.from, "LLL dd, y")
      : "";
    const to = selectedDate?.to ? format(selectedDate.to, "LLL dd, y") : "";

    if (from && to) return `${from} - ${to}`;
    if (from) return `${from}`;
    return "Pick a date";
  }, [selectedDate]);

  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={handleClose}>
        <PopoverTrigger>
          <div
            id="date"
            className={cn(
              "flex items-center w-[270px] border-[1px] border-black p-2 justify-start text-left font-normal",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {label}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="min-w-fit lg:w-auto p-0"
          align="start"
          side="left"
          sideOffset={1}
        >
          <div className="hidden lg:block">
            <Calendar
              disabled={disableDates}
              initialFocus
              mode="range"
              defaultMonth={selectedDate?.from}
              selected={selectedDate}
              numberOfMonths={2}
              className="bg-white"
              onSelect={onSelect}
              {...props}
            />
          </div>
          <div className="lg:hidden flex align-center">
            <Calendar
              disabled={disableDates}
              initialFocus
              mode="range"
              defaultMonth={selectedDate?.from}
              selected={selectedDate}
              numberOfMonths={1}
              className="bg-white"
              onSelect={onSelect}
              {...props}
            />
          </div>
          <div className="flex flex-row gap-2 lg:gap-4 w-min-[300px] lg:w-[320px] p-2 m-auto">
            <Input
              onChange={onFromInput}
              value={fromValue}
              placeholder="mm/dd/yyyy"
              className="text-md"
            />
            <p>-</p>
            <Input
              onChange={onToInput}
              value={toValue}
              placeholder="mm/dd/yyyy"
              className="text-md"
            />
          </div>
          <div className="flex w-full flex-wrap lg:flex-row p-1">
            <div className="w-1/2 lg:w-1/4 p-1">
              <Button
                className="w-full"
                onClick={() => setPresetRange("today")}
              >
                Today
              </Button>
            </div>
            <div className="w-1/2 lg:w-1/4 p-1">
              <Button className="w-full" onClick={() => setPresetRange("week")}>
                Last 7 Days
              </Button>
            </div>
            <div className="w-1/2 lg:w-1/4 p-1">
              <Button
                className="w-full"
                onClick={() => setPresetRange("month")}
              >
                Month To Date
              </Button>
            </div>
            <div className="w-1/2 lg:w-1/4 p-1">
              <Button
                className="w-full"
                onClick={() => setPresetRange("quarter")}
              >
                Quarter To Date
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Button
        className="text-white"
        onClick={() => {
          setSelectedDate({ from: undefined, to: undefined });
          onChange(offsetRangeToUtc({ gte: undefined, lte: undefined }));
          setToValue("");
          setFromValue("");
        }}
      >
        Clear
      </Button>
    </div>
  );
}