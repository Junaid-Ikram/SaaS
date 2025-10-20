import React from "react";

const DashboardFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-gray-200 bg-white text-gray-500">
      <div className="mx-auto flex max-w-6xl px-4 py-6 text-xs sm:px-6 lg:px-12 lg:ml-[15rem]">
        © {year} Q Edu Platform • All rights reserved
      </div>
    </footer>
  );
};

export default DashboardFooter;
