import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Pagination,
  PaginationItem,
  PaginationLink,
  Badge,
} from "reactstrap";
import { useEffect, useState } from "react";
import { listOfProduct, deleteProduct } from "../../Api/productApi";
import { debounce } from "lodash";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import BaseTable from "../../Components/Base/BaseTable";
import BaseInput from "../../Components/Base/BaseInput";
import BaseButton from "../../Components/Base/BaseButton";
import BaseModal from "../../Components/Base/BaseModal";
import BaseLoader from "../../Components/Base/BaseLoader";
import BaseSelect from "../../Components/Base/BaseSelect";
import { toast } from "react-toastify";
import { productLabels } from "../../Components/constants/common";
import { InputPlaceHolder } from "../../Components/constants/validation";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
    pageSize: 10,
    totalItems: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    sortKey: "",
    sortValue: "",
    pageSize: 10,
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const payload = {
        page,
        pageSize: filters.pageSize,
        sortKey: filters.sortKey,
        sortValue: filters.sortValue,
        search: filters.search,
      };
      const response = await listOfProduct(payload);
      setProducts(response.data.products || []);
      setPagination({
        currentPage: response.data.currentPage,
        totalPage: response.data.totalPage,
        pageSize: response.data.pageSize,
        totalItems: response.data.totalItems,
      });
    } catch (err) {
      toast.error(err.response?.data?.message);
      if (
        err.response &&
        err.response.data &&
        err.response.data.message.includes("Product not found")
      ) {
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [filters]);

  const handlePageChange = (page) => {
    fetchProducts(page);
  };

  const handleSearch = debounce((value) => {
    setFilters((prev) => ({
      ...prev,
      search: value,
      currentPage: 1,
    }));
  }, 500);

  const handlePageSizeChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      pageSize: Number(e.target.value),
      currentPage: 1,
    }));
  };

  const handleSort = (columnKey) => {
    setFilters((prev) => {
      const newSortValue =
        prev.sortKey === columnKey && prev.sortValue === "asc"
          ? "desc"
          : prev.sortKey === columnKey && prev.sortValue === "desc"
          ? ""
          : "asc";
      return {
        ...prev,
        sortKey: newSortValue === "" ? "" : columnKey,
        sortValue: newSortValue,
        currentPage: 1,
      };
    });
  };

  const openDeleteModal = (id) => {
    setDeleteProductId(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleDeleteProduct = async () => {
    setDeleteLoading(true);
    try {
      const response = await deleteProduct(deleteProductId);
      setDeleteModalOpen(false);
      fetchProducts(1);
      toast.success(response.message);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderPagination = () => {
    const { currentPage, totalPage } = pagination;
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPage, currentPage + 2);

    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(totalPage, startPage + 4);
      } else if (endPage === totalPage) {
        startPage = Math.max(1, endPage - 4);
      }
    }

    if (startPage > 1) {
      pageNumbers.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        pageNumbers.push(
          <PaginationItem key="start-ellipsis" disabled>
            <PaginationLink>...</PaginationLink>
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PaginationItem key={i} active={i === currentPage}>
          <PaginationLink onClick={() => handlePageChange(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPage) {
      if (endPage < totalPage - 1) {
        pageNumbers.push(
          <PaginationItem key="end-ellipsis" disabled>
            <PaginationLink>...</PaginationLink>
          </PaginationItem>
        );
      }
      pageNumbers.push(
        <PaginationItem key={totalPage}>
          <PaginationLink onClick={() => handlePageChange(totalPage)}>
            {totalPage}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return [
      <PaginationItem key="prev" disabled={currentPage === 1}>
        <PaginationLink
          previous
          onClick={() => handlePageChange(currentPage - 1)}
        />
      </PaginationItem>,
      ...pageNumbers,
      <PaginationItem key="next" disabled={currentPage === totalPage}>
        <PaginationLink
          next
          onClick={() => handlePageChange(currentPage + 1)}
        />
      </PaginationItem>,
    ];
  };

  const SortIcon = ({ column }) => {
    if (filters.sortKey !== column) return null;
    return filters.sortValue === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col lg="12">
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">{productLabels.PageTitle}</h4>
                  <Link to="/product/add" className="btn btn-success">
                    {productLabels.NewButton}
                  </Link>
                </div>

                <Row className="mb-3 align-items-center">
                  <Col md="6" className="d-flex align-items-center">
                    <label
                      htmlFor={productLabels.pageSize}
                      className="mb-0 me-2"
                    >
                      {productLabels.ItemsPerPageLabel}
                    </label>
                    <BaseSelect
                      id={productLabels.pageSize}
                      className="w-auto"
                      name={productLabels.pageSize}
                      value={filters.pageSize}
                      onChange={handlePageSizeChange}
                      options={[
                        { value: 5, name: "5" },
                        { value: 10, name: "10" },
                        { value: 20, name: "20" },
                        { value: 50, name: "50" },
                        { value: 100, name: "100" },
                      ]}
                      defaultText={productLabels.SelectPlaceholder}
                    />
                  </Col>
                  <Col
                    md="6"
                    className="d-flex justify-content-end align-items-center"
                  >
                    <BaseInput
                      type="text"
                      name={productLabels.search}
                      placeholder={InputPlaceHolder(
                        productLabels.SearchPlaceholder
                      )}
                      className="search-input-max-width"
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </Col>
                </Row>

                {loading ? (
                  <div className="d-flex justify-content-center py-4">
                    <BaseLoader size="md" />
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-5">
                    <h4 className="text-primary">Sorry! No Result Found</h4>
                    <p className="text-muted">
                      Try searching with another keyword!
                    </p>
                  </div>
                ) : (
                  <>
                    <BaseTable
                      columns={[
                        {
                          key: "name",
                          title: productLabels.ProductName,
                          sortable: true,
                          onHeaderClick: handleSort,
                          sortIcon: () => <SortIcon column="name" />,
                          headerClassName:
                            filters.sortKey === "name"
                              ? "cursor-default-arrow"
                              : "cursor-default-arrow",
                        },
                        {
                          key: "category",
                          title: productLabels.CategoryLabel,
                          render: (row) => row.category?.category_name || "N/A",
                          sortable: true,
                          onHeaderClick: handleSort,
                          sortIcon: () => <SortIcon column="category" />,
                          headerClassName:
                            filters.sortKey === "category"
                              ? "cursor-default-arrow"
                              : "cursor-default-arrow",
                        },
                      ]}
                      data={products}
                      actions={(product) => (
                        <>
                          <Link
                            to={`/product/view/${product.id}`}
                            className="btn btn-info btn-sm me-2"
                          >
                            <FaEye />
                          </Link>
                          <Link
                            to={`/product/edit/${product.id}`}
                            className="btn btn-primary btn-sm me-2"
                          >
                            <FaEdit />
                          </Link>
                          <BaseButton
                            color="danger"
                            size="sm"
                            onClick={() => openDeleteModal(product.id)}
                            startIcon={<FaTrash />}
                          />
                        </>
                      )}
                    />

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="text-muted ms-2">
                        {`Showing ${
                          pagination.totalItems === 0
                            ? 0
                            : (pagination.currentPage - 1) *
                                pagination.pageSize +
                              1
                        } to ${Math.min(
                          pagination.currentPage * pagination.pageSize,
                          pagination.totalItems
                        )} of ${pagination.totalItems} Results`}
                      </div>
                      <Pagination>{renderPagination()}</Pagination>
                    </div>
                  </>
                )}

                <BaseModal
                  isOpen={deleteModalOpen}
                  toggle={closeDeleteModal}
                  title={productLabels.DeleteProductModalTitle}
                  confirmButtonLabel={
                    deleteLoading
                      ? productLabels.DeletingMessage
                      : productLabels.YesButton
                  }
                  cancelButtonLabel={productLabels.CancelButton}
                  confirmButtonColor="danger"
                  cancelButtonColor="secondary"
                  onConfirm={handleDeleteProduct}
                  isConfirmDisabled={deleteLoading}
                  hideFooter={false}
                >
                  <div>{productLabels.DeleteMessage}</div>
                </BaseModal>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Products;
