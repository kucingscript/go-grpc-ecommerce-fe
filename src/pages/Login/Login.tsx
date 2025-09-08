import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "../../components/FormInput/FormInput";
import Swal from "sweetalert2";
import { getAuthClient } from "../../api/grpc/client";
import { useAuthStore } from "../../store/auth";
import useGrpcApi from "../../hooks/useGrpcApi";

const loginSchema = yup.object().shape({
  email: yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: yup
    .string()
    .required("Password wajib diisi")
    .min(8, "Password minimal 8 karakter"),
});

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const loginApi = useGrpcApi();
  const navigate = useNavigate();
  const loginUser = useAuthStore((state) => state.login);

  const form = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const handleSubmit = async (data: LoginFormValues) => {
    const res = await loginApi.callApi(
      getAuthClient().login({
        email: data.email,
        password: data.password,
      }),
      {
        useDefaultAuthError: false,
        defaultAuthError: () => {
          Swal.fire({
            icon: "error",
            title: "Login Gagal",
            text: "Email atau kata sandi salah",
          });
        },
      }
    );

    localStorage.setItem("access_token", res.response.accessToken);
    loginUser(res.response.accessToken);

    if (useAuthStore.getState().role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="login-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="login-wrap p-4">
              <h2 className="section-title text-center mb-5">Masuk</h2>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="login-form"
              >
                <FormInput<LoginFormValues>
                  name="email"
                  type="email"
                  placeholder="Alamat Email"
                  required
                  register={form.register}
                  error={form.formState.errors}
                />
                <FormInput<LoginFormValues>
                  name="password"
                  type="password"
                  placeholder="Kata Sandi"
                  required
                  register={form.register}
                  error={form.formState.errors}
                />
                <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-block">
                    Masuk
                  </button>
                </div>
                <div className="text-center mt-4">
                  <p>
                    Belum punya akun?{" "}
                    <Link to="/register" className="text-primary">
                      Daftar di sini
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

export default Login;
