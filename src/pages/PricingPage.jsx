import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PricingPage = () => {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const pricingPlans = [
    {
      name: "Basic",
      role: "For Small Academies",
      price: "$29",
      period: "per month",
      description: "Perfect for small academies just getting started.",
      features: [
        "Up to 5 teachers",
        "Up to 100 students",
        "Basic analytics",
        "Email support",
        "Student management",
        "Assignment tracking"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      role: "For Growing Academies",
      price: "$79",
      period: "per month",
      description: "Ideal for academies looking to scale their operations.",
      features: [
        "Up to 20 teachers",
        "Up to 500 students",
        "Advanced analytics",
        "Priority email support",
        "Student & teacher management",
        "Assignment creation & tracking",
        "Performance reports",
        "API access"
      ],
      cta: "Get Started",
      popular: true
    },
    {
      name: "Enterprise",
      role: "For Large Institutions",
      price: "$199",
      period: "per month",
      description: "Comprehensive solution for large educational institutions.",
      features: [
        "Unlimited teachers",
        "Unlimited students",
        "Premium analytics",
        "24/7 phone & email support",
        "Dedicated account manager",
        "Advanced reporting",
        "Custom integrations",
        "White labeling",
        "On-premise deployment option"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "How does the billing work?",
      answer: "We offer monthly and annual billing options. Annual billing comes with a 20% discount."
    },
    {
      question: "Can I change my plan later?",
      answer: "Yes, you can upgrade, downgrade, or cancel your subscription at any time."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards and PayPal. Enterprise plans may use invoice."
    },
    {
      question: "Do you offer a trial?",
answer: "Please contact us for a demo or more information on our plans."
    },
    {
      question: "What happens when my trial ends?",
      answer: "You'll need to choose a plan to continue using the platform."
    },
    {
      question: "Do you offer discounts for educational institutions?",
      answer: "Yes, please contact our sales team for details."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-600/30 to-primary-400/20 rounded-full -mr-24 -mt-24 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary-600/30 to-primary-400/20 rounded-full -ml-24 -mb-24 blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        <div className="max-w-7xl mx-auto py-20 px-4 sm:py-28 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                <span className="flex h-2 w-2 rounded-full bg-primary-600 mr-2"></span>
                Pricing Plans
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Simple, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-primary-100">Transparent</span> Pricing
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto text-primary-100">
              Choose the plan that's right for your academy.
            </p>
            
            <div className="mt-10 flex justify-center space-x-4">
              <motion.div whileHover={{ y: -3, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center">
                    <span>Get Started</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -3, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 border border-primary-100 text-base font-medium rounded-md text-white hover:bg-primary-700/30 transition-all duration-300"
                >
                  Contact Sales
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              className={`relative rounded-2xl overflow-hidden ${plan.popular ? 'transform scale-105 z-10' : ''}`}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div className={`p-8 ${plan.popular ? 'bg-gradient-to-br from-primary-50 to-white border border-primary-200 shadow-xl' : 'bg-white border border-gray-200 shadow-lg'}`}>
                {plan.popular && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      <span className="flex h-2 w-2 rounded-full bg-primary-600 mr-1"></span>
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 mb-4">
                  <div className={`flex items-center justify-center h-10 w-10 rounded-full ${plan.popular ? 'bg-gradient-to-br from-primary-500 to-primary-600' : 'bg-gray-100'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${plan.popular ? 'text-white' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-bold ${plan.popular ? 'text-primary-900' : 'text-gray-900'}`}>{plan.name}</h3>
                </div>
                
                <p className="mt-1 text-sm text-gray-500">{plan.role}</p>
                <div className="mt-4 flex items-baseline">
                  <span className={`text-5xl font-extrabold ${plan.popular ? 'text-primary-700' : 'text-gray-900'}`}>{plan.price}</span>
                  <span className="text-base font-medium text-gray-500 ml-1"> {plan.period}</span>
                </div>
                <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
                
                <div className="mt-6">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to={user ? "/dashboard" : "/register"}
                      className={`block w-full py-3 px-4 rounded-lg shadow text-white font-medium text-center transition-all duration-300 ${plan.popular ? 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                    >
                      <div className="flex items-center justify-center">
                        <span>{plan.cta}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              </div>
              <div className={`px-8 py-8 ${plan.popular ? 'bg-primary-50' : 'bg-gray-50'}`}>
                <h4 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">What's included</h4>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex">
                      <svg className={`flex-shrink-0 h-5 w-5 ${plan.popular ? 'text-primary-600' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-base text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:py-28 lg:px-8">
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  <span className="flex h-2 w-2 rounded-full bg-primary-600 mr-2"></span>
                  Support
                </span>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Frequently asked questions
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to know about our pricing plans and billing process.
              </p>
            </div>
            
            <dl className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index, duration: 0.5 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <dt className="text-lg">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </span>
                      {faq.question}
                    </h3>
                  </dt>
                  <dd className="mt-3 text-base text-gray-600 pl-11">{faq.answer}</dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-600/30 to-primary-400/20 rounded-full -mr-24 -mt-24 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary-600/30 to-primary-400/20 rounded-full -ml-24 -mb-24 blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8 lg:flex lg:items-center lg:justify-between relative z-10">
          <div>
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                <span className="flex h-2 w-2 rounded-full bg-primary-600 mr-2"></span>
                Limited Time Offer
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-primary-100">Start your free 14-day trial today.</span>
            </h2>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row lg:mt-0 lg:flex-shrink-0 space-y-3 sm:space-y-0 sm:space-x-3">
            <motion.div 
              className="inline-flex rounded-md shadow" 
              whileHover={{ y: -3, scale: 1.02 }} 
              transition={{ duration: 0.2 }}
            >
              <Link
                to={user ? "/dashboard" : "/register"}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center">
                  <span>Get started</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </Link>
            </motion.div>
            <motion.div 
              className="inline-flex rounded-md shadow" 
              whileHover={{ y: -3, scale: 1.02 }} 
              transition={{ duration: 0.2 }}
            >
              <Link
                to="/features"
                className="inline-flex items-center justify-center px-6 py-3 border border-primary-100 text-base font-medium rounded-md text-white hover:bg-primary-700/30 transition-all duration-300"
              >
                Learn more
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PricingPage;
