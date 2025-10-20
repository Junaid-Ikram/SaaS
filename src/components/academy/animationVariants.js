// Animation variants for the dashboard components

// Sidebar variants
export const sidebarVariants = {
  open: {
    width: '288px',
    boxShadow: '0 26px 65px rgba(15, 23, 42, 0.35)',
    transition: { type: 'spring', stiffness: 340, damping: 30 },
  },
  mini: {
    width: '96px',
    boxShadow: '0 24px 55px rgba(15, 23, 42, 0.28)',
    transition: { type: 'spring', stiffness: 340, damping: 30 },
  },
  closed: {
    x: '-108%',
    boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
    transition: { type: 'spring', stiffness: 340, damping: 30 },
  },
};

export const mobileSidebarVariants = {
  open: {
    x: 0,
    width: '288px',
    boxShadow: '0 26px 65px rgba(15, 23, 42, 0.35)',
    transition: { type: 'spring', stiffness: 340, damping: 30 },
  },
  mini: {
    x: 0,
    width: '96px',
    boxShadow: '0 24px 55px rgba(15, 23, 42, 0.28)',
    transition: { type: 'spring', stiffness: 340, damping: 30 },
  },
  closed: {
    x: '-108%',
    boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
    transition: { type: 'spring', stiffness: 340, damping: 30 },
  },
};

export const contentVariants = {
  open: {
    marginLeft: '320px',
    transition: { type: 'spring', stiffness: 320, damping: 28 },
  },
  mini: {
    marginLeft: '128px',
    transition: { type: 'spring', stiffness: 320, damping: 28 },
  },
  full: {
    marginLeft: '0px',
    transition: { type: 'spring', stiffness: 320, damping: 28 },
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
