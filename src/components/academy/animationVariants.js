// Animation variants for the dashboard components

// Sidebar variants
export const sidebarVariants = {
  open: {
    width: '240px',
    boxShadow: '0 18px 40px rgba(6, 95, 70, 0.25)',
    transition: { type: 'spring', stiffness: 520, damping: 26 },
  },
  mini: {
    width: '72px',
    boxShadow: '0 14px 30px rgba(6, 95, 70, 0.18)',
    transition: { type: 'spring', stiffness: 520, damping: 26 },
  },
  closed: {
    x: '-108%',
    boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
    transition: { type: 'spring', stiffness: 520, damping: 26 },
  },
};

export const mobileSidebarVariants = {
  open: {
    x: 0,
    width: '240px',
    boxShadow: '0 18px 40px rgba(6, 95, 70, 0.25)',
    transition: { type: 'spring', stiffness: 520, damping: 26 },
  },
  mini: {
    x: 0,
    width: '72px',
    boxShadow: '0 14px 30px rgba(6, 95, 70, 0.18)',
    transition: { type: 'spring', stiffness: 520, damping: 26 },
  },
  closed: {
    x: '-108%',
    boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
    transition: { type: 'spring', stiffness: 520, damping: 26 },
  },
};

export const contentVariants = {
  open: {
    marginLeft: '240px',
    transition: { type: 'spring', stiffness: 520, damping: 26 },
  },
  mini: {
    marginLeft: '88px',
    transition: { type: 'spring', stiffness: 520, damping: 26 },
  },
  full: {
    marginLeft: '0px',
    transition: { type: 'spring', stiffness: 520, damping: 26 },
  },
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





