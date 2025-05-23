import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Col, Collapse, Row } from "reactstrap";
import withRouter from "../../Components/Common/withRouter";

// Import Data
// import navdata from "../LayoutMenuData";
//i18n
import { withTranslation } from "react-i18next";

const HorizontalLayout = () => {
  return <React.Fragment></React.Fragment>;
};

HorizontalLayout.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(HorizontalLayout));
