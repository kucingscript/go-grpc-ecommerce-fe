import React, { useEffect, useState } from "react";
import useSortableHeader from "../../hooks/useSortableHeader";
import SortableHeader from "../SortableHeader/SortableHeader";
import Pagination from "../Pagination/Pagination";
import { Link } from "react-router-dom";
import useGrpcApi from "../../hooks/useGrpcApi";
import { getProductClient } from "../../api/grpc/client";
import { formatToIDR } from "../../utils/number";
import Swal from "sweetalert2";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

function AdminProductListSection() {
  const deleteApi = useGrpcApi();
  const listApi = useGrpcApi();

  const [items, setItems] = useState<Product[]>([]);
  const { handleSort, sortConfig } = useSortableHeader();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [refreshFlag, setRefreshFlag] = useState<boolean>(true);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Produk yang dihapus tidak dapat dikembalikan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    });

    if (result.isConfirmed) {
      await deleteApi.callApi(getProductClient().deleteProduct({ id: id }));
    }

    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Produk berhasil dihapus",
    });

    setRefreshFlag((value) => !value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await listApi.callApi(
        getProductClient().listProductAdmin({
          pagination: {
            currentPage: currentPage,
            itemPerPage: 10,
            sort: sortConfig.direction
              ? {
                  direction: sortConfig.direction,
                  field: sortConfig.key,
                }
              : undefined,
          },
        })
      );

      setItems(
        res.response.data.map((d) => ({
          id: d.id,
          name: d.name,
          price: d.price,
          description: d.description,
          imageUrl: d.imageUrl,
        }))
      );

      setTotalPages(res.response.pagination?.totalPageCount ?? 0);
    };

    fetchData();
  }, [currentPage, sortConfig.direction, sortConfig.key, refreshFlag]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title">Produk</h2>
        <Link to="/admin/products/create">
          <button className="btn btn-primary">Tambah Produk</button>
        </Link>
      </div>
      <div className="table-responsive">
        <table className="table site-blocks-table">
          <thead>
            <tr>
              <th>Gambar</th>
              <SortableHeader
                label="Nama Produk"
                sortKey="name"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <SortableHeader
                label="Harga"
                sortKey="price"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <SortableHeader
                label="Deskripsi"
                sortKey="description"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td>
                  <img src={i.imageUrl} width="50" alt="Produk" />
                </td>
                <td>{i.name}</td>
                <td>{formatToIDR(i.price)}</td>
                <td>
                  <p>{i.description}</p>
                </td>
                <td>
                  <Link to={`/admin/products/${i.id}/edit`}>
                    <button className="btn btn-secondary me-2">Edit</button>
                  </Link>
                  <button className="btn" onClick={() => handleDelete(i.id)}>
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default AdminProductListSection;
