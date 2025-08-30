import {
  Control,
  Controller,
  FieldError,
  FieldErrors,
  Path,
} from "react-hook-form";
import { NumericFormat } from "react-number-format";

interface CurrencyInput<T extends Record<string, any>> {
  placeholder?: string;
  control: Control<T>;
  name: Path<T>;
  error: FieldErrors<T>;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  labelRequired?: boolean;
}

const CurrencyInput = <T extends Record<string, any>>(
  props: CurrencyInput<T>
) => {
  const fieldError = props.error[props.name] as FieldError | undefined;

  return (
    <div className="form-group mb-4">
      {props.label && (
        <label className="text-black" htmlFor={props.name}>
          {props.label}{" "}
          {props.labelRequired && <span className="text-danger">*</span>}
        </label>
      )}

      <Controller
        name={props.name}
        control={props.control}
        render={({ field: { ref, onChange, ...fieldProps } }) => (
          <NumericFormat
            className={`form-control ${fieldError ? "is-invalid" : ""}`}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={2}
            prefix="Rp "
            {...fieldProps}
            getInputRef={ref}
            placeholder={props.placeholder}
            required={props.required}
            allowNegative={false}
            disabled={props.disabled}
            onValueChange={(value) => {
              const numericValue = value.floatValue ?? 0;
              onChange(numericValue);
            }}
          />
        )}
      />

      <div style={{ height: 8 }}>
        {fieldError && (
          <small className="text-danger">{fieldError.message}</small>
        )}
      </div>
    </div>
  );
};

export default CurrencyInput;
