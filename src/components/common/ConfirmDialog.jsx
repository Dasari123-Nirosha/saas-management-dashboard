
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

const iconMap = {
  danger: AlertTriangle,
  warning: AlertTriangle,
  success: CheckCircle2,
  info: Info,
};

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "Please confirm that you want to continue.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}) {
  const Icon = iconMap[variant] || AlertTriangle;

  const handleConfirm = () => {
    if (!loading) {
      onConfirm?.();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      closeOnOverlayClick={!loading}
      showCloseButton={!loading}
      className="confirm-dialog"
    >
      <div className="confirm-dialog__content">
        <div
          className={`confirm-dialog__icon confirm-dialog__icon--${variant}`}
          aria-hidden="true"
        >
          <Icon size={26} />
        </div>

        <p className="confirm-dialog__message">{message}</p>
      </div>

      <div className="confirm-dialog__actions">
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </Button>

        <Button
          variant={variant === "danger" ? "danger" : "primary"}
          onClick={handleConfirm}
          loading={loading}
          disabled={loading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;