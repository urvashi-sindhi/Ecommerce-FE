import React from "react";
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

export default BaseModal;
