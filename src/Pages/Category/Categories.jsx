import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { useEffect, useState } from "react";
import {
  listOfCategory,
  addCategory,
  viewCategory,
  editCategory,
  deleteCategory,
} from "../../Api/categoryApi";
import { debounce } from "lodash";
import { FaEdit, FaTrash } from "react-icons/fa";
import { uploadFile } from "../../Api/LoginApi";
import { baseURLForImage } from "../../Api/AuthApi";
import BaseTable from "../../Components/Base/BaseTable";
import BaseInput from "../../Components/Base/BaseInput";
import BaseButton from "../../Components/Base/BaseButton";
import BaseModal from "../../Components/Base/BaseModal";
import BaseLoader from "../../Components/Base/BaseLoader";
import BaseSelect from "../../Components/Base/BaseSelect";
import { toast } from "react-toastify";
import { categoryLabels } from "../../Components/constants/common";
import {
  InputPlaceHolder,
  validationMessages,
} from "../../Components/constants/validation";

const Categories = () => {
  const [categories, setCategories] = useState([]);
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

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [categoryId, setCategoryId] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    category_name: "",
    description: "",
    category_image: "",
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);

  const [categoryNameTouched, setCategoryNameTouched] = useState(false);
  const [categoryNameError, setCategoryNameError] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  const fetchCategories = async (page = 1) => {
    try {
      setLoading(true);
      const payload = {
        page,
        pageSize: filters.pageSize,
        sortKey: filters.sortKey,
        sortValue: filters.sortValue,
        search: filters.search,
      };
      const response = await listOfCategory(payload);
      setCategories(response.data.categories || []);
      setPagination({
        currentPage: response.data.currentPage,
        totalPage: response.data.totalPage,
        pageSize: response.data.pageSize,
        totalItems: response.data.totalItems,
      });
    } catch (err) {
      toast.error(err.response.data.message);
      if (
        err.response &&
        err.response.data &&
        err.response.data.message.includes("Category not found")
      ) {
        setCategories([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(1);
  }, [filters]);

  const handlePageChange = (page) => {
    fetchCategories(page);
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

  const openAddModal = () => {
    setModalMode("add");
    setCategoryId(null);
    setCategoryForm({ category_name: "", description: "", category_image: "" });
    setImagePreview(null);
    setImageUploading(false);
    setImageUploadError(null);
    setCategoryNameTouched(false);
    setCategoryNameError("");
    setModalOpen(true);
  };

  const openEditModal = async (id) => {
    setModalMode("edit");
    setCategoryId(id);
    setImagePreview(null);
    setImageUploading(false);
    setImageUploadError(null);
    setModalLoading(true);
    setCategoryNameTouched(false);
    setCategoryNameError("");
    setModalOpen(true);
    try {
      const response = await viewCategory(id);
      const filename = response.data.category_image || "";
      setCategoryForm({
        category_name: response.data.category_name || "",
        description: response.data.description || "",
        category_image: filename,
      });
      setImagePreview(filename ? `${baseURLForImage}${filename}` : null);
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setModalLoading(false);
    }
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({ ...prev, [name]: value }));

    if (name === categoryLabels.category_name) {
      if (value.trim() === "") {
        setCategoryNameError(
          validationMessages.required(categoryLabels.CategoryName)
        );
      } else {
        setCategoryNameError("");
      }
      setCategoryNameTouched(true);
    }
  };

  const handleCategoryNameBlur = () => {
    if (categoryForm.category_name.trim() === "") {
      setCategoryNameError(
        validationMessages.required(categoryLabels.CategoryName)
      );
    } else {
      setCategoryNameError("");
    }
    setCategoryNameTouched(true);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setImageUploadError(null);
    if (file) {
      setImageUploading(true);
      try {
        const uploadResponse = await uploadFile(file);
        const filename = uploadResponse.data[0];
        setCategoryForm((prev) => ({ ...prev, category_image: filename }));
        setImagePreview(`${baseURLForImage}${filename}`);
      } catch (err) {
        setImageUploadError(err.message);
        setCategoryForm((prev) => ({ ...prev, category_image: "" }));
        setImagePreview(null);
      } finally {
        setImageUploading(false);
      }
    } else {
      setCategoryForm((prev) => ({ ...prev, category_image: "" }));
      setImagePreview(null);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);

    if (categoryForm.category_name.trim() === "") {
      setCategoryNameError(
        validationMessages.required(categoryLabels.CategoryName)
      );
      setCategoryNameTouched(true);
      setModalLoading(false);
      return;
    }

    try {
      if (modalMode === "add") {
        const response = await addCategory({
          category_name: categoryForm.category_name,
          category_image: categoryForm.category_image,
          description: categoryForm.description,
        });

        toast.success(response.message);
      } else if (modalMode === "edit" && categoryId) {
        const response = await editCategory(categoryId, {
          category_name: categoryForm.category_name,
          category_image: categoryForm.category_image,
          description: categoryForm.description,
        });
        toast.success(response.message);
      }
      setModalOpen(false);
      fetchCategories(1);
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setModalLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteCategoryId(id);
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };
  const handleDeleteCategory = async () => {
    setDeleteLoading(true);
    try {
      const response = await deleteCategory(deleteCategoryId);
      setDeleteModalOpen(false);
      fetchCategories(1);
      toast.success(response.message);
    } catch (err) {
      toast.error(err.response.data.message);
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
                  <h4 className="mb-0">{categoryLabels.PageTitle}</h4>
                  <button className="btn btn-success" onClick={openAddModal}>
                    {categoryLabels.NewButton}
                  </button>
                </div>

                <Row className="mb-3 align-items-center">
                  <Col md="6" className="d-flex align-items-center">
                    <label
                      htmlFor={categoryLabels.pageSize}
                      className="mb-0 me-2"
                    >
                      {categoryLabels.ItemsPerPageLabel}
                    </label>
                    <BaseSelect
                      id={categoryLabels.pageSize}
                      className="w-auto"
                      name={categoryLabels.pageSize}
                      value={filters.pageSize}
                      onChange={handlePageSizeChange}
                      options={[
                        { value: 5, name: "5" },
                        { value: 10, name: "10" },
                        { value: 20, name: "20" },
                        { value: 50, name: "50" },
                        { value: 100, name: "100" },
                      ]}
                      defaultText={categoryLabels.SelectPlaceholder}
                    />
                  </Col>
                  <Col
                    md="6"
                    className="d-flex justify-content-end align-items-center"
                  >
                    <BaseInput
                      type="text"
                      name={categoryLabels.search}
                      placeholder={InputPlaceHolder(
                        categoryLabels.SearchPlaceholder
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
                ) : categories.length === 0 ? (
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
                          key: categoryLabels.category_name,
                          title: categoryLabels.CategoryName,
                          sortable: true,
                          onHeaderClick: handleSort,
                          sortIcon: () => (
                            <SortIcon column={categoryLabels.category_name} />
                          ),
                          headerClassName:
                            filters.sortKey === categoryLabels.category_name
                              ? "cursor-default-arrow"
                              : "cursor-default-arrow",
                        },
                        {
                          key: categoryLabels.description,
                          title: categoryLabels.DescriptionLabel,
                          sortable: true,
                          onHeaderClick: handleSort,
                          sortIcon: () => (
                            <SortIcon column={categoryLabels.description} />
                          ),
                          headerClassName:
                            filters.sortKey === categoryLabels.description
                              ? "cursor-default-arrow"
                              : "cursor-default-arrow",
                        },
                        {
                          key: categoryLabels.created_at,
                          title: categoryLabels.DateLabel,
                          sortable: true,
                          onHeaderClick: handleSort,
                          sortIcon: () => (
                            <SortIcon column={categoryLabels.created_at} />
                          ),
                          headerClassName:
                            filters.sortKey === categoryLabels.created_at
                              ? "cursor-default-arrow"
                              : "cursor-default-arrow",
                          render: (row) =>
                            new Date(row.created_at).toLocaleDateString(),
                        },
                      ]}
                      data={categories}
                      actions={(category) => (
                        <>
                          <BaseButton
                            color="primary"
                            size="sm"
                            className="me-2"
                            onClick={() => openEditModal(category.id)}
                            startIcon={<FaEdit />}
                          />
                          <BaseButton
                            color="danger"
                            size="sm"
                            onClick={() => openDeleteModal(category.id)}
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

                {/* Add/Edit Category Modal */}
                <BaseModal
                  isOpen={modalOpen}
                  toggle={closeModal}
                  title={
                    modalMode === "add"
                      ? categoryLabels.AddCategoryModalTitle
                      : categoryLabels.EditCategoryModalTitle
                  }
                  hideFooter={true}
                >
                  <form onSubmit={handleModalSubmit}>
                    <>
                      <BaseInput
                        label={categoryLabels.CategoryName}
                        id={categoryLabels.category_name}
                        name={categoryLabels.category_name}
                        value={categoryForm.category_name}
                        onChange={handleInputChange}
                        onBlur={handleCategoryNameBlur}
                        error={categoryNameError}
                        touched={categoryNameTouched}
                        required
                      />
                      <BaseInput
                        label={categoryLabels.DescriptionLabel}
                        id={categoryLabels.description}
                        name={categoryLabels.description}
                        value={categoryForm.description}
                        onChange={handleInputChange}
                      />
                      <BaseInput
                        label={categoryLabels.CategoryImageLabel}
                        id={categoryLabels.category_image}
                        name={categoryLabels.category_image}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {imageUploading && (
                        <div>{categoryLabels.UploadingImageMessage}</div>
                      )}
                      {imageUploadError && (
                        <div className="text-danger">{imageUploadError}</div>
                      )}
                      {imagePreview && (
                        <div className="mt-2">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="category-image-preview"
                          />
                        </div>
                      )}
                      <div className="d-flex justify-content-end mt-3">
                        <BaseButton
                          color="secondary"
                          onClick={closeModal}
                          disabled={modalLoading || imageUploading}
                          className="me-2"
                        >
                          {categoryLabels.CancelButton}
                        </BaseButton>
                        <BaseButton
                          color="primary"
                          type="submit"
                          disabled={modalLoading || imageUploading}
                          loader={modalLoading || imageUploading}
                        >
                          {modalMode === "add"
                            ? categoryLabels.AddCategoryButton
                            : categoryLabels.SaveChangesButton}
                        </BaseButton>
                      </div>
                    </>
                  </form>
                </BaseModal>

                {/* Delete Confirmation Modal */}
                <BaseModal
                  isOpen={deleteModalOpen}
                  toggle={closeDeleteModal}
                  title={categoryLabels.DeleteCategoryModalTitle}
                  confirmButtonLabel={
                    deleteLoading
                      ? categoryLabels.DeletingMessage
                      : categoryLabels.YesButton
                  }
                  cancelButtonLabel={categoryLabels.CancelButton}
                  confirmButtonColor="danger"
                  cancelButtonColor="secondary"
                  onConfirm={handleDeleteCategory}
                  isConfirmDisabled={deleteLoading}
                  hideFooter={false}
                >
                  <div>{categoryLabels.DeleteMessage}</div>
                </BaseModal>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Categories;
