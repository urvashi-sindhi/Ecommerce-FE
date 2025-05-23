import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Collapse, Container } from "reactstrap";
import withRouter from "../../Components/Common/withRouter";

import logoSm from "../../assets/images/logo-sm.png";
//i18n
import { withTranslation } from "react-i18next";

// Import Data
// import navdata from "../LayoutMenuData";
import VerticalLayout from "../VerticalLayouts";

//SimpleBar
import SimpleBar from "simplebar-react";

const TwoColumnLayout = (props) => {
  // const navData = navdata().props.children;
  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    let parentCollapseDiv = item.closest(".collapse.menu-dropdown");
    if (parentCollapseDiv) {
      // to set aria expand true remaining
      parentCollapseDiv.classList.add("show");
      parentCollapseDiv.parentElement.children[0].classList.add("active");
      parentCollapseDiv.parentElement.children[0].setAttribute(
        "aria-expanded",
        "true"
      );
      if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
        parentCollapseDiv.parentElement
          .closest(".collapse")
          .classList.add("show");
        const parentParentCollapse =
          parentCollapseDiv.parentElement.closest(
            ".collapse"
          ).previousElementSibling;
        if (parentParentCollapse) {
          parentParentCollapse.classList.add("active");
          if (parentParentCollapse.closest(".collapse.menu-dropdown")) {
            parentParentCollapse
              .closest(".collapse.menu-dropdown")
              .classList.add("show");
          }
        }
      }
      activateIconSidebarActive(parentCollapseDiv.getAttribute("id"));
      return false;
    }
    return false;
  }, []);

  const path = props.router.location.pathname;

  const initMenu = useCallback(() => {
    const pathName = process.env.PUBLIC_URL + path;
    const ul = document.getElementById("navbar-nav");
    const items = ul.getElementsByTagName("a");
    let itemsArray = [...items]; // converts NodeList to Array
    removeActivation(itemsArray);
    let matchingMenuItem = itemsArray.find((x) => {
      return x.pathname === pathName;
    });
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    } else {
      if (process.env.PUBLIC_URL) {
        var id = pathName.replace(process.env.PUBLIC_URL, "");
        id = id.replace("/", "");
      } else {
        id = pathName.replace("/", "");
      }
      if (id) document.body.classList.add("twocolumn-panel");
      activateIconSidebarActive(id);
    }
  }, [path, activateParentDropdown]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    initMenu();
  }, [path, initMenu]);

  function activateIconSidebarActive(id) {
    var menu = document.querySelector(
      "#two-column-menu .simplebar-content-wrapper a[subitems='" +
        id +
        "'].nav-icon"
    );
    if (menu !== null) {
      menu.classList.add("active");
    }
  }

  const removeActivation = (items) => {
    let activeItems = items.filter((x) => x.classList.contains("active"));
    activeItems.forEach((item) => {
      if (item.classList.contains("menu-link")) {
        if (!item.classList.contains("active")) {
          item.setAttribute("aria-expanded", false);
        }
        item.nextElementSibling.classList.remove("show");
      }
      if (item.classList.contains("nav-link")) {
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove("show");
        }
        item.setAttribute("aria-expanded", false);
      }
      item.classList.remove("active");
    });

    const ul = document.getElementById("two-column-menu");
    const iconItems = ul.getElementsByTagName("a");
    let itemsArray = [...iconItems];
    let activeIconItems = itemsArray.filter((x) =>
      x.classList.contains("active")
    );
    activeIconItems.forEach((item) => {
      item.classList.remove("active");
      var id = item.getAttribute("subitems");
      if (document.getElementById(id))
        document.getElementById(id).classList.remove("show");
    });
  };

  // Resize sidebar
  const [isMenu, setIsMenu] = useState("twocolumn");
  const windowResizeHover = () => {
    initMenu();
    var windowSize = document.documentElement.clientWidth;
    if (windowSize < 767) {
      document.documentElement.setAttribute("data-layout", "vertical");
      setIsMenu("vertical");
    } else {
      document.documentElement.setAttribute("data-layout", "twocolumn");
      setIsMenu("twocolumn");
    }
  };

  useEffect(function setupListener() {
    if (props.layoutType === "twocolumn") {
      window.addEventListener("resize", windowResizeHover);

      // remove classname when component will unmount
      return function cleanupListener() {
        window.removeEventListener("resize", windowResizeHover);
      };
    }
  });
  return <React.Fragment></React.Fragment>;
};

export default withRouter(withTranslation()(TwoColumnLayout));
