import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { authInterceptor } from "./auth-interceptor";
import {
  AuthServiceClient,
  IAuthServiceClient,
} from "../../../pb/auth/auth.client";
import {
  IProductServiceClient,
  ProductServiceClient,
} from "../../../pb/product/product.client";

let webTrasnport: GrpcWebFetchTransport | null = null;
let authClient: IAuthServiceClient | null = null;
let productClient: IProductServiceClient | null = null;

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

export const getProductClient = () => {
  if (productClient === null) {
    productClient = new ProductServiceClient(getWebTransport());
  }

  return productClient;
};
