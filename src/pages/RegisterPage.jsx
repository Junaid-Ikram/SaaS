import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaCheckCircle,
  FaArrowRight,
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const PASSWORD_STRENGTH_STEPS = 4;

const initialFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
};

const tabs = {
  academy: {
    title: 'Academy Owner',
    blurb:
      'Create your academy account to manage teams, launch classes, and oversee subscriptions in a single dashboard.',
  },
  teacher: {
    title: 'Teacher',
    blurb:
      'Join an academy to schedule lessons, collaborate on coursework, and keep track of student progress.',
  },
  student: {
    title: 'Student',
    blurb:
      'Access live sessions, assignments, and study materials shared by your academy and teachers.',
  },
};

const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  return strength;
};

const passwordStrengthLabel = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];
const passwordStrengthClass = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-secondary-500', 'bg-secondary-600'];

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialTab = location.state?.initialTab ?? 'academy';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState(initialFormState);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { registerAcademyOwner, registerTeacher, registerStudent } = useAuth();

  const resetState = (tab) => {
    setActiveTab(tab);
    setFormData(initialFormState);
    setPasswordStrength(0);
    setError(null);
    setSuccess(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+0-9][0-9\s-]{6,}$/;

    if (!formData.firstName.trim()) {
      setError('Please enter your first name.');
      return false;
    }

    if (!formData.lastName.trim()) {
      setError('Please enter your last name.');
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (!phoneRegex.test(formData.phoneNumber)) {
      setError('Please enter a valid contact number (include country code if applicable).');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    setLoading(true);

    try {
      let result;
      if (activeTab === 'academy') {
        result = await registerAcademyOwner(
          formData.email,
          formData.password,
          fullName,
          undefined,
          formData.phoneNumber,
          undefined,
        );
      } else if (activeTab === 'teacher') {
        result = await registerTeacher(
          formData.email,
          formData.password,
          fullName,
          undefined,
          undefined,
          undefined,
          formData.phoneNumber,
        );
      } else {
        result = await registerStudent(
          formData.email,
          formData.password,
          fullName,
          undefined,
          formData.phoneNumber,
          undefined,
          undefined,
          undefined,
        );
      }

      if (!result?.success) {
        const message = result?.error?.message ?? result?.error ?? 'Registration failed. Please try again.';
        throw new Error(message);
      }

      setSuccess(true);
    } catch (err) {
      console.error('Registration error', err);
      setError(err?.message ?? 'Unable to complete registration.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 120, damping: 18, staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 12 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.03, boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)' },
    tap: { scale: 0.97 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-5xl w-full space-y-8 bg-white/90 backdrop-blur-lg p-8 sm:p-10 rounded-2xl shadow-xl border border-emerald-100"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex flex-col lg:flex-row gap-10">
          <motion.div className="flex-1 space-y-6" variants={itemVariants}>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
              <p className="mt-2 text-sm text-gray-600">
                Choose the role that best describes you. Once you sign up, we'll email you a verification code to activate your account.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(tabs).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => resetState(key)}
                  className={`rounded-xl border px-4 py-3 text-left transition-all ${
                    activeTab === key
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                      : 'border-emerald-100 bg-white text-gray-700 hover:border-emerald-300'
                  }`}
                >
                  <div className="font-semibold text-base">{value.title}</div>
                  <p className="mt-1 text-xs opacity-80 leading-relaxed">{value.blurb}</p>
                </button>
              ))}
            </div>

            <motion.div variants={itemVariants} className="rounded-xl bg-emerald-50/80 border border-emerald-100 p-5">
              <h3 className="text-sm font-semibold text-emerald-900">How approval works</h3>
              <p className="mt-2 text-sm text-emerald-700">
                After registration you will receive a one-time password (OTP). Enter it using the link in the email to activate your account. Administrators may need to approve new teacher and student accounts before login is allowed.
              </p>
            </motion.div>
          </motion.div>

          <motion.div className="flex-1 bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 sm:p-8" variants={itemVariants}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">{tabs[activeTab].title} details</h3>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex flex-col text-sm font-medium text-gray-700">
                      First name
                      <div className="mt-1 relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                        <input
                          name="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-emerald-100 bg-white py-2 pl-10 pr-3 text-gray-900 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-100"
                          placeholder="Jane"
                        />
                      </div>
                    </label>
                    <label className="flex flex-col text-sm font-medium text-gray-700">
                      Last name
                      <div className="mt-1 relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                        <input
                          name="lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-emerald-100 bg-white py-2 pl-10 pr-3 text-gray-900 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-100"
                          placeholder="Doe"
                        />
                      </div>
                    </label>
                  </div>

                  <label className="flex flex-col text-sm font-medium text-gray-700">
                    Email address
                    <div className="mt-1 relative">
                      <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                      <input
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-emerald-100 bg-white py-2 pl-10 pr-3 text-gray-900 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-100"
                        placeholder="you@example.com"
                      />
                    </div>
                  </label>

                  <label className="flex flex-col text-sm font-medium text-gray-700">
                    Contact number
                    <div className="mt-1 relative">
                      <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                      <input
                        name="phoneNumber"
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-emerald-100 bg-white py-2 pl-10 pr-3 text-gray-900 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-100"
                        placeholder="+1 555 123 4567"
                      />
                    </div>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex flex-col text-sm font-medium text-gray-700">
                      Password
                      <div className="mt-1 relative">
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                        <input
                          name="password"
                          type="password"
                          required
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-emerald-100 bg-white py-2 pl-10 pr-3 text-gray-900 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-100"
                          placeholder="Minimum 8 characters"
                        />
                      </div>
                    </label>
                    <label className="flex flex-col text-sm font-medium text-gray-700">
                      Confirm password
                      <div className="mt-1 relative">
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                        <input
                          name="confirmPassword"
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-emerald-100 bg-white py-2 pl-10 pr-3 text-gray-900 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-100"
                          placeholder="Re-enter password"
                        />
                      </div>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Password strength</span>
                      <span>
                        {passwordStrengthLabel[passwordStrength]}
                      </span>
                    </div>
                    <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrengthClass[passwordStrength] ?? 'bg-emerald-200'}`}
                        style={{ width: `${(passwordStrength / PASSWORD_STRENGTH_STEPS) * 100}%` }}
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}

                  {success && (
                    <motion.div
                      className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-start"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <FaCheckCircle className="mt-0.5 mr-3 text-emerald-500" />
                      <div>
                        <p className="font-semibold">Registration successful!</p>
                        <p className="mt-1 text-xs text-emerald-700">
                          We've sent a verification OTP to {formData.email}. Follow the link in the email to activate your account, then you can sign in.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    className="w-full inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-secondary-200 focus:ring-offset-2 disabled:opacity-70"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    disabled={loading}
                  >
                    {loading ? 'Creating account…' : 'Create account'}
                  </motion.button>

                  <div className="text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center">
                      Sign in
                      <FaArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </div>
                </form>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
