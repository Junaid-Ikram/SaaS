import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaUnlockAlt, FaRegPaperPlane } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const OTP_LENGTH = 6;
const RESEND_INTERVAL_SECONDS = 60;

const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyRegistrationOtp, resendRegistrationOtp } = useAuth();

  const initialEmail = useMemo(() => {
    const stateEmail = location.state?.email;
    if (stateEmail) return stateEmail;
    try {
      const params = new URLSearchParams(location.search);
      return params.get('email') ?? '';
    } catch (error) {
      return '';
    }
  }, [location.search, location.state?.email]);

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  useEffect(() => {
    if (resendCooldown <= 0) {
      return undefined;
    }
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleVerify = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedOtp = otp.trim();
    if (!trimmedEmail) {
      setError('Please enter the email address you registered with.');
      return;
    }
    if (!trimmedOtp || trimmedOtp.length !== OTP_LENGTH) {
      setError(`Enter the ${OTP_LENGTH}-digit code we sent to your email.`);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const result = await verifyRegistrationOtp(trimmedEmail, trimmedOtp);
    setLoading(false);

    if (!result.success) {
      const message =
        result.error?.response?.data?.message ??
        result.error?.message ??
        result.error ??
        'Verification failed. Please check the code and try again.';
      setError(message);
      return;
    }

    setOtp('');
    setSuccessMessage(result.message ?? 'Email verified successfully.');
    if ((result.message ?? '').toLowerCase().includes('sign in')) {
      setTimeout(() => navigate('/login'), 2500);
    }
  };

  const handleResend = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Enter your email to resend the verification code.');
      return;
    }
    setError(null);
    setSuccessMessage(null);
    setResendCooldown(RESEND_INTERVAL_SECONDS);
    const result = await resendRegistrationOtp(trimmedEmail);
    if (!result.success) {
      const message =
        result.error?.response?.data?.message ??
        result.error?.message ??
        result.error ??
        'Unable to resend OTP. Please try again later.';
      setError(message);
      setResendCooldown(0);
      return;
    }
    setSuccessMessage(result.message ?? `We just sent a new code to ${trimmedEmail}.`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-xl w-full space-y-6 bg-white/90 backdrop-blur-lg p-8 sm:p-10 rounded-2xl shadow-xl border border-emerald-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Verify your email</h1>
          <p className="text-sm text-gray-600">
            Enter the one-time password (OTP) we sent to your inbox to activate your account.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleVerify}>
          <label className="flex flex-col text-sm font-medium text-gray-700">
            Email address
            <div className="mt-2 relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-emerald-100 bg-white py-2 pl-10 pr-3 text-gray-900 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-100"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Verification code
            <div className="mt-2 relative">
              <FaUnlockAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
              <input
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={OTP_LENGTH}
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH))}
                className="w-full tracking-widest text-center text-lg rounded-lg border border-emerald-100 bg-white py-2 pl-10 pr-3 text-gray-900 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-100"
                placeholder="••••••"
                required
              />
            </div>
            <span className="mt-2 text-xs text-gray-500">
              Codes expire after 10 minutes. Need another?{' '}
              <button
                type="button"
                className="inline-flex items-center text-secondary-600 font-semibold disabled:text-gray-400"
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
              >
                Resend OTP
                <FaRegPaperPlane className="ml-2 h-3 w-3" />
                {resendCooldown > 0 ? ` (${resendCooldown}s)` : ''}
              </button>
            </span>
          </label>

          {error && (
            <motion.div
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {successMessage}
            </motion.div>
          )}

          <motion.button
            type="submit"
            className="w-full inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-secondary-200 focus:ring-offset-2 disabled:opacity-70"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? 'Verifying…' : 'Verify email'}
          </motion.button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Already verified?{' '}
          <button
            type="button"
            className="font-semibold text-primary-600 hover:text-primary-700"
            onClick={() => navigate('/login')}
          >
            Go to sign in
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
