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
import { getUsersReport } from "../../Api/reportApi";
import BaseLoader from "../../Components/Base/BaseLoader";

const UserReport = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [users, setUsers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (
    page = 1,
    searchValue = search,
    limit = pageSize
  ) => {
    try {
      setLoading(true);
      const payload = {
        search: searchValue,
        limit,
        page,
        sortValue: "asc",
        sortKey: "id",
      };
      const res = await getUsersReport(payload);
      setUsers(res?.data?.users || []);
      setTotalItems(res?.data?.totalItems || 0);
      setTotalPages(res?.data?.totalPage || 1);
    } catch {
      setUsers([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, search, pageSize);
    // eslint-disable-next-line
  }, [currentPage, pageSize]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    fetchUsers(1, e.target.value, pageSize);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const handlePageSizeChange = (e) => {
    setCurrentPage(1);
    setPageSize(Number(e.target.value));
  };

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
      key: "email",
      title: "Email",
      headerClassName: "fw-semibold",
    },
    {
      key: "phone_number",
      title: "Phone Number",
      headerClassName: "fw-semibold",
    },
    {
      key: "gender",
      title: "Gender",
      headerClassName: "fw-semibold",
    },
  ];

  // Add 'no' property to each user for row numbering
  const usersWithNo = users.map((user, idx) => ({
    ...user,
    no: (currentPage - 1) * pageSize + idx + 1,
  }));

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col lg="12">
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">User activity report</h4>
                </div>
                <Row className="mb-3 align-items-center">
                  <Col md="6" className="d-flex align-items-center">
                    <label htmlFor="userPageSize" className="mb-0 me-2">
                      Items per page:
                    </label>
                    <BaseSelect
                      id="userPageSize"
                      className="w-auto"
                      name="userPageSize"
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
                    md="6"
                    className="d-flex justify-content-end align-items-center"
                  >
                    <BaseInput
                      type="text"
                      placeholder="Search User..."
                      value={search}
                      onChange={handleSearch}
                      className="search-input-max-width"
                    />
                  </Col>
                </Row>
                {loading ? (
                  <div className="d-flex justify-content-center py-4">
                    <BaseLoader size="md" />
                  </div>
                ) : usersWithNo.length === 0 ? (
                  <div className="text-center py-5">
                    <h4 className="text-primary">Sorry! No Result Found</h4>
                    <p className="text-muted">
                      Try searching with another keyword!
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-3">
                      <BaseTable columns={columns} data={usersWithNo} />
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
                      <Pagination>
                        <PaginationItem disabled={currentPage === 1}>
                          <PaginationLink
                            previous
                            onClick={() => handlePageChange(currentPage - 1)}
                          />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, idx) => (
                          <PaginationItem
                            active={currentPage === idx + 1}
                            key={idx}
                          >
                            <PaginationLink
                              onClick={() => handlePageChange(idx + 1)}
                            >
                              {idx + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem
                          disabled={
                            currentPage === totalPages || totalPages === 0
                          }
                        >
                          <PaginationLink
                            next
                            onClick={() => handlePageChange(currentPage + 1)}
                          />
                        </PaginationItem>
                      </Pagination>
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

export default UserReport;
