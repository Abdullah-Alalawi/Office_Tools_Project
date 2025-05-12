// MainLayout.js
import React from "react";
import SideBar from "./SideBar";


const MainLayout = ({ title, children, sidebarButtons, userName, userType }) => {
  return (
    <div className="h-screen flex overflow-hidden">
      <SideBar buttons={sidebarButtons} userName={userName} userType={userType} />
      <div className="flex-grow flex flex-col overflow-hidden">
        <header className="border-b bg-white w-full py-2">
          <div className="p-3 pr-8 pl-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-semibold text-xl text-tarkeeznavy mb-2 sm:mb-0">{title}</h1>
          </div>
        </header>

        <div className="flex-1 h-0 overflow-auto bg-backgroundcolor">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
