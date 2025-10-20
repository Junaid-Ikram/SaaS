import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaCheckCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaTimes,
} from "react-icons/fa";
import { useToast } from "../../contexts/ToastContext";

const STATUS_STYLES = {
  success: {
    icon: FaCheckCircle,
    container:
      "border-emerald-200 bg-white text-emerald-800 shadow-[0_12px_30px_rgba(16,185,129,0.25)]",
  },
  error: {
    icon: FaTimesCircle,
    container:
      "border-red-200 bg-white text-red-800 shadow-[0_12px_30px_rgba(220,38,38,0.25)]",
  },
  warning: {
    icon: FaExclamationTriangle,
    container:
      "border-amber-200 bg-white text-amber-800 shadow-[0_12px_30px_rgba(217,119,6,0.25)]",
  },
  info: {
    icon: FaInfoCircle,
    container:
      "border-blue-200 bg-white text-blue-800 shadow-[0_12px_30px_rgba(37,99,235,0.2)]",
  },
};

const ToastItem = ({ toast, onDismiss }) => {
  const { status = "info", title, description, duration } = toast;
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.info;
  const Icon = style.icon;

  useEffect(() => {
    if (!duration || duration === Infinity) {
      return;
    }
    const timeoutId = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(timeoutId);
  }, [duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`pointer-events-auto relative flex w-full gap-3 rounded-2xl border px-4 py-3 ${style.container}`}
    >
      <span className="mt-1 text-lg">
        <Icon />
      </span>
      <div className="flex-1">
        {title ? (
          <p className="text-sm font-semibold leading-tight">{title}</p>
        ) : null}
        {description ? (
          <p className="mt-1 text-xs leading-snug text-gray-600">
            {description}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="text-xs text-gray-400 transition-colors hover:text-gray-600 focus:outline-none"
        aria-label="Dismiss notification"
      >
        <FaTimes />
      </button>
    </motion.div>
  );
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] flex flex-col items-end px-4 py-6 sm:px-6">
      <div className="ml-auto flex w-full max-w-sm flex-col gap-3">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onDismiss={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ToastContainer;
