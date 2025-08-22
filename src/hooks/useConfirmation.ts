import { useState, useCallback } from "react";
import { ConfirmationType } from "../components/ui/ConfirmationModal";

export interface ConfirmationOptions {
  title: string;
  message: string;
  type?: ConfirmationType;
  confirmText?: string;
  cancelText?: string;
}

export interface ConfirmationState extends ConfirmationOptions {
  isOpen: boolean;
  onConfirm: () => void;
}

export const useConfirmation = () => {
  const [confirmation, setConfirmation] = useState<ConfirmationState | null>(
    null
  );

  const showConfirmation = useCallback(
    (options: ConfirmationOptions, onConfirm: () => void) => {
      setConfirmation({
        ...options,
        isOpen: true,
        onConfirm,
      });
    },
    []
  );

  const hideConfirmation = useCallback(() => {
    setConfirmation(null);
  }, []);

  const confirm = useCallback(
    (options: ConfirmationOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        showConfirmation(options, () => {
          hideConfirmation();
          resolve(true);
        });

        // Auto-resolve as false if modal is closed without confirmation
        const handleClose = () => {
          hideConfirmation();
          resolve(false);
        };

        // Listen for modal close
        setConfirmation((prev) =>
          prev ? { ...prev, onClose: handleClose } : null
        );
      });
    },
    [showConfirmation, hideConfirmation]
  );

  return {
    confirmation,
    showConfirmation,
    hideConfirmation,
    confirm,
  };
};
