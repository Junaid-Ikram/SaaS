import React, { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaLock, FaSpinner } from 'react-icons/fa';
import { useToast } from '../../contexts/ToastContext';
import apiRequest from '../../utils/apiClient';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 220, damping: 18 } },
  exit: { opacity: 0, y: 24, scale: 0.96 },
};

const ChangePasswordModal = ({ open, onClose }) => {
  const { showToast } = useToast();

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  }, []);

  const validate = useCallback(() => {
    if (!form.currentPassword.trim()) {
      showToast({
        status: 'error',
        title: 'Current password required',
        description: 'Please enter your existing password so we can verify it is you.',
      });
      return false;
    }

    if (!form.newPassword.trim()) {
      showToast({
        status: 'error',
        title: 'New password required',
        description: 'Pick a fresh password to keep your account safe.',
      });
      return false;
    }

    if (form.newPassword.trim().length < 8) {
      showToast({
        status: 'error',
        title: 'Password too short',
        description: 'For safety, please use at least 8 characters with a mix of fun symbols.',
      });
      return false;
    }

    if (form.newPassword !== form.confirmPassword) {
      showToast({
        status: 'error',
        title: 'Passwords do not match',
        description: 'Make sure the new password matches in both fields.',
      });
      return false;
    }

    if (form.newPassword === form.currentPassword) {
      showToast({
        status: 'error',
        title: 'Use a different password',
        description: 'Your new password must not match the current one.',
      });
      return false;
    }

    return true;
  }, [form, showToast]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!validate()) {
        return;
      }

      setSubmitting(true);
      try {
        await apiRequest('/auth/change-password', {
          method: 'PATCH',
          body: {
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
          },
        });
        showToast({
          status: 'success',
          title: 'Password updated',
          description: 'You can use your new credentials the next time you sign in.',
        });
        resetForm();
        onClose?.();
      } catch (error) {
        const message = error?.message ?? 'Unable to update your password right now.';
        showToast({
          status: 'error',
          title: 'Change failed',
          description: message,
        });
      } finally {
        setSubmitting(false);
      }
    },
    [form.currentPassword, form.newPassword, onClose, resetForm, showToast, validate],
  );

  const closeModal = useCallback(() => {
    if (submitting) return;
    resetForm();
    onClose?.();
  }, [onClose, resetForm, submitting]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[999] flex min-h-screen items-center justify-center bg-emerald-900/40 px-4 py-10 backdrop-blur-sm sm:px-6"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex items-center gap-3 border-b border-emerald-100 bg-emerald-50/70 px-6 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700">
                <FaLock className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-emerald-800">Change password</h2>
                <p className="text-xs text-emerald-900/70">
                  Choose a password that is unique to you and keep your classroom secure.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="text-xs font-semibold uppercase tracking-wide text-emerald-800"
                >
                  Current password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={form.currentPassword}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, currentPassword: event.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm text-emerald-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="text-xs font-semibold uppercase tracking-wide text-emerald-800"
                >
                  New password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={form.newPassword}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, newPassword: event.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm text-emerald-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
                <p className="mt-1 text-[11px] text-emerald-900/60">
                  Use at least 8 characters. Mix upper-case, lower-case, digits, or symbols for extra sparkle.
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-xs font-semibold uppercase tracking-wide text-emerald-800"
                >
                  Confirm new password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={form.confirmPassword}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm text-emerald-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-transparent px-5 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-emerald-400"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Update password'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default ChangePasswordModal;
