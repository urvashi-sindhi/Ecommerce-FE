import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import BaseButton from "./BaseButton";

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
            <BaseButton
              color={confirmButtonColor}
              onClick={onConfirm}
              loader={isConfirmDisabled}
              disabled={isConfirmDisabled}
            >
              {confirmButtonLabel}
            </BaseButton>
          )}
          {footerContent}
        </ModalFooter>
      )}
    </Modal>
  );
};

export default BaseModal;
