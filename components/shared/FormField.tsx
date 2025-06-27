import React from "react";
import { FormControl, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

type FormField<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  type: string;
  label: string;
  placeholder: string;
};

const FormField = <T extends FieldValues>({
  control,
  type,
  name,
  label,
  placeholder,
}: FormField<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-light-100 text-[16px] font-normal">
            {label}
          </FormLabel>

          <FormControl>
            <Input
              className=" rounded-full !py-7 px-5 bg-dark-200 text-white !ring-0 border-none text-lg"
              type={type}
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default FormField;
