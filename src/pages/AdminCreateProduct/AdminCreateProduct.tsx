import Swal from "sweetalert2";
import { getProductClient } from "../../api/grpc/client";
import PlainHeroSection from "../../components/PlainHeroSection/PlainHeroSection";
import ProductForm from "../../components/ProductForm/ProductForm";
import useGrpcApi from "../../hooks/useGrpcApi";
import { type ProductFormValues } from "../../types/product";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

interface UploadImageResponse {
  file_name: string;
  message: string;
  success: string;
}

function AdminCreateProduct() {
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const createProductApi = useGrpcApi();
  const navigate = useNavigate();

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      setUploadLoading(true);
      const formData = new FormData();
      formData.append("image", data.image[0]);

      const uploadResponse = await axios.post<UploadImageResponse>(
        "http://127.0.0.1:8000/product/upload",
        formData
      );
      if (uploadResponse.status !== 200) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Produk gagal ditambahkan",
        });
        return;
      }

      await createProductApi.callApi(
        getProductClient().createProduct({
          name: data.name,
          price: data.price,
          description: data.description,
          imageFileName: uploadResponse.data.file_name,
        })
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Produk berhasil ditambahkan",
      });

      navigate("/admin/products");
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <>
      <PlainHeroSection title="Tambah Produk" />

      <div className="untree_co-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <ProductForm
                onSubmit={handleSubmit}
                disabled={createProductApi.isLoading || uploadLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminCreateProduct;
