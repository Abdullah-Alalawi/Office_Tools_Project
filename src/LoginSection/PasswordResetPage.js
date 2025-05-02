import React, {useState, useEffect} from "react";
import "./LoginStyles.css"; 
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import {Button} from "@nextui-org/react";


const PasswordResetPage = () => {
  const API_URL = "https://2ty7j7stad.execute-api.eu-north-1.amazonaws.com/Senior_Project/Auth"
  const [NewPassword, setNewPassword] = useState("");
  const [PasswordOne, setPasswordOne] = useState("");
  const [PasswordTwo, setPasswordTwo] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [match, setMatch] = useState(false);
  const navigate = useNavigate();


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
      navigate("/LOGIN");
    }
    else {
      navigate(localStorage.getItem("Path"));     
    }
  }, []);

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push("Must be at least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Must contain a uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Must contain a lowercase letter ");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Must contain a number");
    }
    if (!/[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ]/.test(password)) {
      errors.push(`Must contain special character like {}()?"!@#`);
    }
    
    return errors;
  };

  useEffect(() => {
    if (PasswordOne && PasswordTwo) {
      setMatch(PasswordOne === PasswordTwo);
      setNewPassword(PasswordOne); // Set NewPassword when passwords match
      setPasswordErrors(validatePassword(PasswordOne));
    }
  }, [PasswordOne, PasswordTwo]);

  const HandlePasswordReset = async (event) => {
    if (((event.key === "Enter") || (event.button === 0)) && NewPassword && match && passwordErrors.length === 0) {
      const Email = localStorage.getItem("Email");
      try {
        const payload = {  
          "body": {
            "action": "reset",
            "username": Email,
            "new_password": NewPassword
          }
        };
        
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        const temp = JSON.parse(result['body']);
        const DecodedToken = jwtDecode(temp["access_token"]);
        const currentTime = Math.floor(Date.now() / 1000);

        if (DecodedToken.exp > currentTime) {
          navigate("/LOGIN");
        }
      } catch (error) {
        console.error("POST Error:", error.message);
      } 
    }
  };

  return (
    <div className="login-container">
      <div className="image-side"></div> 
      <div className="login-box">
        <img src="/mainLogo.PNG" alt="Sculpture Tools Kit" className="mainLogo" />
        <h2 className="login-text">Please Enter The New Password :</h2>

        <div className="input-group floating-label">
          <input 
            type="password" 
            id="new-password" 
            onChange={(e) => setPasswordOne(e.target.value)}
            onKeyDown={HandlePasswordReset}
            required 
            placeholder="****************" 
          />
          <label htmlFor="new-password">New Password</label>
          <span className="icon">🔒</span>
        </div>

        <div className="input-group floating-label">
          <input 
            type="password" 
            id="confirm-password" 
            onChange={(e) => setPasswordTwo(e.target.value)}
            onKeyDown={HandlePasswordReset}
            required 
            placeholder="****************" 
          />
          <label htmlFor="confirm-password">Password Confirmation</label>
          <span className="icon">🔒</span>
        </div>
        <div className="w-7/12 text-left justify-items-start justify-start">
        <div className=" justify-start justify-items-start" >
          <ul className="text-gray-500 text-sm list-disc pl-5">
            <li style={{fontFamily: "'Lato', sans-serif"}} className={PasswordOne.length >= 8 ? "text-green-500" : ""}>At least 8 characters</li>
            <li style={{fontFamily: "'Lato', sans-serif"}} className={/[A-Z]/.test(PasswordOne) ? "text-green-500" : ""}>At least one uppercase letter (A–Z)</li>
            <li style={{fontFamily: "'Lato', sans-serif"}} className={/[a-z]/.test(PasswordOne) ? "text-green-500" : ""}>At least one lowercase letter (a–z)</li>
            <li style={{fontFamily: "'Lato', sans-serif"}} className={/[0-9]/.test(PasswordOne) ? "text-green-500" : ""}>At least one number (0–9)</li>
            <li style={{fontFamily: "'Lato', sans-serif"}} className={/[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ]/.test(PasswordOne) ? "text-green-500" : ""}>At least one special character (e.g., ! @ # $ % ^ & *)</li>
          </ul>
        </div>

        {/* Password match error */}
        {(PasswordTwo.length ===PasswordOne.length) && PasswordTwo && !match && (
          <p className="text-danger" >The passwords do not match. Please Try Again</p>
        )}
        </div>

        <Button 
          className="reset-password-button" 
          onClick={HandlePasswordReset}
          disabled={!match || passwordErrors.length > 0}
        >
          Reset Password
        </Button>
      </div>
    </div>
  );
};

export default PasswordResetPage;