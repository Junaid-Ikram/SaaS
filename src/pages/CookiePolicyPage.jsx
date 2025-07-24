import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CookiePolicyPage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Cookie Policy
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-700 mb-4">
            This Cookie Policy explains how Academy Platform ("we", "our", or "us") uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">2. What Are Cookies?</h2>
          <p className="text-gray-700 mb-4">
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>
          <p className="text-gray-700 mb-4">
            Cookies set by the website owner (in this case, Academy Platform) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">3. Why Do We Use Cookies?</h2>
          <p className="text-gray-700 mb-4">
            We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our website. Third parties serve cookies through our website for advertising, analytics, and other purposes.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">4. Types of Cookies We Use</h2>
          <p className="text-gray-700 mb-4">
            The specific types of first and third-party cookies served through our website and the purposes they perform are described below:
          </p>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2 mt-4">4.1 Essential Cookies</h3>
          <p className="text-gray-700 mb-4">
            These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the website, you cannot refuse them without impacting how our website functions.
          </p>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2 mt-4">4.2 Performance and Functionality Cookies</h3>
          <p className="text-gray-700 mb-4">
            These cookies are used to enhance the performance and functionality of our website but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.
          </p>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2 mt-4">4.3 Analytics and Customization Cookies</h3>
          <p className="text-gray-700 mb-4">
            These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website for you in order to enhance your experience.
          </p>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2 mt-4">4.4 Advertising Cookies</h3>
          <p className="text-gray-700 mb-4">
            These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and in some cases selecting advertisements that are based on your interests.
          </p>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2 mt-4">4.5 Social Media Cookies</h3>
          <p className="text-gray-700 mb-4">
            These cookies are used to enable you to share pages and content that you find interesting on our website through third-party social networking and other websites. These cookies may also be used for advertising purposes.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">5. How Can You Control Cookies?</h2>
          <p className="text-gray-700 mb-4">
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in the cookie banner or privacy preference center on our website.
          </p>
          <p className="text-gray-700 mb-4">
            You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser-to-browser, you should visit your browser's help menu for more information.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">6. How Often Will We Update This Cookie Policy?</h2>
          <p className="text-gray-700 mb-4">
            We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
          </p>
          <p className="text-gray-700 mb-4">
            The date at the top of this Cookie Policy indicates when it was last updated.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">7. Where Can You Get Further Information?</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about our use of cookies or other technologies, please contact us through our <Link to="/contact" className="text-indigo-600 hover:text-indigo-800">contact page</Link>.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="text-center">
          <Link 
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CookiePolicyPage;