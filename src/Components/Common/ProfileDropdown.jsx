import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { LOGIN } from "../../Routes/apiRoutes";
import BaseModal from "../Base/BaseModal";
import { baseURLForImage } from "../../Api/AuthApi";

import avatar1 from "../../assets/images/users/user-dummy-img.jpg";
import { viewProfile } from "../../Api/LoginApi";

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    role: "",
    email: "",
    profileImage: "",
  });

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const response = await viewProfile();
      if (response) {
        setUserData((prevData) => ({
          ...prevData,
          name: response.data.name || "User",
          role: response.data.role || "User",
          email: response.data.email || "",
          profileImage:
            `${baseURLForImage}${response.data.profile_image}` || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
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
              src={userData.profileImage || avatar1}
              alt="Header Avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = avatar1;
              }}
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
          <DropdownItem className="p-0">
            <Link to="/profile" className="dropdown-item">
              <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle">Profile</span>
            </Link>
          </DropdownItem>
          <DropdownItem className="p-0">
            <Link to="/change-password" className="dropdown-item">
              <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle">Change Password</span>
            </Link>
          </DropdownItem>
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
