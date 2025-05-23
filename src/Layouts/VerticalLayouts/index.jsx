import React from "react";

import { withTranslation } from "react-i18next";
import withRouter from "../../Components/Common/withRouter";

const VerticalLayout = () => {
  return <React.Fragment></React.Fragment>;
};

const VerticalLayoutWithTranslation = withTranslation()(VerticalLayout);
const VerticalLayoutWithRouter = withRouter(VerticalLayoutWithTranslation);
export default VerticalLayoutWithRouter;
