import React from "react";
import Navdata from "../LayoutMenuData";
import { Link } from "react-router-dom";

const VerticalLayout = () => {
  const navData = Navdata();
  const menuItems = navData.props.children;

  const renderSubItems = (subItems) => (
    <ul className="nav nav-sm flex-column">
      {subItems.map((sub, subIdx) => (
        <li className="nav-item" key={sub.id || subIdx}>
          <Link className="nav-link" to={sub.link}>
            {sub.icon && <i className={sub.icon}></i>} {sub.label}
          </Link>
          {sub.childItems && renderSubItems(sub.childItems)}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {menuItems.map((item, idx) =>
        item.isHeader ? (
          <li className="menu-title" key={idx}>
            <span>{item.label}</span>
          </li>
        ) : (
          <li className="nav-item" key={item.id || idx}>
            <Link
              className="nav-link menu-link"
              to={item.link}
              onClick={item.click}
            >
              {item.icon && <item.icon />}
              <span>{item.label}</span>
            </Link>
            {item.subItems && renderSubItems(item.subItems)}
          </li>
        )
      )}
    </>
  );
};

export default VerticalLayout;
