import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import ReactApexChart from "react-apexcharts";
import CountUp from "react-countup";
import {
  FaShoppingBag,
  FaTimesCircle,
  FaClock,
  FaUsers,
  FaChevronDown,
} from "react-icons/fa";
import {
  getDashboardStats,
  getHighestPurchaseOrder,
  getPieChartData,
} from "../../Api/dashboardApi";
import { toast } from "react-toastify";
import BaseLoader from "../../Components/Base/BaseLoader";

const StatCard = ({ icon, title, value, label, color, loading }) => (
  <Card>
    <CardBody>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "120px" }}
        >
          <BaseLoader />
        </div>
      ) : (
        <>
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <p className="text-uppercase fw-medium text-muted mb-0">
                {title}
              </p>
            </div>
            <div className="flex-shrink-0">
              <h5 className={`text-${color} fs-14 mb-0`}>{icon}</h5>
            </div>
          </div>
          <div className="d-flex align-items-end justify-content-between mt-4">
            <div>
              <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                <CountUp start={1} end={value} duration={2.5} />
              </h4>
              <span className="text-muted">{label}</span>
            </div>
          </div>
        </>
      )}
    </CardBody>
  </Card>
);

const Dashboard = () => {
  document.title = "Dashboard | Velzon - React Admin & Dashboard Template";

  const [stats, setStats] = useState({});
  const [pieData, setPieData] = useState({ series: [], labels: [] });
  const [topCustomers, setTopCustomers] = useState([]);
  const [timeFrame, setTimeFrame] = useState("year");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingPie, setLoadingPie] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  const toggleDropdown = () => setIsDropdownOpen((prevState) => !prevState);

  const timeFrameDisplayMap = {
    week: "Week",
    month: "Month",
    year: "Year",
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();

        setStats(response.data || {});
      } catch (err) {
        toast.error(err.response.data.message);
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchTopCustomers = async () => {
      try {
        const response = await getHighestPurchaseOrder();

        setTopCustomers(response.data || []);
      } catch (err) {
        toast.error(err.response.data.message);
        setTopCustomers([]);
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchStats();
    fetchTopCustomers();
  }, []);

  useEffect(() => {
    const fetchPieData = async () => {
      setLoadingPie(true);
      try {
        const res = await getPieChartData({ timeFrame });

        if (res && Array.isArray(res.data)) {
          const chartData = res.data;

          const labels = chartData.map((item) => item.label);
          const series = chartData.map((item) => item.value || 0);

          setPieData({
            series: series,
            labels: labels,
          });
        } else {
          setPieData({ series: [], labels: [] });
        }
      } catch {
        toast.error("Could not fetch pie chart data");
        setPieData({ series: [], labels: [] });
      } finally {
        setLoadingPie(false);
      }
    };
    fetchPieData();
  }, [timeFrame]);

  const ordersChartOptions = {
    chart: {
      type: "donut",
    },
    labels: pieData.labels,
    colors: ["#556ee6", "#f46a6a", "#34c38f"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`,
    },
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col>
            <div className="h-100">
              <div className="d-flex align-items-center mb-4">
                <div className="flex-grow-1">
                  <h4 className="mb-1">Welcome!</h4>
                  <p className="text-muted mb-0">
                    Here's what's happening with your store today.
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col xl={3} md={6}>
            <StatCard
              icon={<FaShoppingBag />}
              title="Total Orders"
              value={stats.total_order || 0}
              label="Total Count"
              color="primary"
              loading={loadingStats}
            />
          </Col>
          <Col xl={3} md={6}>
            <StatCard
              icon={<FaTimesCircle />}
              title="Cancelled Orders"
              value={stats.total_cancel_order || 0}
              label="Total Count"
              color="danger"
              loading={loadingStats}
            />
          </Col>
          <Col xl={3} md={6}>
            <StatCard
              icon={<FaClock />}
              title="Pending Orders"
              value={stats.total_pending_order || 0}
              label="Total Count"
              color="warning"
              loading={loadingStats}
            />
          </Col>
          <Col xl={3} md={6}>
            <StatCard
              icon={<FaUsers />}
              title="Total Customers"
              value={stats.total_customer || 0}
              label="Total Count"
              color="info"
              loading={loadingStats}
            />
          </Col>
        </Row>

        <Row className="align-items-stretch mb-5">
          <Col xl={5}>
            <Card className="h-100">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h4 className="card-title mb-0">Orders Overview</h4>
                <Dropdown isOpen={isDropdownOpen} toggle={toggleDropdown}>
                  <DropdownToggle
                    color="transparent"
                    className="text-muted d-flex align-items-center"
                  >
                    {timeFrameDisplayMap[timeFrame]}
                    <FaChevronDown className="ms-2" size={12} />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => setTimeFrame("week")}>
                      Week
                    </DropdownItem>
                    <DropdownItem onClick={() => setTimeFrame("month")}>
                      Month
                    </DropdownItem>
                    <DropdownItem onClick={() => setTimeFrame("year")}>
                      Year
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </CardHeader>
              <CardBody className="piechart-card-body">
                {loadingPie ? (
                  <div className="piechart-loader-container">
                    <BaseLoader />
                  </div>
                ) : (
                  <ReactApexChart
                    key={JSON.stringify(pieData.series)}
                    options={ordersChartOptions}
                    series={pieData.series}
                    type="donut"
                    height={260}
                  />
                )}
              </CardBody>
            </Card>
          </Col>
          <Col xl={7}>
            <Card className="h-100">
              <CardHeader>
                <h4 className="card-title mb-0">
                  Top Customers by Purchase Value
                </h4>
              </CardHeader>
              <CardBody>
                {loadingCustomers ? (
                  <div className="d-flex justify-content-center align-items-center py-5">
                    <BaseLoader />
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead>
                        <tr>
                          <th className="text-center">No.</th>
                          <th className="text-center">Customer</th>
                          <th className="text-center">Total Purchase Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topCustomers.map((item, index) => (
                          <tr key={item.id || index}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-center">{item.user.name}</td>
                            <td className="text-center">{`$${item.total_price}`}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
