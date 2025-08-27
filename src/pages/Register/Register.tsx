import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput/FormInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getAuthClient } from "../../api/grpc/client";
import Swal from "sweetalert2";
import useGrpcApi from "../../hooks/useGrpcApi";

const registerSchema = yup.object().shape({
  full_name: yup.string().required("Nama Lengkap wajib diisi"),
  email: yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: yup
    .string()
    .required("Password wajib diisi")
    .min(8, "Password minimal 8 karakter"),
  password_confirmation: yup
    .string()
    .required("Konfirmasi Password wajib diisi")
    .oneOf([yup.ref("password")], "Konfirmasi Password tidak cocok"),
});

interface RegisterFormValues {
  full_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const Register = () => {
  const registerApi = useGrpcApi();
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
  });

  const handleSubmit = async (data: RegisterFormValues) => {
    await registerApi.callApi(
      getAuthClient().register({
        fullName: data.full_name,
        email: data.email,
        password: data.password,
        passwordConfirmation: data.password_confirmation,
      }),
      {
        useDefaultError: false,
        defaultError: (res) => {
          if (res.response.baseResponse?.message === "User already exists") {
            Swal.fire({
              icon: "error",
              title: "Registrasi Gagal",
              text: "Email sudah terdaftar",
            });
          }
        },
      }
    );

    Swal.fire({
      icon: "success",
      title: "Registrasi Berhasil",
      text: "Silahkan login untuk melanjutkan",
    });

    navigate("/login");
  };

  return (
    <div className="login-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="login-wrap p-4">
              <h2 className="section-title text-center mb-5">Daftar</h2>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="login-form"
              >
                <FormInput<RegisterFormValues>
                  name="full_name"
                  type="text"
                  placeholder="Nama Lengkap"
                  required
                  register={form.register}
                  error={form.formState.errors}
                  disabled={registerApi.isLoading}
                />
                <FormInput<RegisterFormValues>
                  name="email"
                  type="email"
                  placeholder="Alamat Email"
                  required
                  register={form.register}
                  error={form.formState.errors}
                  disabled={registerApi.isLoading}
                />
                <FormInput<RegisterFormValues>
                  name="password"
                  type="password"
                  placeholder="Kata Sandi"
                  required
                  register={form.register}
                  error={form.formState.errors}
                  disabled={registerApi.isLoading}
                />
                <FormInput<RegisterFormValues>
                  name="password_confirmation"
                  type="password"
                  placeholder="Konfirmasi Kata Sandi"
                  required
                  register={form.register}
                  error={form.formState.errors}
                  disabled={registerApi.isLoading}
                />

                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={registerApi.isLoading}
                  >
                    Buat Akun
                  </button>
                </div>

                <div className="text-center mt-4">
                  <p>
                    Sudah punya akun?{" "}
                    <Link to="/login" className="text-primary">
                      Masuk di sini
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
