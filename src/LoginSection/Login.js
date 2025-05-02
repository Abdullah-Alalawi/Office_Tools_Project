import React from "react";
import { useState ,useRef ,useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import "./LoginStyles.css";
import { Link } from "react-router-dom";
import { Amplify } from 'aws-amplify'; 
import { signIn, signOut, resetPassword } from 'aws-amplify/auth'
import {jwtDecode} from 'jwt-decode';
import {Button} from "@nextui-org/react";

const API_URL = "https://2ty7j7stad.execute-api.eu-north-1.amazonaws.com/Senior_Project/Auth"

//Email your KFUPM Email
//Password is !Qa123456

const Login = () => {



  const [Email,setEmail] = useState("");
  const [Password,setPassword] = useState("");

  const Navigate = useNavigate();

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
  

  const HandelCredentials = async  () => {

    try {
      const payload ={  
        "body": {"action" :"signIn","username":Email,"password":Password}
      } 
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      const temp = JSON.parse(result['body']);
      console.log(temp)
      const DecodedToken = jwtDecode(temp["access_token"]);
      const currentTime = Math.floor(Date.now() / 1000);
      
      
      if(DecodedToken.exp > currentTime){
        localStorage.setItem("Token", temp["access_token"]);
        localStorage.setItem("Email", temp["Email"]);
        localStorage.setItem("Name", temp["Name"]);
        localStorage.setItem("Major", temp["Major"]);

        Navigate("/GrammarChecker");
      }else{
        localStorage.setItem("Token", "");
        localStorage.setItem("Email", "");
        localStorage.setItem("Name", "");
        localStorage.setItem("Major", "");
      }


    } catch (error) {
      console.error("POST Error:", error.message);
    }

  };
    

  

  return (
    <div className="login-container">
      <div className="login-box">
      <img src="/mainLogo.PNG" alt="Sculpture Tools Kit" class="mainLogo"/>
        <h2 className="welcome">Welcome</h2>
        <p className="login-text">Login with Email or username</p>
        
        <div className="input-group floating-label">
            <input type="text" id="email" required placeholder="Email or Username" value={Email} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="email">User Id</label>
          <span className="icon">📧</span> 
            </div>

<div className="input-group floating-label">
  <input type="password" id="password" required placeholder="****************" value={Password} onChange={(e) => setPassword(e.target.value)} />
  <label htmlFor="password">Password</label>
  <span className="icon">🔒</span>
    </div>
    <Link to="/SendEmailPage" className="forgot-password">Forgot your password?</Link>
        <Button className="login-button" onClick={HandelCredentials}>Login</Button>
      </div>
      <div className="image-side"></div>
    </div>
    
  );
};

export default Login;
