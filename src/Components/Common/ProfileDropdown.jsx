import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { LOGIN } from "../../Api/ApiRoutes";
import BaseModal from "../Base/BaseModal";

import avatar1 from "../../assets/images/users/user-dummy-img.jpg";

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    role: "",
    email: "",
  });

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserData({
      name: user.email || "User",
      role: user.role || "User",
      email: user.email || "",
    });
  }, []);

  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };

  const openLogoutModal = () => {
    setIsProfileDropdown(false);
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleConfirmLogout = () => {
    localStorage.clear();
    navigate(LOGIN);
  };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={isProfileDropdown}
        toggle={toggleProfileDropdown}
        className="ms-sm-3 header-item topbar-user"
      >
        <DropdownToggle tag="button" type="button" className="btn">
          <span className="d-flex align-items-center">
            <img
              className="rounded-circle header-profile-user"
              src={avatar1}
              alt="Header Avatar"
            />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                {userData.name}
              </span>
              <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                {userData.role}
              </span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <h6 className="dropdown-header">Welcome {userData.name}!</h6>
          <div className="dropdown-divider"></div>
          <DropdownItem
            className="dropdown-item"
            onClick={openLogoutModal}
            style={{ cursor: "pointer" }}
          >
            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle" data-key="t-logout">
              Logout
            </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <BaseModal
        isOpen={isLogoutModalOpen}
        toggle={closeLogoutModal}
        title="Logout"
        onConfirm={handleConfirmLogout}
        confirmButtonLabel="Yes"
        cancelButtonLabel="No"
        confirmButtonColor="success"
        cancelButtonColor="primary"
        size="sm"
      >
        Are you sure you want to log out?
      </BaseModal>
    </React.Fragment>
  );
};

export default ProfileDropdown;
