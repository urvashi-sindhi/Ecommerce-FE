import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaTags } from "react-icons/fa";

const Navdata = () => {
  const history = useNavigate();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isCategory, setIsCategory] = useState(false);
  const [isCurrentState, setIsCurrentState] = useState("Dashboard");

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (isCurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
  }, [history, isDashboard]);

  const menuItems = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "dashboard",
      label: "Dashboards",
      icon: FaTachometerAlt,
      link: "/dashboard",
      stateVariables: isDashboard,
      click: function (e) {
        setIsDashboard(!isDashboard);
        setIsCurrentState("Dashboard");
        updateIconSidebar(e);
      },
    },
    {
      id: "category",
      label: "Categories",
      icon: FaTags,
      link: "/category",
      stateVariables: isCategory,
      click: function (e) {
        setIsCategory(!isCategory);
        setIsCurrentState("Categories");
        updateIconSidebar(e);
      },
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
