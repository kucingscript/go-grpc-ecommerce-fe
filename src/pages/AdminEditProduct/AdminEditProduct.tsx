import Swal from "sweetalert2";
import { getProductClient } from "../../api/grpc/client";
import PlainHeroSection from "../../components/PlainHeroSection/PlainHeroSection";
import ProductForm from "../../components/ProductForm/ProductForm";
import useGrpcApi from "../../hooks/useGrpcApi";
import { type ProductFormValues } from "../../types/product";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

interface UploadImageResponse {
  file_name: string;
  message: string;
  success: string;
}

function AdminEditProduct() {
  const { id } = useParams();

  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [defaultValues, setDefaultValues] = useState<
    ProductFormValues | undefined
  >(undefined);

  const detailApi = useGrpcApi();
  const editProductApi = useGrpcApi();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      const res = await detailApi.callApi(
        getProductClient().detailProduct({
          id: id ?? "",
        })
      );

      setDefaultValues({
        name: res.response.name,
        price: res.response.price,
        description: res.response.description,
        image: new DataTransfer().files,
        imageUrl: res.response.imageUrl,
      });
    };

    fetchDetail();
  }, []);

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      let newImageFileName = "";
      if (data.image.length > 0) {
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

        newImageFileName = uploadResponse.data.file_name;
      }

      await editProductApi.callApi(
        getProductClient().editProduct({
          id: id ?? "",
          name: data.name,
          price: data.price,
          description: data.description,
          imageFileName:
            newImageFileName || (data.imageUrl?.split("/").pop() ?? ""),
        })
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Produk berhasil diperbarui",
      });

      navigate("/admin/products");
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <>
      <PlainHeroSection title="Edit Produk" />

      <div className="untree_co-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <ProductForm
                onSubmit={handleSubmit}
                disabled={
                  editProductApi.isLoading ||
                  uploadLoading ||
                  detailApi.isLoading
                }
                defaultValues={defaultValues}
                isEdit
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminEditProduct;
