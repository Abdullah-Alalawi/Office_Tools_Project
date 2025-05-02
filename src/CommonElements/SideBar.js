import React, { useState, useEffect } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useNavigate, useLocation } from "react-router-dom";
import profileImage from "../assets/default-avatar.jpg";
import { IoMdArrowDropdown } from "react-icons/io";
import { TfiRulerPencil } from "react-icons/tfi";
import { MdConstruction } from "react-icons/md";

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

  const HandleSignOut = async () => {
    const Email = localStorage.getItem("Email"); 
    localStorage.setItem("Email", "");
    localStorage.setItem("Token", "");
    localStorage.setItem("Name", "");
    localStorage.setItem("Major", "");
    try {
      const payload ={  
        "body": {"action" :"signOut","username":Email}
      } 
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      navigate("/LOGIN");
    } catch (error) {
      console.error("POST Error:", error.message);
    }
  }

  return (
    <div className="bg-white z-0 min-w-72 max-w-72 relative">
      <aside className="h-full border-r border-gray-200 flex flex-col">
        <div className="p-4 h-24 sm:h-16 flex items-center justify-center space-x-3 mt-4">
        <MdConstruction className="mr-2 text-3xl text-TweetBlue" />
          <div className="font-semibold text-2xl text-TweetBlue">    
          Sculpture <span className="text-textgray">Tools Kit </span>
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
                        : "bg-transparent text-textlightgray font-normal"
                    }`}
                    onClick={() => handleButtonClick(button.label, button.path)}
                  >
                    {button.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 py-8 flex space-x-2 items-center">
            <img src={profileImage} className="w-11 h-11" alt="Profile" />
            <div className="flex flex-col items-start">
              <p className="font-semibold">{userName}</p>
              <p className="text-textlightgray">{userType}</p>
            </div>
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly={true} className="bg-transparent rounded-3xl">
                  <IoMdArrowDropdown className="text-2xl text-kfupmgreen" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User Options">
              <DropdownItem key="logout"  color="danger" className="text-red-400" onClick={HandleSignOut}>
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

          </div>


        </div>
      </aside>
    </div>
  );
};

export default SideBar;
