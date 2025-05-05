import React, { useState  ,useEffect} from "react";
import MainLayout from "../CommonElements/MainLayout";
import { Button ,  Card,CardBody,CardFooter,Input,Spacer, Textarea, Avatar} from "@nextui-org/react";
import { MdOutlineTranslate } from "react-icons/md";
import { IoChatbubbles } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import { LuBookOpenCheck } from "react-icons/lu";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';



// Dummy data for appointments
const ChatLogs = [
  { id: 1, date: "2024-03-15", time: "10:00 AM", Message: "How may i Help you Today ?", user: "AI" },

];

const statusColorMap = {
  Confirmed: "success",
  Pending: "warning",
  Cancelled: "danger",
};

const AIChatDeepSeek = () => {
  const sidebarButtons = [
    { label: "Grammar & Spell Checker", icon: LuBookOpenCheck, path: "/GrammarChecker" },
    { label: "Translator", icon: MdOutlineTranslate, path: "/Translator" },
    { label: "GPT ChatBot", icon: IoChatbubbles, path: "/AIChatGPT" },
    { label: "DeepSeek ChatBot", icon: IoChatbubbles, path: "/AIChatDeepSeek" }
    
  ];
  
  
    
    const [TotalMessage , setTotalMessage] = useState([]);
    const [ChatMessage , setChatMessage] = useState("");
    const [Ai_Reply  , setAi_Reply]= useState("");
   //onst bottomRef = useRef<HTMLDivElement>(document.getElementById("Conv"));
   const [Name , setName] = useState("");
   const [Major , setMajor] = useState("");
   const Navigate = useNavigate();
 
 



   const DEEPSEEK_API_KEY = process.env.REACT_APP_DEEPSEEK_API_KEY;
   const DEEPSEEK_API_URL = process.env.REACT_APP_DEEPSEEK_API_URL;
   
    
    // Function to POST data to the API
    const postData = async (event) => {

      const userMessage = { role: "user", content: ChatMessage };
      setTotalMessage((prev) => [...prev, userMessage]);
  
      try {
        const response = await axios.post(
          DEEPSEEK_API_URL,
          {
            model: "deepseek-chat",
            messages: [...TotalMessage, userMessage],
            temperature: 0.7,
            max_tokens: 1024,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
            },
          }
        );
  
        const aiMessage = response.data.choices[0].message;
        console.log(aiMessage["content"])
        setAi_Reply(aiMessage["content"])
        ChatLogs.push({
          id: ChatLogs.length+1 ,
          date:"2024-12-12",
          time:"9:30 AM",
          Message:aiMessage["content"],
          user:"AI"});

        setTotalMessage((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("Error calling DeepSeek API:", error);
        setTotalMessage((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, an error occurred!" },
        ]);
      } finally {
        
       
      }
    
    };
  

    const HandleSubmit = (event) => {
      //if(event.key == "Enter"){
     // console.log(today(getLocalTimeZone()));}
     if((event.key == "Enter") || (event.button === 0)){
     ChatLogs.push({
      id: ChatLogs.length+1 ,
      date:"2024-12-12",
      time:"9:30 AM",
      Message:ChatMessage,
      user:"Human"});
      

      postData(event);

      setChatMessage("");
      //ttomRef.current?.scrollIntoView({ behavior: "smooth" });
     }


    }

    const renderCell = (ChatMessage) => {
    
        switch (ChatMessage.user) {
          case "AI":
            return (
                <div className="flex gap-2 justify-start">
                <Avatar showFallback src="https://images.unsplash.com/broken" />
                <Textarea
                 
                  className={` text-black text-wrap inline-block `}
                  variant="flat"
                  value= {ChatMessage.Message}
                  classNames={{
                    base: "max-w-xl", // or any other width class
                  }}
                  isReadOnly
                  maxRows={100}              
                />
             </div>
            );
          case "Human":
            return (
                <div className="flex gap-2 justify-end">
                    
                <Textarea
                  color="primary" 
                  className={` text-black inline-block  `}
                  
                  variant="flat"
                  value= {ChatMessage.Message}
                  classNames={{
                    base: "max-w-xl", // or any other width class
                  }}

                  maxRows={100}
                 
                 
                  
                  isReadOnly
                />
                 <Avatar showFallback src="https://images.unsplash.com/broken" />
                

             </div>
            );
          default:
            return "";
        }
    };
    

  return (
    <MainLayout title="AI Chat Bot" sidebarButtons={sidebarButtons} userName="" userType="">
      <div id="Conv" className="p-4 justify-items-stretch " >
        <h1 className="text-2xl font-bold mb-4">Your AI ChatBot</h1>
        <Card className=" lg:size-full  " >
            <CardBody className="h-full " >
            {ChatLogs.map((Message) => (
              <div key={Message.id} className="flex flex-col  justify-end overflow-y-auto ">
                <Spacer x={72} y = {10}/>
                {Message.user=="AI"? renderCell(Message) : ""}
                {Message.user=="Human"? renderCell(Message) : ""}
                <Spacer x={72} y = {10}/>
               
              </div>

              
            ))}

        </CardBody>
            <CardFooter>
             <Input
                  label="     "
                  placeholder="Enter your Question ?"
                  onKeyDown={HandleSubmit}
                  value={ChatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  
                  endContent={
                    <Button size="lg"  onClick={HandleSubmit} color="primary"className={`bg-TweetBlue text-white h-10 min-w-[100px] mt-4 `}>
                      <IoSend />
                    </Button>
                  }
                />
            </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AIChatDeepSeek;