import React from "react";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const BaseModal = ({
  isOpen,
  toggle,
  title,
  children,
  footerContent,
  confirmButtonLabel,
  cancelButtonLabel,
  onConfirm,
  confirmButtonColor = "primary",
  isConfirmDisabled = false,
  hideFooter = false,
  size,
  cancelButtonColor = "secondary",
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size={size}>
      {title && <ModalHeader toggle={toggle}>{title}</ModalHeader>}
      <ModalBody>{children}</ModalBody>
      {!hideFooter && (
        <ModalFooter>
          {cancelButtonLabel && (
            <Button color={cancelButtonColor} onClick={toggle}>
              {cancelButtonLabel}
            </Button>
          )}
          {confirmButtonLabel && (
            <Button
              color={confirmButtonColor}
              onClick={onConfirm}
              disabled={isConfirmDisabled}
            >
              {confirmButtonLabel}
            </Button>
          )}
          {footerContent}
        </ModalFooter>
      )}
    </Modal>
  );
};

BaseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  footerContent: PropTypes.node,
  confirmButtonLabel: PropTypes.string,
  cancelButtonLabel: PropTypes.string,
  onConfirm: PropTypes.func,
  confirmButtonColor: PropTypes.string,
  isConfirmDisabled: PropTypes.bool,
  hideFooter: PropTypes.bool,
  size: PropTypes.string,
  cancelButtonColor: PropTypes.string,
};

export default BaseModal;
