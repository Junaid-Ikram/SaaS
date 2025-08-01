import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaSchool, FaUserTie, FaUserGraduate, FaIdCard, FaPhone, FaMapMarkerAlt, FaBook, FaCalendarAlt, FaImage, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const location = useLocation();
  const initialTab = location.state?.initialTab || 'academy';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    academyName: '',
    academyId: '',
    contactNumber: '',
    address: '',
    specialization: '',
    experience: '',
    gradeLevel: '',
    age: '',
    guardianContact: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [academyIdList, setAcademyIdList] = useState([]);
  const navigate = useNavigate();

  const { registerAcademyOwner, registerTeacher, registerStudent, fetchAcademies } = useAuth();
  
  // Fetch academy IDs for dropdown
  const [loadingAcademies, setLoadingAcademies] = useState(false);
  const [academyError, setAcademyError] = useState(null);
  
  useEffect(() => {
    const fetchAcademyIds = async () => {
      try {
        setLoadingAcademies(true);
        setAcademyError(null);
        
        const result = await fetchAcademies();
        if (result.success) {
          setAcademyIdList(result.academies || []);
          if (result.academies.length === 0) {
            console.log('No academies available for selection');
          }
        } else {
          console.error('Error fetching academy IDs:', result.error);
          setAcademyError('Failed to load academies. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching academy IDs:', error);
        setAcademyError('An unexpected error occurred. Please try again.');
      } finally {
        setLoadingAcademies(false);
      }
    };

    fetchAcademyIds();
  }, [fetchAcademies]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Check password strength
    if (name === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Medium';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return '';
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-secondary-500';
      case 4: return 'bg-secondary-600';
      default: return 'bg-gray-200';
    }
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email format");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }

    if (!/[0-9]/.test(formData.password)) {
      setError("Password must contain at least one number");
      return false;
    }

    if (activeTab === 'academy' && !formData.academyName) {
      setError("Academy name is required");
      return false;
    }

    if ((activeTab === 'teacher' || activeTab === 'student') && !formData.academyId) {
      setError("Academy ID is required");
      return false;
    }

    return true;
  };

  const getRegistrationStatusMessage = (role) => {
    switch (role) {
      case 'academy_owner':
        return 'Registration successful! You can now sign in to your academy dashboard.';
      case 'teacher':
      case 'student':
        return 'Registration successful! Your account is pending approval from the academy owner.';
      default:
        return 'Registration successful!';
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    
    try {
      let result;
      console.log('Registering with email:', formData.email); // Debug log
      // Register based on selected role
      switch (activeTab) {
        case 'academy':
          result = await registerAcademyOwner(
            formData.email,
            formData.password,
            formData.fullName,
            formData.academyName,
            formData.contactNumber,
            formData.address
          );
          break;
          
        case 'teacher':
          result = await registerTeacher(
            formData.email,
            formData.password,
            formData.fullName,
            formData.academyId,
            formData.specialization,
            formData.experience,
            formData.contactNumber
          );
          break;
          
        case 'student':
          result = await registerStudent(
            formData.email,
            formData.password,
            formData.fullName,
            formData.academyId,
            formData.gradeLevel,
            formData.age,
            formData.guardianContact
          );
          break;
          
        default:
          throw new Error('Invalid role selected');
      }
      
      if (!result.success) {
        throw result.error;
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setError(error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 12
      }
    }
  };

  const tabVariants = {
    inactive: { scale: 0.9, opacity: 0.7 },
    active: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300 } }
  };
  
  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      transition: { 
        duration: 0.3,
        yoyo: Infinity,
        yoyoEase: 'easeOut'
      }
    },
    tap: { scale: 0.95 }
  };
  
  const successVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-secondary-800 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-4xl w-full space-y-8 bg-white rounded-xl shadow-2xl overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex flex-col md:flex-row">
          {/* Left side - Form */}
          <div className="w-full md:w-3/5 p-8">
            <motion.div variants={itemVariants}>
              <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
                Create your account
              </h2>
            </motion.div>

            {/* Role selection tabs */}
            <motion.div variants={itemVariants} className="flex justify-center mb-8">
              <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                <motion.button
                  variants={tabVariants}
                  animate={activeTab === 'academy' ? 'active' : 'inactive'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('academy')}
                  className={`flex items-center px-4 py-2 rounded-md ${activeTab === 'academy' ? 'bg-gradient-to-r from-green-600 to-secondary-600 text-white' : 'text-gray-700'}`}
                >
                  <FaSchool className={`mr-2 ${activeTab !== 'academy' ? 'text-green-600' : ''}`} />
                  Academy Owner
                </motion.button>
                <motion.button
                  variants={tabVariants}
                  animate={activeTab === 'teacher' ? 'active' : 'inactive'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('teacher')}
                  className={`flex items-center px-4 py-2 rounded-md ${activeTab === 'teacher' ? 'bg-gradient-to-r from-green-600 to-secondary-600 text-white' : 'text-gray-700'}`}
                >
                  <FaUserTie className={`mr-2 ${activeTab !== 'teacher' ? 'text-green-600' : ''}`} />
                  Teacher
                </motion.button>
                <motion.button
                  variants={tabVariants}
                  animate={activeTab === 'student' ? 'active' : 'inactive'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('student')}
                  className={`flex items-center px-4 py-2 rounded-md ${activeTab === 'student' ? 'bg-gradient-to-r from-green-600 to-secondary-600 text-white' : 'text-gray-700'}`}
                >
                  <FaUserGraduate className={`mr-2 ${activeTab !== 'student' ? 'text-green-600' : ''}`} />
                  Student
                </motion.button>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.form 
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 30,
                  duration: 0.4 
                }}
                className="mt-8 space-y-6" 
                onSubmit={handleRegister}
              >
                <div className="rounded-md shadow-sm space-y-4">
                  {/* Common fields for all roles */}
                  <div className="flex flex-col space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </div>

                    {formData.password && (
                      <div className="w-full">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-gray-500">Password Strength:</span>
                          <span className={`text-xs font-medium ${passwordStrength >= 3 ? 'text-secondary-500' : passwordStrength >= 2 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-full rounded-full ${getPasswordStrengthColor()}`} 
                            style={{ width: `${(passwordStrength / 4) * 100}%` }}
                          ></div>
                        </div>
                        <ul className="text-xs text-gray-500 mt-1 pl-4 list-disc">
                          <li className={formData.password.length >= 8 ? 'text-secondary-500' : ''}>At least 8 characters</li>
                          <li className={/[A-Z]/.test(formData.password) ? 'text-secondary-500' : ''}>At least one uppercase letter</li>
                          <li className={/[0-9]/.test(formData.password) ? 'text-secondary-500' : ''}>At least one number</li>
                          <li className={/[^A-Za-z0-9]/.test(formData.password) ? 'text-secondary-500' : ''}>At least one special character</li>
                        </ul>
                      </div>
                    )}

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Role-specific fields */}
                  {activeTab === 'academy' && (
                    <div className="flex flex-col space-y-4 pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700">Academy Information</h3>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaSchool className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="academyName"
                          name="academyName"
                          type="text"
                          required
                          className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                          placeholder="Academy Name"
                          value={formData.academyName}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="contactNumber"
                          name="contactNumber"
                          type="tel"
                          className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                          placeholder="Contact Number (Optional)"
                          value={formData.contactNumber}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="address"
                          name="address"
                          type="text"
                          className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                          placeholder="Academy Address (Optional)"
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'teacher' && (
                    <div className="flex flex-col space-y-4 pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700">Teacher Information</h3>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaIdCard className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          id="academyId"
                          name="academyId"
                          required
                          disabled={loadingAcademies}
                          className={`appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border ${academyError ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm`}
                          value={formData.academyId}
                          onChange={handleInputChange}
                        >
                          <option value="">{loadingAcademies ? 'Loading academies...' : 'Select Academy'}</option>
                          {!loadingAcademies && academyIdList.length > 0 ? (
                            academyIdList.map(academy => (
                              <option key={academy.id} value={academy.id}>{academy.name}</option>
                            ))
                          ) : (
                            !loadingAcademies && <option disabled>No academies available</option>
                          )}
                        </select>
                        {academyError && (
                          <p className="mt-1 text-xs text-red-500">{academyError}</p>
                        )}
                        {!loadingAcademies && academyIdList.length === 0 && (
                          <p className="mt-1 text-xs text-gray-500">No academies available. Please register as an academy owner first or contact an existing academy.</p>
                        )}
                        {!loadingAcademies && academyIdList.length === 0 && (
                          <p className="mt-1 text-xs text-gray-500">No academies available. Please register as an academy owner first or contact an existing academy.</p>
                        )}
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaBook className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="specialization"
                          name="specialization"
                          type="text"
                          className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                          placeholder="Subject Specialization (Optional)"
                          value={formData.specialization}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="experience"
                          name="experience"
                          type="text"
                          className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                          placeholder="Years of Experience (Optional)"
                          value={formData.experience}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="contactNumber"
                          name="contactNumber"
                          type="tel"
                          className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                          placeholder="Contact Number (Optional)"
                          value={formData.contactNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'student' && (
                    <div className="flex flex-col space-y-4 pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700">Student Information</h3>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaIdCard className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          id="academyId"
                          name="academyId"
                          required
                          disabled={loadingAcademies}
                          className={`appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border ${academyError ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm`}
                          value={formData.academyId}
                          onChange={handleInputChange}
                        >
                          <option value="">{loadingAcademies ? 'Loading academies...' : 'Select Academy'}</option>
                          {!loadingAcademies && academyIdList.length > 0 ? (
                            academyIdList.map(academy => (
                              <option key={academy.id} value={academy.id}>{academy.name}</option>
                            ))
                          ) : (
                            !loadingAcademies && <option disabled>No academies available</option>
                          )}
                        </select>
                        {academyError && (
                          <p className="mt-1 text-xs text-red-500">{academyError}</p>
                        )}
                        {!loadingAcademies && academyIdList.length === 0 && (
                          <p className="mt-1 text-xs text-gray-500">No academies available. Please register as an academy owner first or contact an existing academy.</p>
                        )}
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaBook className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="gradeLevel"
                          name="gradeLevel"
                          type="text"
                          className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                          placeholder="Grade Level (Optional)"
                          value={formData.gradeLevel}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="age"
                          name="age"
                          type="number"
                          min="1"
                          className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                          placeholder="Age (Optional)"
                          value={formData.age}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="guardianContact"
                          name="guardianContact"
                          type="tel"
                          className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                          placeholder="Guardian Contact (Optional)"
                          value={formData.guardianContact}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm"
                  >
                    <p>{error}</p>
                  </motion.div>
                )}

                {success && (
                  <motion.div 
                    variants={successVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-secondary-50 border-l-4 border-secondary-500 p-4 text-secondary-700 flex items-center"
                  >
                    <FaCheckCircle className="text-secondary-500 mr-2 text-lg" />
                    <p>{getRegistrationStatusMessage(activeTab === 'academy' ? 'academy_owner' : activeTab)} Redirecting to login...</p>
                  </motion.div>
                )}

                <div>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-secondary-600 hover:from-green-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg transition-all duration-200"
                  >
                    {loading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    <span className="flex items-center">
                      {loading ? 'Creating account...' : 'Sign up'}
                      {!loading && <FaArrowRight className="ml-2 animate-pulse" />}
                    </span>
                  </motion.button>
                </div>

                <div className="text-sm text-center">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-green-600 hover:text-green-500 hover:underline transition-all duration-200">
                      Sign in
                    </Link>
                  </p>
                </div>
              </motion.form>
            </AnimatePresence>
          </div>

          {/* Right side - Info */}
          <div className="hidden md:block md:w-2/5 bg-gradient-to-br from-primary-600 to-secondary-700 p-8 text-white">
            <div className="h-full flex flex-col justify-between">
              <div>
                <motion.h3 
                  variants={itemVariants}
                  className="text-xl font-bold mb-4"
                >
                  {activeTab === 'academy' ? 'Academy Owner Registration' : 
                   activeTab === 'teacher' ? 'Teacher Registration' : 
                   'Student Registration'}
                </motion.h3>
                
                <motion.div variants={itemVariants}>
                  {activeTab === 'academy' && (
                    <div className="space-y-4">
                      <p>Create your academy and start managing your educational institution online.</p>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Manage teachers and students
                        </li>
                        <li className="flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Track academic progress
                        </li>
                        <li className="flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Organize classes and schedules
                        </li>
                        <li className="flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Generate reports and analytics
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  {activeTab === 'teacher' && (
                    <div className="space-y-4">
                      <p>Join an academy as a teacher and manage your classes efficiently.</p>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Manage your classes and students
                        </li>
                        <li className="flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Create and grade assignments
                        </li>
                        <li className="flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Track student progress
                        </li>
                        <li className="flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Communicate with students and parents
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  {activeTab === 'student' && (
                    <div className="space-y-4">
                      <p>Join your academy as a student and access all your educational resources in one place.</p>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Access your courses and materials
                        </li>
                        <li className="flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Submit assignments and receive grades
                        </li>
                        <li className="flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Track your academic progress
                        </li>
                        <li className="flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Communicate with teachers
                        </li>
                      </ul>
                    </div>
                  )}
                </motion.div>
              </div>
              
              <motion.div variants={itemVariants} className="mt-8">
                <p className="text-sm opacity-80">
                  By signing up, you agree to our{' '}
                  <Link to="/terms" className="underline hover:text-white hover:opacity-100 transition-all duration-200">Terms of Service</Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="underline hover:text-white hover:opacity-100 transition-all duration-200">Privacy Policy</Link>.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;