import React, { useState, useEffect } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useNavigate, useLocation } from "react-router-dom";
import profileImage from "../assets/default-avatar.jpg";
import { IoMdArrowDropdown } from "react-icons/io";
import { TfiRulerPencil } from "react-icons/tfi";
import { MdConstruction } from "react-icons/md";
import { FaFeatherAlt } from "react-icons/fa";

const SideBar = ({ buttons, userName, userType }) => {
  const [selectedButton, setSelectedButton] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = "https://2ty7j7stad.execute-api.eu-north-1.amazonaws.com/Senior_Project/Auth"
  


  useEffect(() => {
    const currentPath = location.pathname;
    const matchedButton = buttons.find((button) => button.path === currentPath);
    if (matchedButton) {
      setSelectedButton(matchedButton.label);
    }
  }, [location, buttons]);

  const handleButtonClick = (buttonName, path) => {
    setSelectedButton(buttonName);
    localStorage.setItem("Path",path)
    navigate(path);
  };



  return (
    <div className="bg-white z-0 min-w-72 max-w-72 relative">
      <aside className="h-full border-r border-gray-200 flex flex-col">
        <div className="p-4 h-24 sm:h-16 flex items-center justify-center space-x-3 mt-4">

          <div className="font-semibold text-2xl text-TweetBlue">    
          <FaFeatherAlt size={25}/> Office <span className="text-textgray">Tools Kit </span>
          </div>
        </div>

        <div className="flex flex-col justify-between flex-1">
          <div className="space-y-8 flex">
            <div className="space-y-2 p-2 pt-4">
              <div className="pl-2 pt-2 pr-2 space-y-8 min-w-full">
                {buttons.map((button) => (
                  <Button
                    key={button.label}
                    ripple={true}
                    startContent={<button.icon className="mr-2 text-2xl" />}
                    className={`text-start flex justify-start px-4 text-base min-w-full max-w-full py-7 focus:outline-none rounded-lg ${
                      selectedButton === button.label
                        ? "bg-TweetBlue text-white font-semibold"
                        : "bg-transparent text-textlightgray font-normal hover:shadow-md hover:bg-gray-100"
                    }`}
                    onClick={() => handleButtonClick(button.label, button.path)}
                  >
                    {button.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>




        </div>
      </aside>
    </div>
  );
};

export default SideBar;
