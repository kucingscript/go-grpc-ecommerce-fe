import ProductHighlightSection from "../../components/ProductHighlightSection/ProductHighlightSection";
import PlainHeroSection from "../../components/PlainHeroSection/PlainHeroSection";
import { Link } from "react-router-dom";
import useGrpcApi from "../../hooks/useGrpcApi";
import { useEffect, useRef, useState } from "react";
import { getCartClient } from "../../api/grpc/client";
import { formatToIDR } from "../../utils/number";

interface CartItem {
  id: string;
  product_name: string;
  product_id: string;
  product_price: number;
  product_image_url: string;
  quantity: number;
  total: number;
}

function Cart() {
  const listApi = useGrpcApi();
  const deleteApi = useGrpcApi();
  const updateQuantityApi = useGrpcApi();
  const timeoutRef = useRef<Record<string, number>>({});

  const [items, setItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const fetchData = async () => {
    const res = await listApi.callApi(getCartClient().listCart({}));
    const newItems = res.response.items.map<CartItem>((item) => ({
      id: item.cartId,
      product_name: item.productName,
      product_id: item.productId,
      product_price: item.productPrice,
      product_image_url: item.productImageUrl,
      quantity: Number(item.quantity),
      total: item.productPrice * Number(item.quantity),
    }));

    setItems(newItems);
    setTotalPrice(newItems.reduce((acc, item) => acc + item.total, 0));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deletCartItemHandler = async (cartId: string) => {
    await deleteApi.callApi(getCartClient().deleteCart({ cartId }));
    await fetchData();
  };

  const updateCartQuantityHandler = async (
    cartId: string,
    action: "inc" | "dec"
  ) => {
    let newQuantity = 0;
    let newItems = items.map((item) => {
      if (item.id === cartId) {
        newQuantity = action === "inc" ? item.quantity + 1 : item.quantity - 1;
        return {
          ...item,
          quantity: newQuantity,
          total: item.product_price * newQuantity,
        };
      }

      return item;
    });

    newItems = newItems.filter((item) => item.quantity > 0);

    setItems(newItems);
    setTotalPrice(newItems.reduce((acc, item) => acc + item.total, 0));

    if (newQuantity < 0) return;

    clearTimeout(timeoutRef.current[cartId]);
    timeoutRef.current[cartId] = setTimeout(async () => {
      await updateQuantityApi.callApi(
        getCartClient().updateCartQuantity({
          cartId,
          newQuantity: BigInt(newQuantity),
        })
      );
    }, 300);
  };

  return (
    <>
      <PlainHeroSection title="Keranjang Belanja" />

      <div className="untree_co-section before-footer-section">
        <div className="container">
          {items.length > 0 && (
            <div className="row mb-5">
              <div className="site-blocks-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="product-thumbnail">Gambar</th>
                      <th className="product-name">Produk</th>
                      <th className="product-price">Harga</th>
                      <th className="product-quantity">Kuantitas</th>
                      <th className="product-total">Total</th>
                      <th className="product-remove">Hapus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="product-thumbnail">
                          <img
                            src={item.product_image_url}
                            alt={item.product_name}
                            className="img-fluid"
                          />
                        </td>
                        <td className="product-name">
                          <h2 className="h5 text-black">{item.product_name}</h2>
                        </td>
                        <td>{formatToIDR(item.product_price)}</td>
                        <td>
                          <div
                            className="input-group mb-3 d-flex align-items-center quantity-container"
                            style={{ maxWidth: 120 }}
                          >
                            <div className="input-group-prepend">
                              <button
                                className="btn btn-outline-black decrease"
                                type="button"
                                onClick={() =>
                                  updateCartQuantityHandler(item.id, "dec")
                                }
                              >
                                -
                              </button>
                            </div>
                            <input
                              type="text"
                              className="form-control text-center quantity-amount"
                              value={item.quantity}
                              disabled
                            />
                            <div className="input-group-append">
                              <button
                                className="btn btn-outline-black increase"
                                type="button"
                                onClick={() =>
                                  updateCartQuantityHandler(item.id, "inc")
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </td>
                        <td>{formatToIDR(item.total)}</td>
                        <td>
                          <div
                            className="btn btn-black btn-sm"
                            onClick={() => deletCartItemHandler(item.id)}
                          >
                            X
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {items.length === 0 && (
            <h3 className="text-center text-black mb-5">
              Keranjang belanja kosong
            </h3>
          )}

          <div className="row">
            <div className="col-md-6">
              <div className="row mb-5">
                <div className="col-md-6">
                  <Link to="/shop">
                    <button className="btn btn-outline-black btn-sm btn-block">
                      Lanjut Belanja
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-6 pl-5">
              <div className="row justify-content-end">
                <div className="col-md-7">
                  <div className="row">
                    <div className="col-md-12 text-right border-bottom mb-5">
                      <h3 className="text-black h4 text-uppercase">
                        Total Keranjang
                      </h3>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <span className="text-black">Subtotal</span>
                    </div>
                    <div className="col-md-6 text-right">
                      <strong className="text-black">
                        {formatToIDR(totalPrice)}
                      </strong>
                    </div>
                  </div>
                  <div className="row mb-5">
                    <div className="col-md-6">
                      <span className="text-black">Total</span>
                    </div>
                    <div className="col-md-6 text-right">
                      <strong className="text-black">
                        {formatToIDR(totalPrice)}
                      </strong>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      {items.length > 0 && (
                        <Link to="/checkout">
                          <button className="btn btn-black btn-lg py-3 btn-block">
                            Lanjutkan ke Pembayaran
                          </button>
                        </Link>
                      )}

                      {items.length === 0 && (
                        <button
                          className="btn btn-black btn-lg py-3 btn-block"
                          disabled
                        >
                          Lanjutkan ke Pembayaran
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductHighlightSection beforeFooter />
    </>
  );
}

export default Cart;
