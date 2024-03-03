import { useGetSubTypes } from "@/api";
import * as Inputs from "@/components/Inputs";
import { Control, FieldValues, Path } from "react-hook-form";
import Select from "react-select";

type SubTypeSelectFormFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  authorityId: number;
  typeIds?: number[];
};

type SelectOption = {
  value: string;
  label: string;
};

export function SubTypeSelect<TFieldValues extends FieldValues>({
  control,
  name,
  authorityId,
  typeIds = [],
}: SubTypeSelectFormFieldProps<TFieldValues>) {
  const { data } = useGetSubTypes(
    authorityId,
    typeIds,
    {
      enabled: typeIds.length > 0,
    }
  );

  const options = data?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  return (
    <Inputs.FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <Inputs.FormItem className="max-w-sm">
            <Inputs.FormLabel className="font-semibold block">
              Sub Types <Inputs.RequiredIndicator />
            </Inputs.FormLabel>
            <Select
              isMulti
              value={
                field.value
                  ? field.value.map((id: number) =>
                      options?.find((O) => O.value === id)
                    )
                  : []
              }
              onChange={(val) =>
                field.onChange(val.map((v: SelectOption) => v.value))
              }
              options={options}
              closeMenuOnSelect={false}
              className="border border-black shadow-sm rounded-sm"
            />
          </Inputs.FormItem>
        );
      }}
    />
  );
}
