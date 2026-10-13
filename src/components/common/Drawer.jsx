
import { useEffect } from "react";
import { X } from "lucide-react";

function Drawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  position = "right",
  size = "medium",
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = "",
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (
      closeOnOverlayClick &&
      event.target === event.currentTarget
    ) {
      onClose?.();
    }
  };

  return (
    <div
      className="drawer-overlay"
      onMouseDown={handleOverlayClick}
    >
      <aside
        className={`drawer drawer--${position} drawer--${size} ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-label={title || "Side panel"}
      >
        <header className="drawer__header">
          <h2 className="drawer__title">{title}</h2>

          {showCloseButton && (
            <button
              type="button"
              className="drawer__close"
              onClick={onClose}
              aria-label="Close drawer"
            >
              <X size={20} />
            </button>
          )}
        </header>

        <div className="drawer__body">{children}</div>

        {footer && (
          <footer className="drawer__footer">
            {footer}
          </footer>
        )}
      </aside>
    </div>
  );
}

export default Drawer;