import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PricingPage = () => {
  const { user } = useAuth();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
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

  // Pricing plans data
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
      popular: false,
      color: "primary"
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
      popular: true,
      color: "secondary"
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
      popular: false,
      color: "primary"
    }
  ];

  // FAQ data
  const faqs = [
    {
      question: "How does the billing work?",
      answer: "We offer monthly and annual billing options. Annual billing comes with a 20% discount. You can upgrade, downgrade, or cancel your subscription at any time."
    },
    {
      question: "Can I change my plan later?",
      answer: "Yes, you can upgrade, downgrade, or cancel your subscription at any time. If you upgrade, you'll be charged the prorated amount for the remainder of your billing cycle. If you downgrade, you'll receive credit towards your next billing cycle."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. For Enterprise plans, we also offer invoice-based payment."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, we offer a 14-day free trial on all plans. No credit card required to start your trial."
    },
    {
      question: "What happens when my trial ends?",
      answer: "When your trial ends, you'll need to choose a plan to continue using the platform. We'll send you reminders before your trial expires."
    },
    {
      question: "Do you offer discounts for educational institutions?",
      answer: "Yes, we offer special pricing for educational institutions. Please contact our sales team for more information."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto">
              Choose the plan that's right for your academy. All plans include a 14-day free trial.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {pricingPlans.map((plan, index) => (
            <motion.div 
              key={index} 
              className={`relative rounded-2xl shadow-xl overflow-hidden ${plan.popular ? 'border-2 border-purple-500 transform scale-105 z-10' : 'border border-gray-200'}`}
              variants={itemVariants}
            >
              {plan.popular && (
                <div className="absolute top-0 inset-x-0 px-4 py-1 bg-purple-500 text-white text-center text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <div className="p-8 bg-white">
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{plan.role}</p>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-base font-medium text-gray-500"> {plan.period}</span>
                </p>
                <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
                <div className="mt-6">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={user ? "/dashboard" : "/register"}
                      className={`block w-full py-3 px-4 rounded-md shadow bg-${plan.color}-600 text-white font-medium hover:bg-${plan.color}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${plan.color}-500 text-center`}
                    >
                      {plan.cta}
                    </Link>
                  </motion.div>
                </div>
              </div>
              <div className="px-8 py-8 bg-gray-50">
                <h4 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">What's included</h4>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex">
                      <svg className="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-3 text-base text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto divide-y-2 divide-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl text-center mb-8">
              Frequently asked questions
            </h2>
            <dl className="mt-6 space-y-6 divide-y divide-gray-200">
              {faqs.map((faq, index) => (
                <motion.div 
                  key={index} 
                  className="pt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index, duration: 0.5 }}
                >
                  <dt className="text-lg">
                    <h3 className="text-xl font-medium text-gray-900">{faq.question}</h3>
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">{faq.answer}</dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div 
        className="bg-indigo-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-indigo-600">Start your free 14-day trial today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <motion.div className="inline-flex rounded-md shadow">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get started
              </Link>
            </motion.div>
            <motion.div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/features"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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