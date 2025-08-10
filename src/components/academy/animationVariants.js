// Animation variants for the dashboard components

// Sidebar variants
export const sidebarVariants = {
  open: { width: '256px', boxShadow: '5px 0 15px rgba(0, 0, 0, 0.1)', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  mini: { width: '64px', boxShadow: '5px 0 15px rgba(0, 0, 0, 0.1)', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  closed: { x: '-100%', boxShadow: '0 0 0 rgba(0, 0, 0, 0)', transition: { type: 'spring', stiffness: 300, damping: 30 } }
};

// Mobile sidebar variants
export const mobileSidebarVariants = {
  open: { x: 0, boxShadow: '5px 0 15px rgba(0, 0, 0, 0.1)', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  mini: { x: 0, width: '64px', boxShadow: '5px 0 15px rgba(0, 0, 0, 0.1)', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  closed: { x: '-100%', boxShadow: '0 0 0 rgba(0, 0, 0, 0)', transition: { type: 'spring', stiffness: 300, damping: 30 } }
};

// Content variants
export const contentVariants = {
  open: { marginLeft: '256px', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  mini: { marginLeft: '64px', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  full: { marginLeft: '0px', transition: { type: 'spring', stiffness: 300, damping: 30 } }
};

// Navigation item variants
export const navItemVariants = {
  open: { opacity: 1, display: 'block', x: 0 },
  mini: { opacity: 0, display: 'none', x: -10 },
  closed: { opacity: 0, display: 'none', x: -10 }
};

// Container variants
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1
    }
  }
};

// Item variants
export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  }
};

// Tab transition variants
export const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};