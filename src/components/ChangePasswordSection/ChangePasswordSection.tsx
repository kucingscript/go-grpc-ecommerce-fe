import { useForm } from "react-hook-form";
import FormInput from "../FormInput/FormInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getAuthClient } from "../../api/grpc/client";
import Swal from "sweetalert2";
import useGrpcApi from "../../hooks/useGrpcApi";

const changePasswordSchema = yup.object().shape({
  current_password: yup
    .string()
    .required("Kata Sandi Saat Ini wajib diisi")
    .min(8, "Kata Sandi Saat Ini minimal 8 karakter"),
  new_password: yup
    .string()
    .required("Kata Sandi Baru wajib diisi")
    .min(8, "Kata Sandi Baru minimal 8 karakter"),
  confirm_new_password: yup
    .string()
    .required("Konfirmasi Kata Sandi Baru wajib diisi")
    .oneOf([yup.ref("new_password")], "Konfirmasi Kata Sandi Baru tidak cocok"),
});

interface ChangePasswordFormValues {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

function ChangePasswordSection() {
  const submitApi = useGrpcApi();

  const form = useForm<ChangePasswordFormValues>({
    resolver: yupResolver(changePasswordSchema),
  });

  const handleSubmit = async (data: ChangePasswordFormValues) => {
    await submitApi.callApi(
      getAuthClient().changePassword({
        oldPassword: data.current_password,
        newPassword: data.new_password,
        newPasswordConfirmation: data.confirm_new_password,
      }),
      {
        defaultError: (res) => {
          if (
            res.response.baseResponse?.message === "Old password is mismatched"
          ) {
            Swal.fire({
              icon: "error",
              title: "Terjadi Kesalahan",
              text: "Kata sandi saat ini salah",
            });
          }
        },
        useDefaultError: false,
      }
    );

    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Kata sandi berhasil diperbarui",
    });

    form.reset();
  };

  return (
    <div className="p-4 p-lg-5 border bg-white">
      <h2 className="h3 mb-3 text-black">Ubah Kata Sandi</h2>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormInput<ChangePasswordFormValues>
          name="current_password"
          type="password"
          label="Kata Sandi Saat Ini"
          required
          register={form.register}
          error={form.formState.errors}
          disabled={submitApi.isLoading}
        />
        <FormInput<ChangePasswordFormValues>
          name="new_password"
          type="password"
          label="Kata Sandi Baru"
          required
          register={form.register}
          error={form.formState.errors}
          disabled={submitApi.isLoading}
        />
        <FormInput<ChangePasswordFormValues>
          name="confirm_new_password"
          type="password"
          label="Konfirmasi Kata Sandi Baru"
          required
          register={form.register}
          error={form.formState.errors}
          disabled={submitApi.isLoading}
        />

        <button
          type="submit"
          disabled={submitApi.isLoading}
          className="btn btn-primary"
        >
          Perbarui Kata Sandi
        </button>
      </form>
    </div>
  );
}

export default ChangePasswordSection;
