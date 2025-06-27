import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import BaseTable from "../../Components/Base/BaseTable";
import BaseInput from "../../Components/Base/BaseInput";
import BaseSelect from "../../Components/Base/BaseSelect";
import BaseLoader from "../../Components/Base/BaseLoader";
import { getOrderReport } from "../../Api/reportApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const getCurrentYearRange = () => {
  const now = new Date();
  const year = now.getFullYear();
  const start = new Date(`${year}-01-01`);
  const end = new Date(`${year}-12-31`);
  return { start, end };
};

const { start: defaultStartDate, end: defaultEndDate } = getCurrentYearRange();

const OrderReport = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orders, setOrders] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
  };

  const fetchOrders = async (
    page = 1,
    searchValue = search,
    limit = pageSize,
    start = startDate,
    end = endDate
  ) => {
    try {
      setLoading(true);
      const payload = {
        search: searchValue,
        limit,
        page,
        sortValue: "asc",
        sortKey: "id",
        startDate: formatDate(start),
        endDate: formatDate(end),
      };
      const res = await getOrderReport(payload);
      setOrders(res?.data?.orders || []);
      setTotalItems(res?.data?.totalItems || 0);
      setTotalPages(res?.data?.totalPage || 1);
    } catch {
      setOrders([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, search, pageSize, startDate, endDate);
    // eslint-disable-next-line
  }, [currentPage, pageSize]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    fetchOrders(1, e.target.value, pageSize, startDate, endDate);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const handlePageSizeChange = (e) => {
    setCurrentPage(1);
    setPageSize(Number(e.target.value));
  };

  const ordersWithNo = orders.map((order, idx) => ({
    ...order,
    no: (currentPage - 1) * pageSize + idx + 1,
  }));

  const columns = [
    {
      key: "no",
      title: "No.",
      headerClassName: "fw-semibold",
    },
    {
      key: "name",
      title: "Customer Name",
      headerClassName: "fw-semibold",
    },
    {
      key: "order_name",
      title: "Order Name",
      headerClassName: "fw-semibold",
    },
    {
      key: "order_amount",
      title: "Order Amount",
      headerClassName: "fw-semibold",
    },
    {
      key: "total_items",
      title: "Total Items",
      headerClassName: "fw-semibold",
    },
  ];

  // Custom pagination rendering similar to Categories page
  const renderPagination = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + 4);
      } else if (endPage === totalPages) {
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

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <PaginationItem key="end-ellipsis" disabled>
            <PaginationLink>...</PaginationLink>
          </PaginationItem>
        );
      }
      pageNumbers.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
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
      <PaginationItem key="next" disabled={currentPage === totalPages}>
        <PaginationLink
          next
          onClick={() => handlePageChange(currentPage + 1)}
        />
      </PaginationItem>,
    ];
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col lg="12">
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Recent orders report</h4>
                </div>
                <Row className="mb-3 align-items-center g-2 flex-wrap">
                  <Col
                    xs={12}
                    md={3}
                    className="d-flex align-items-center mb-2 mb-md-0"
                  >
                    <label
                      htmlFor="startDate"
                      className="mb-0 me-2 flex-shrink-0"
                    >
                      Start Date
                    </label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => {
                        setStartDate(date);
                        setCurrentPage(1);
                        fetchOrders(1, search, pageSize, date, endDate);
                      }}
                      dateFormat="yyyy-MM-dd"
                      className="form-control flex-grow-1"
                      placeholderText="Enter Start Date"
                      id="startDate"
                      maxDate={endDate}
                    />
                  </Col>
                  <Col
                    xs={12}
                    md={3}
                    className="d-flex align-items-center mb-2 mb-md-0"
                  >
                    <label
                      htmlFor="endDate"
                      className="mb-0 me-2 flex-shrink-0"
                    >
                      End Date
                    </label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => {
                        setEndDate(date);
                        setCurrentPage(1);
                        fetchOrders(1, search, pageSize, startDate, date);
                      }}
                      dateFormat="yyyy-MM-dd"
                      className="form-control flex-grow-1"
                      placeholderText="Enter End Date"
                      id="endDate"
                      minDate={startDate}
                    />
                  </Col>
                  <Col
                    xs={12}
                    md={3}
                    className="d-flex align-items-center mb-2 mb-md-0"
                  >
                    <label
                      htmlFor="orderPageSize"
                      className="mb-0 me-2 flex-shrink-0"
                    >
                      Items per page:
                    </label>
                    <BaseSelect
                      id="orderPageSize"
                      className="w-auto flex-grow-1"
                      name="orderPageSize"
                      value={pageSize}
                      onChange={handlePageSizeChange}
                      options={[
                        { value: 5, name: "5" },
                        { value: 10, name: "10" },
                        { value: 20, name: "20" },
                        { value: 50, name: "50" },
                        { value: 100, name: "100" },
                      ]}
                      defaultText="Select"
                    />
                  </Col>
                  <Col
                    xs={12}
                    md={3}
                    className="d-flex align-items-center mb-2 mb-md-0"
                  >
                    <div className="w-100">
                      <BaseInput
                        type="text"
                        placeholder="Search Order..."
                        value={search}
                        onChange={handleSearch}
                        className="search-input-max-width w-100"
                      />
                    </div>
                  </Col>
                </Row>
                {loading ? (
                  <div className="d-flex justify-content-center py-4">
                    <BaseLoader size="md" />
                  </div>
                ) : ordersWithNo.length === 0 ? (
                  <div className="text-center py-5">
                    <h4 className="text-primary">Sorry! No Result Found</h4>
                    <p className="text-muted">
                      Try searching with another keyword!
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-3">
                      <BaseTable columns={columns} data={ordersWithNo} />
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <div className="text-muted ms-2">
                        {`Showing ${
                          totalItems === 0
                            ? 0
                            : (currentPage - 1) * pageSize + 1
                        } to ${Math.min(
                          currentPage * pageSize,
                          totalItems
                        )} of ${totalItems} Results`}
                      </div>
                      <Pagination>{renderPagination()}</Pagination>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OrderReport;
