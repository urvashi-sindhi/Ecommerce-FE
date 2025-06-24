import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Badge,
  CardHeader,
} from "reactstrap";
import { viewProduct } from "../../Api/productApi";
import { baseURLForImage } from "../../Api/AuthApi";
import BaseButton from "../../Components/Base/BaseButton";
import { toast } from "react-toastify";
import { FiArrowLeft } from "react-icons/fi";
import { PRODUCT } from "../../Routes/apiRoutes";
import BaseLoader from "../../Components/Base/BaseLoader";

const ViewProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await viewProduct(id);
        setProduct(response.data);
      } catch (err) {
        toast.error(err.response?.data?.message);
        navigate(PRODUCT);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="page-content d-flex justify-content-center align-items-center">
        <BaseLoader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>Product Not Found</h4>
            <BaseButton
              color="danger"
              onClick={() => navigate(PRODUCT)}
              className="ms-2 back-button"
            >
              <FiArrowLeft />
            </BaseButton>
          </div>
          <p>The product you are looking for does not exist.</p>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>Product Details</h4>
          <BaseButton
            color="danger"
            onClick={() => navigate(PRODUCT)}
            className="ms-2 back-button"
          >
            <FiArrowLeft />
          </BaseButton>
        </div>

        <Card className="mb-4">
          <CardHeader>
            <h5 className="mb-0">Product</h5>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={6}>
                <p className="mb-0">
                  <span className="text-muted">Product Name: </span>
                  {product.name}
                </p>
              </Col>
              <Col md={6}>
                <p className="mb-0">
                  <span className="text-muted">Category: </span>
                  <Badge color="info">{product.category?.category_name}</Badge>
                </p>
              </Col>
            </Row>
          </CardBody>
        </Card>

        <h5 className="mb-3">Product Variants</h5>
        {product.variants && product.variants.length > 0 ? (
          product.variants.map((variant, index) => (
            <Card key={index} className="mb-3">
              <CardBody>
                <Row className="align-items-center">
                  <Col md={2}>
                    {variant.image?.image_path ? (
                      <img
                        src={`${baseURLForImage}${variant.image.image_path}`}
                        alt={variant.product_title_name}
                        className="img-fluid rounded product-variant-image"
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center bg-light rounded product-variant-no-image">
                        <p className="text-muted">No Image</p>
                      </div>
                    )}
                  </Col>
                  <Col md={10}>
                    <h5 className="mt-0 mb-3">{variant.product_title_name}</h5>
                    <p className="mb-2">
                      <strong>Price:</strong>{" "}
                      <span className="text-success">₹{variant.price}</span>
                      <strong className="ms-4">Color:</strong>{" "}
                      {variant.color || "N/A"}
                    </p>
                    <p className="text-muted mb-2">{variant.description}</p>
                    <Row>
                      <Col sm={4}>
                        <p className="mb-1">
                          <strong>ID:</strong>{" "}
                          <Badge color="secondary">{variant.id}</Badge>
                        </p>
                      </Col>
                      <Col sm={4}>
                        <p className="mb-1">
                          <strong>Size:</strong> {variant.size || "N/A"}
                        </p>
                      </Col>
                      <Col sm={4}>
                        <p className="mb-1">
                          <strong>Quantity:</strong> {variant.quantity}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          ))
        ) : (
          <p>No variants found for this product.</p>
        )}
      </Container>
    </div>
  );
};

export default ViewProduct;
