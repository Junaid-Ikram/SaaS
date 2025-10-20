import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const DEFAULT_DURATION = 5000;

const ToastContext = createContext(undefined);

const generateToastId = () =>
  `toast-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((toast) => {
    const id = toast.id ?? generateToastId();
    setToasts((prev) => [
      ...prev,
      {
        id,
        status: toast.status ?? "info",
        title: toast.title ?? "",
        description: toast.description ?? "",
        duration:
          typeof toast.duration === "number" && toast.duration > 0
            ? toast.duration
            : DEFAULT_DURATION,
      },
    ]);
    return id;
  }, []);

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      removeToast,
      clearToasts: () => setToasts([]),
    }),
    [toasts, showToast, removeToast],
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
