import {
  FieldError,
  FieldErrors,
  Path,
  UseFormRegister,
} from "react-hook-form";

interface FormInputTypes<T extends Record<string, any>> {
  type: "text" | "email" | "password";
  placeholder?: string;
  register: UseFormRegister<T>;
  name: Path<T>;
  error: FieldErrors<T>;
  required?: boolean;
  disabled?: boolean;
  label?: string;
}

const FormInput = <T extends Record<string, any>>(props: FormInputTypes<T>) => {
  const fieldError = props.error[props.name] as FieldError | undefined;

  return (
    <div className="form-group mb-4">
      {props.label && (
        <label className="text-black" htmlFor={props.name}>
          {props.label}
        </label>
      )}
      <input
        id={props.name}
        type={props.type}
        className={`form-control ${fieldError ? "is-invalid" : ""}`}
        placeholder={props.placeholder}
        required={props.required}
        disabled={props.disabled}
        {...props.register(props.name)}
      />
      <div style={{ height: 8 }}>
        {fieldError && (
          <small className="text-danger">{fieldError.message}</small>
        )}
      </div>
    </div>
  );
};

export default FormInput;
