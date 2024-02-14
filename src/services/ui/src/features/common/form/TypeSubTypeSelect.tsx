import { useGetSeaTypes, useGetSeaSubTypes } from "@/api";
import * as Inputs from "@/components/Inputs";
import { Control, FieldValues, Path } from "react-hook-form";

type SeaTypeSelectFormFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  authorityId: number;
};

export function SeaTypeSelect<TFieldValues extends FieldValues>({
  control,
  name,
  authorityId,
}: SeaTypeSelectFormFieldProps<TFieldValues>) {
  const { data } = useGetSeaTypes(authorityId);

  return (
    <Inputs.FormField
      control={control}
      name={name}
      render={({ field }) => (
        <Inputs.FormItem className="max-w-sm">
          <Inputs.FormLabel className="text-lg font-bold block">
            Type <Inputs.RequiredIndicator />
          </Inputs.FormLabel>
          <Inputs.Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <Inputs.FormControl>
              <Inputs.SelectTrigger>
                <Inputs.SelectValue placeholder="Select a type" />
              </Inputs.SelectTrigger>
            </Inputs.FormControl>
            <Inputs.SelectContent>
              {data &&
                data.map((T) => (
                  <Inputs.SelectItem key={T.id} value={String(T.id)}>
                    {T.name}
                  </Inputs.SelectItem>
                ))}
            </Inputs.SelectContent>
          </Inputs.Select>
          <Inputs.FormMessage />
        </Inputs.FormItem>
      )}
    />
  );
}

type SeaSubTypeSelectFormFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  authorityId: number;
  typeId: string;
};

export function SeaSubTypeSelect<TFieldValues extends FieldValues>({
  control,
  typeId,
  name,
  authorityId,
}: SeaSubTypeSelectFormFieldProps<TFieldValues>) {
  const { data } = useGetSeaSubTypes(authorityId, typeId);

  return (
    <Inputs.FormField
      control={control}
      name={name}
      render={({ field }) => (
        <Inputs.FormItem className="max-w-sm">
          <Inputs.FormLabel className="text-lg font-bold block">
            Sub Type <Inputs.RequiredIndicator />
          </Inputs.FormLabel>
          <Inputs.Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <Inputs.FormControl>
              <Inputs.SelectTrigger>
                <Inputs.SelectValue placeholder="Select a sub type" />
              </Inputs.SelectTrigger>
            </Inputs.FormControl>
            <Inputs.SelectContent>
              {data &&
                data.map((T) => (
                  <Inputs.SelectItem key={T.id} value={String(T.id)}>
                    {T.name}
                  </Inputs.SelectItem>
                ))}
            </Inputs.SelectContent>
          </Inputs.Select>
          <Inputs.FormMessage />
        </Inputs.FormItem>
      )}
    />
  );
}
