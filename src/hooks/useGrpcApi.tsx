import {
  RpcError,
  FinishedUnaryCall,
  type UnaryCall,
} from "@protobuf-ts/runtime-rpc";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import Swal from "sweetalert2";
import { BaseResponse } from "../../pb/common/base_response";

interface callApiArgs<T extends Object, U extends GrpcBaseResponse> {
  useDefaultError?: boolean;
  defaultError?: (e: FinishedUnaryCall<T, U>) => void;
  useDefaultAuthError?: boolean;
  defaultAuthError?: (e: RpcError) => void;
}

interface GrpcBaseResponse {
  baseResponse?: BaseResponse;
}

const useGrpcApi = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const logoutUser = useAuthStore((state) => state.logout);

  const callApi = async <T extends Object, U extends GrpcBaseResponse>(
    api: UnaryCall<T, U>,
    args?: callApiArgs<T, U>
  ) => {
    try {
      setIsLoading(true);
      const res = await api;

      if (res.response.baseResponse?.isError ?? true) {
        throw res;
      }

      return res;
    } catch (error) {
      if (error instanceof RpcError) {
        if (error.code === "UNAUTHENTICATED") {
          if (args?.useDefaultAuthError ?? true) {
            logoutUser();
            localStorage.removeItem("access_token");

            Swal.fire({
              icon: "warning",
              title: "Sesi Login Berakhir",
              text: "Silahkan login kembali",
            });

            navigate("/");
          }

          if (args?.useDefaultAuthError === false && args?.defaultAuthError) {
            args.defaultAuthError(error);
          }

          throw error;
        }
      }

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        args?.useDefaultError === false
      ) {
        if (args?.defaultError) {
          args.defaultError(error as FinishedUnaryCall<T, U>);
        }
      }

      if (args?.useDefaultError ?? true) {
        Swal.fire({
          icon: "error",
          title: "Terjadi Kesalahan",
          text: "Silahkan coba beberapa saat lagi",
        });
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, callApi };
};

export default useGrpcApi;
