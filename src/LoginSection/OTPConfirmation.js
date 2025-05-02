import React, {useState,useEffect} from "react";
import "./LoginStyles.css";
import {InputOtp} from "@heroui/react";
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import {Button} from "@nextui-org/react";

const OTPConfirmation = () => {

  const API_URL = "https://2ty7j7stad.execute-api.eu-north-1.amazonaws.com/Senior_Project/Auth"
  const [OTP,setOTP] = useState("");
  const Navigate = useNavigate() ;

  useEffect(() => {
    const Token = !localStorage.getItem("Token")? localStorage.getItem("Token"): jwtDecode(localStorage.getItem("Token"));
    const Name = localStorage.getItem("Name")
    const Major = localStorage.getItem("Major")
    const currentTime = Math.floor(Date.now() / 1000);
    if ((!Token & !Name & !Major) || (Token.exp<=currentTime)  ) {
      localStorage.setItem("Token", "");
      localStorage.setItem("Email", "");
      localStorage.setItem("Name", "");
      localStorage.setItem("Major", "");
      Navigate("/LOGIN");
    }
    else {
      Navigate(localStorage.getItem("Path"));     
    }
  }, []);
  

  const HandleCodeConfirmation = async () => {
    const Email = localStorage.getItem("Email")
    try {
        const payload ={  
          "body": {"action" :"confirmCode","code":OTP,"username": Email}
        } 
        const response = await fetch(API_URL, {
          method: "POST",
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log(result)
        const temp = JSON.parse(result['body']);
        const DecodedToken = jwtDecode(temp["access_token"]);
        const Username = temp["Username"]
        const currentTime = Math.floor(Date.now() / 1000);

        if((DecodedToken.exp > currentTime) && (Username == localStorage.getItem("Email"))){
            Navigate("/PasswordReset");
        }
    
    } catch (error) {
        console.error("POST Error:", error.message);
      }
  
  }

  return (
    <div className="login-container">
      <div className="image-side"></div>
      <div className="login-box">
        <img src="/mainLogo.PNG" alt="Sculpture Tools Kit" className="mainLogo" />
        <h2 className="login-text"> Please Enter The OTP Code </h2>
        
        <div className="my-6 justify-items-center">
            
            <InputOtp 
                length={6} 
                variant={"underlined"}
                radius={'lg'}
                onChange={(e) => setOTP(e.target.value)}
                classNames={{
                    segment: [
                        "w-12 h-16 text-4xl ",
                        "data-[focus=true]:border-TweetBlue",

                    ],
                    segmentWrapper: "gap-6"
                }}/>
        </div>

        <p className="login-text">Check Your Email For The OTP Code</p>
        <Button className="reset-password-button" onClick={HandleCodeConfirmation}>Confirm Code</Button>
      </div>
    </div>
  );
};

export default OTPConfirmation;
