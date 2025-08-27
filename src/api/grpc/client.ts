import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import {
  AuthServiceClient,
  IAuthServiceClient,
} from "../../../pb/auth/auth.client";
import { authInterceptor } from "./auth-interceptor";

let webTrasnport: GrpcWebFetchTransport | null = null;
let authClient: IAuthServiceClient | null = null;

const getWebTransport = () => {
  if (webTrasnport === null) {
    webTrasnport = new GrpcWebFetchTransport({
      baseUrl: "http://localhost:8080",
      interceptors: [authInterceptor],
    });
  }

  return webTrasnport;
};

export const getAuthClient = () => {
  if (authClient === null) {
    authClient = new AuthServiceClient(getWebTransport());
  }

  return authClient;
};
