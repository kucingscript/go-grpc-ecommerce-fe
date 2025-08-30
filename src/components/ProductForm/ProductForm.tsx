import { useForm } from "react-hook-form";
import FormInput from "../FormInput/FormInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CurrencyInput from "../CurrencyInput/CurrencyInput";
import { type ProductFormValues } from "../../types/product";
import { useEffect } from "react";

const createProductSchema = yup.object().shape({
  name: yup.string().required("Nama Produk wajib diisi"),
  price: yup
    .number()
    .required("Harga Produk wajib diisi")
    .typeError("Harga Produk harus berupa angka")
    .moreThan(0, "Harga Produk harus lebih besar dari 0"),
  description: yup.string().required("Deskripsi Produk wajib diisi"),
  image: yup
    .mixed<FileList>()
    .required("Gambar Produk wajib diisi")
    .test("fileLength", "Gambar Produk wajib diisi", (fileList) => {
      return fileList.length > 0;
    })
    .test(
      "fileType",
      "Gambar Produk tidak valid (.jpg, .jpeg, .png, .webp)",
      (fileList) => {
        return fileList && fileList.length > 0
          ? ["image/jpeg", "image/png", "image/webp"].includes(fileList[0].type)
          : true;
      }
    )
    .test(
      "fileSize",
      "Gambar Produk tidak boleh lebih besar dari 2MB",
      (fileList) => {
        return fileList && fileList.length > 0
          ? fileList[0].size <= 2 * 1024 * 1024
          : true;
      }
    ),
});

const editProductSchema = yup.object().shape({
  name: yup.string().required("Nama Produk wajib diisi"),
  price: yup
    .number()
    .required("Harga Produk wajib diisi")
    .typeError("Harga Produk harus berupa angka")
    .moreThan(0, "Harga Produk harus lebih besar dari 0"),
  description: yup.string().required("Deskripsi Produk wajib diisi"),
  image: yup
    .mixed<FileList>()
    .required("Gambar Produk wajib diisi")
    .test(
      "fileType",
      "Gambar Produk tidak valid (.jpg, .jpeg, .png, .webp)",
      (fileList) => {
        return fileList && fileList.length > 0
          ? ["image/jpeg", "image/png", "image/webp"].includes(fileList[0].type)
          : true;
      }
    )
    .test(
      "fileSize",
      "Gambar Produk tidak boleh lebih besar dari 2MB",
      (fileList) => {
        return fileList && fileList.length > 0
          ? fileList[0].size <= 2 * 1024 * 1024
          : true;
      }
    ),
});

interface ProductFormProps {
  onSubmit: (data: ProductFormValues) => void;
  disabled?: boolean;
  defaultValues?: ProductFormValues;
  isEdit?: boolean;
}

function ProductForm(props: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: yupResolver(
      props.isEdit ? editProductSchema : createProductSchema
    ),
    defaultValues: props.defaultValues,
  });

  const handleSubmit = (data: ProductFormValues) => {
    props.onSubmit(data);
  };

  useEffect(() => {
    if (props.defaultValues) {
      form.reset(props.defaultValues);
    }
  }, [props.defaultValues]);

  return (
    <div className="p-4 p-lg-5 border bg-white">
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormInput<ProductFormValues>
          name="name"
          type="text"
          placeholder="Nama Produk"
          label="Nama Produk"
          register={form.register}
          error={form.formState.errors}
          required
          labelRequired
          disabled={props.disabled}
        />

        <CurrencyInput<ProductFormValues>
          name="price"
          placeholder="Harga Produk"
          label="Harga Produk"
          control={form.control}
          error={form.formState.errors}
          required
          labelRequired
          disabled={props.disabled}
        />

        <FormInput<ProductFormValues>
          name="description"
          type="textarea"
          placeholder="Deskripsi Produk"
          label="Deskripsi Produk"
          register={form.register}
          error={form.formState.errors}
          required
          labelRequired
          disabled={props.disabled}
        />

        {props.defaultValues?.imageUrl && (
          <img
            src={props.defaultValues.imageUrl}
            alt={props.defaultValues.name}
            className="w-25"
          />
        )}

        <FormInput<ProductFormValues>
          name="image"
          type="image"
          placeholder="Gambar Produk"
          label="Gambar Produk"
          register={form.register}
          error={form.formState.errors}
          required={props.isEdit ? false : true}
          labelRequired
          disabled={props.disabled}
        />

        <div className="form-group">
          <button
            disabled={props.disabled}
            type="submit"
            className="btn btn-primary"
          >
            Simpan Produk
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
