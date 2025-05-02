import React, {useState,useEffect} from "react";
import "./LoginStyles.css";
import { useNavigate } from 'react-router-dom';
import {Button} from "@nextui-org/react";
import {jwtDecode} from 'jwt-decode';

const SendEmailPage = () => {

  const API_URL = "https://2ty7j7stad.execute-api.eu-north-1.amazonaws.com/Senior_Project/Auth"
  const [Email , setEmail] = useState("");
  const [EmailStatus,setEmailStatus] = useState("")
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
      localStorage.setItem("Email", Email);
      Navigate(localStorage.getItem("Path"));     
    }
  }, []);
  
  const HandleEmailOTP = async () => {
        localStorage.setItem("Email",Email);
        try {
          const payload ={  
            "body": {"action" :"EmailOTP","username":Email}
          } 
          const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(payload),
          });
    
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          const result = await response.json();
          const Response = JSON.parse(result['body']);

          console.log(Email)
          console.log(Response)

          if(Response["Email"] == localStorage.getItem("Email")){
            setEmailStatus("Success")
            Navigate("/OTPConfirmation")
          }else{
            setEmailStatus("Failure")
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
        <h2 className="login-text">Did You Forget Your Password ?</h2>
        
        <div className="input-group floating-label">
          <input type="email" id="email" required placeholder="Please Enter Your Email" value={Email}  onChange={(e) => setEmail(e.target.value)}/>
          <label htmlFor="email">Email Address</label>
          <span className="icon">📧</span> 

        </div>
        {EmailStatus === 'Failure' && (
                  <p className="text-danger mt-2 text-center"> Access denied. credentials don't match any known identity </p>
                )}
        <p className="login-text">Check Your Email For The Reset Link</p>
        <Button className="reset-password-button" onClick={HandleEmailOTP}>Send Email</Button>
      </div>
    </div>
  );
};

export default SendEmailPage;
