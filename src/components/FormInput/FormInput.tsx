import {
  FieldError,
  FieldErrors,
  Path,
  UseFormRegister,
} from "react-hook-form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface FormInputTypes<T extends Record<string, any>> {
  type: "text" | "email" | "password" | "image" | "textarea";
  placeholder?: string;
  register: UseFormRegister<T>;
  name: Path<T>;
  error: FieldErrors<T>;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  labelRequired?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormInput = <T extends Record<string, any>>(props: FormInputTypes<T>) => {
  const fieldError = props.error[props.name] as FieldError | undefined;

  const renderInput = () => {
    if (props.type === "image") {
      return (
        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          multiple={false}
          className={`form-control ${fieldError ? "is-invalid" : ""}`}
          placeholder={props.placeholder}
          required={props.required}
          disabled={props.disabled}
          {...props.register(props.name)}
        />
      );
    }

    if (props.type === "textarea") {
      return (
        <textarea
          rows={4}
          id={props.name}
          className={`form-control ${fieldError ? "is-invalid" : ""}`}
          placeholder={props.placeholder}
          required={props.required}
          disabled={props.disabled}
          {...props.register(props.name)}
        />
      );
    }

    return (
      <input
        id={props.name}
        type={props.type}
        className={`form-control ${fieldError ? "is-invalid" : ""}`}
        placeholder={props.placeholder}
        required={props.required}
        disabled={props.disabled}
        {...props.register(props.name)}
      />
    );
  };

  return (
    <div className="form-group mb-4">
      {props.label && (
        <label className="text-black" htmlFor={props.name}>
          {props.label}{" "}
          {props.labelRequired && <span className="text-danger">*</span>}
        </label>
      )}

      {renderInput()}

      <div style={{ height: 8 }}>
        {fieldError && (
          <small className="text-danger">{fieldError.message}</small>
        )}
      </div>
    </div>
  );
};

export default FormInput;
