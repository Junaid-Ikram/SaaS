import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebookF, FaTwitter, FaGithub, FaLinkedinIn, FaPaperPlane } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Navigation links for the footer
  const navigation = {
    main: [
      { name: 'Home', href: '/' },
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Contact', href: '/contact' },
    ],
    academy: [
      { name: 'For Academy Owners', href: '/features#academy-owners' },
      { name: 'For Teachers', href: '/features#teachers' },
      { name: 'For Students', href: '/features#students' },
      { name: 'Success Stories', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
    social: [
      {
        name: 'Facebook',
        href: '#',
        icon: (props) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        name: 'Twitter',
        href: '#',
        icon: (props) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        ),
      },
      {
        name: 'GitHub',
        href: '#',
        icon: (props) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        name: 'LinkedIn',
        href: '#',
        icon: (props) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M19.7 3H4.3A1.3 1.3 0 003 4.3v15.4A1.3 1.3 0 004.3 21h15.4a1.3 1.3 0 001.3-1.3V4.3A1.3 1.3 0 0019.7 3zM8.339 18.338H5.667v-8.59h2.672v8.59zM7.004 8.574a1.548 1.548 0 11-.002-3.096 1.548 1.548 0 01.002 3.096zm11.335 9.764H15.67v-4.177c0-.996-.017-2.278-1.387-2.278-1.389 0-1.601 1.086-1.601 2.206v4.249h-2.667v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.779 3.203 4.092v4.711z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
    ],
  };

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 group mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg blur-sm opacity-75"></div>
                <div className="relative bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-primary-700 transition-colors">
                  EduPlatform
                </span>
              </div>
            </Link>
            <p className="text-gray-600 mb-6 pr-4">
              Empowering educational institutions with modern tools for effective teaching and learning experiences.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.95 }} 
                className="bg-white p-2 rounded-full text-gray-600 hover:text-primary-600 hover:shadow-md transition-all duration-200 border border-gray-200"
              >
                <FaFacebookF className="h-4 w-4" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.95 }} 
                className="bg-white p-2 rounded-full text-gray-600 hover:text-primary-600 hover:shadow-md transition-all duration-200 border border-gray-200"
              >
                <FaTwitter className="h-4 w-4" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.95 }} 
                className="bg-white p-2 rounded-full text-gray-600 hover:text-primary-600 hover:shadow-md transition-all duration-200 border border-gray-200"
              >
                <FaLinkedinIn className="h-4 w-4" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.95 }} 
                className="bg-white p-2 rounded-full text-gray-600 hover:text-primary-600 hover:shadow-md transition-all duration-200 border border-gray-200"
              >
                <FaGithub className="h-4 w-4" />
              </motion.a>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Navigation</h3>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* For Academies */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">For Academies</h3>
            <ul className="space-y-3">
              {navigation.academy.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Subscribe */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Stay Updated</h3>
            <p className="text-gray-600 mb-4">Subscribe to our newsletter for the latest updates.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="min-w-0 flex-1 bg-white border border-gray-300 py-2 px-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 rounded-l-md text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary-600 hover:bg-primary-700 py-2 px-4 rounded-r-md text-white font-medium text-sm flex items-center transition-colors duration-200"
              >
                <FaPaperPlane className="h-3.5 w-3.5 mr-1" />
                <span>Send</span>
              </motion.button>
            </form>
          </div>
        </div>
        
        {/* Legal Links */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              {navigation.legal.map((item) => (
                <Link key={item.name} to={item.href} className="text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  {item.name}
                </Link>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              &copy; {currentYear} EduPlatform. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;