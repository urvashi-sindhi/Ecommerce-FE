import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, Form, Badge } from "reactstrap";
import { addProduct } from "../../Api/productApi";
import { uploadFile } from "../../Api/LoginApi";
import { baseURLForImage } from "../../Api/AuthApi";
import BaseInput from "../../Components/Base/BaseInput";
import BaseButton from "../../Components/Base/BaseButton";
import BaseSelect from "../../Components/Base/BaseSelect";
import { toast } from "react-toastify";
import { productLabels } from "../../Components/constants/common";
import { getCategoryDropdown } from "../../Api/categoryApi";
import { FiArrowLeft } from "react-icons/fi";
import { PRODUCT } from "../../Routes/apiRoutes";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [product, setProduct] = useState({
    name: "",
    category_id: "",
    product_variants: [
      {
        product_title_name: "",
        description: "",
        color: "",
        size: "",
        price: "",
        quantity: "",
        variant_image: { image_path: "" },
      },
    ],
  });

  const [errors, setErrors] = useState({
    name: "",
    category_id: "",
    product_variants: [],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoryDropdown();

        const formattedCategories = response.data.map((category) => ({
          id: category.id,
          name: category.category_name,
        }));

        setCategoryOptions(formattedCategories);
      } catch (err) {
        toast.error(err.response.data.message);
        setCategoryOptions([]);
      }
    };
    fetchCategories();
  }, []);

  const handleVariantImageUpload = async (e, variantIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedVariants = [...product.product_variants];
    updatedVariants[variantIndex].variant_image = { image_path: "" };
    setProduct({ ...product, product_variants: updatedVariants });

    try {
      const response = await uploadFile(file);
      updatedVariants[variantIndex].variant_image.image_path = response.data[0];
      setProduct({ ...product, product_variants: updatedVariants });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === productLabels.CategoryId) {
      setProduct({ ...product, [name]: value });
    } else {
      setProduct({ ...product, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleVariantChange = (e, variantIndex) => {
    const { name, value } = e.target;
    const updatedVariants = [...product.product_variants];

    if (name === productLabels.price || name === productLabels.quantity) {
      updatedVariants[variantIndex][name] = value ? Number(value) : "";
    } else {
      updatedVariants[variantIndex][name] = value;
    }

    setProduct({ ...product, product_variants: updatedVariants });
  };

  const addVariant = () => {
    setProduct({
      ...product,
      product_variants: [
        ...product.product_variants,
        {
          product_title_name: `Variant ${product.product_variants.length + 1}`,
          description: "",
          color: "",
          size: "",
          price: "",
          quantity: "",
          variant_image: { image_path: "" },
        },
      ],
    });
  };

  const removeVariant = (index) => {
    const updatedVariants = [...product.product_variants];
    updatedVariants.splice(index, 1);
    setProduct({ ...product, product_variants: updatedVariants });
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      category_id: "",
      product_variants: [],
    };

    let isValid = true;

    if (!product.name.trim()) {
      newErrors.name = productLabels.NameRequired;
      isValid = false;
    }

    if (!product.category_id) {
      newErrors.category_id = productLabels.CategoryRequired;
      isValid = false;
    }

    product.product_variants.forEach((variant, index) => {
      newErrors.product_variants[index] = {};

      if (!variant.price || isNaN(variant.price)) {
        newErrors.product_variants[index].price = productLabels.PriceInvalid;
        isValid = false;
      }

      if (!variant.quantity || isNaN(variant.quantity)) {
        newErrors.product_variants[index].quantity =
          "Valid quantity is required";
        isValid = false;
      }

      if (!variant.product_title_name.trim()) {
        newErrors.product_variants[index].product_title_name =
          "Variant name is required";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        name: product.name,
        category_id: +product.category_id,
        product_variants: product.product_variants.map((variant) => ({
          product_title_name: variant.product_title_name,
          description: variant.description,
          color: variant.color,
          size: variant.size,
          price: variant.price,
          quantity: variant.quantity,
          variant_image: {
            image_path: variant.variant_image.image_path,
          },
        })),
      };

      const response = await addProduct(payload);
      toast.success(response.message);
      navigate(PRODUCT);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col lg="12">
            <Card>
              <CardBody>
                <div className="d-flex align-items-center mb-4 justify-content-between">
                  <h4 className="mb-0">{productLabels.AddTitle}</h4>
                  <BaseButton
                    color="danger"
                    onClick={() => navigate(PRODUCT)}
                    className="ms-2 back-button"
                  >
                    <FiArrowLeft />
                  </BaseButton>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col md={6}>
                      <BaseInput
                        label={productLabels.NameLabel}
                        name={productLabels.name}
                        value={product.name}
                        onChange={handleChange}
                        error={errors.name}
                        placeholder={productLabels.NamePlaceholder}
                        required
                      />
                    </Col>

                    <Col md={6}>
                      <div className="mb-2">
                        <label
                          className="form-label"
                          htmlFor={productLabels.CategoryId}
                        >
                          {productLabels.CategoryLabel}
                        </label>
                        <BaseSelect
                          id={productLabels.CategoryId}
                          name={productLabels.CategoryId}
                          value={product.category_id}
                          onChange={handleChange}
                          error={errors.category_id}
                          options={categoryOptions}
                          required
                        />
                      </div>
                    </Col>
                  </Row>

                  <div className="mb-4">
                    <h5 className="mb-3">Product Variants</h5>

                    {product.product_variants.map((variant, index) => (
                      <div
                        key={index}
                        className="variant-card mb-3 p-3 border rounded"
                      >
                        <Row>
                          <Col md={3}>
                            <BaseInput
                              label={productLabels.VariantTitle}
                              name={productLabels.product_title_name}
                              value={variant.product_title_name}
                              onChange={(e) => handleVariantChange(e, index)}
                              error={
                                errors.product_variants?.[index]
                                  ?.product_title_name
                              }
                              required
                            />
                          </Col>

                          <Col md={3}>
                            <BaseInput
                              label={productLabels.DescriptionLabel}
                              name={productLabels.description}
                              value={variant.description}
                              onChange={(e) => handleVariantChange(e, index)}
                            />
                          </Col>

                          <Col md={2}>
                            <BaseInput
                              label={productLabels.VariantColor}
                              name={productLabels.color}
                              value={variant.color}
                              onChange={(e) => handleVariantChange(e, index)}
                            />
                          </Col>

                          <Col md={2}>
                            <BaseInput
                              label={productLabels.VariantSize}
                              name={productLabels.size}
                              value={variant.size}
                              onChange={(e) => handleVariantChange(e, index)}
                            />
                          </Col>
                        </Row>

                        <Row className="mt-2">
                          <Col md={2}>
                            <BaseInput
                              label={productLabels.VariantPrice}
                              name={productLabels.price}
                              type="number"
                              value={variant.price}
                              onChange={(e) => handleVariantChange(e, index)}
                              error={errors.product_variants?.[index]?.price}
                              required
                            />
                          </Col>

                          <Col md={2}>
                            <BaseInput
                              label={productLabels.VariantStock}
                              name={productLabels.quantity}
                              type="number"
                              value={variant.quantity}
                              onChange={(e) => handleVariantChange(e, index)}
                              error={errors.product_variants?.[index]?.quantity}
                              required
                            />
                          </Col>

                          <Col md={4}>
                            <div className="mb-3">
                              <label className="form-label">
                                {productLabels.VariantImage}
                              </label>
                              <input
                                type="file"
                                className="form-control"
                                onChange={(e) =>
                                  handleVariantImageUpload(e, index)
                                }
                                accept="image/*"
                              />
                              {variant.variant_image.image_path && (
                                <div className="mt-2">
                                  <img
                                    src={`${baseURLForImage}${variant.variant_image.image_path}`}
                                    alt="Variant"
                                    style={{
                                      maxWidth: "50px",
                                      maxHeight: "50px",
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </Col>

                          <Col md={2} className="d-flex align-items-end">
                            <BaseButton
                              color="danger"
                              size="sm"
                              type="button"
                              onClick={() => removeVariant(index)}
                              disabled={product.product_variants.length <= 1}
                            >
                              Remove
                            </BaseButton>
                          </Col>
                        </Row>
                      </div>
                    ))}

                    <BaseButton
                      color="secondary"
                      type="button"
                      onClick={addVariant}
                      className="mb-3"
                    >
                      Add Another Variant
                    </BaseButton>
                  </div>

                  <div className="d-flex justify-content-end">
                    <BaseButton
                      color="secondary"
                      className="me-2"
                      onClick={() => navigate(PRODUCT)}
                    >
                      {productLabels.CancelButton}
                    </BaseButton>

                    <BaseButton
                      color="primary"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : productLabels.SaveButton}
                    </BaseButton>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddProduct;
