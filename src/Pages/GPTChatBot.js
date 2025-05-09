import React, { useState,useEffect} from "react";
import MainLayout from "../CommonElements/MainLayout";
import {  Button, Card,CardBody,CardFooter,Input,Spacer, Textarea, Avatar} from "@nextui-org/react";
import { MdOutlineTranslate } from "react-icons/md";
import { IoChatbubbles } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import { LuBookOpenCheck } from "react-icons/lu";
import OpenAI from 'openai';



// Dummy data for appointments
const ChatLogs = [
  { id: 1, date: "2024-03-15", time: "10:00 AM", Message: "How may i Help you Today ?", user: "AI" },

];

const statusColorMap = {
  Confirmed: "success",
  Pending: "warning",
  Cancelled: "danger",
};

const AIChat = () => {
  const sidebarButtons = [
    { label: "Grammar & Spell Checker", icon: LuBookOpenCheck, path: "/GrammarChecker" },
    { label: "Translator", icon: MdOutlineTranslate, path: "/Translator" },
    { label: "GPT ChatBot", icon: IoChatbubbles, path: "/AIChatGPT" },
    { label: "DeepSeek ChatBot", icon: IoChatbubbles, path: "/AIChatDeepSeek" }
    
  ];
  
  
    
    
    const [ChatMessage , setChatMessage] = useState("");
    const [Ai_Reply  , setAi_Reply]= useState("");
;
 


    
    // Function to POST data to the API
    const postData = async (event) => {
      if((event.key == "Enter") || (event.button === 0)){
      try {
        const payload ={ 
          "Prompt" : ChatMessage
        }      
        


        const openai = new OpenAI({
          apiKey: process.env.REACT_APP_GPT_API_KEY,
          dangerouslyAllowBrowser: true 
        });

        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content:ChatMessage }],
            max_tokens: 200,
          });
      
        const AI_Response = chatCompletion.choices[0].message.content

        setAi_Reply(AI_Response);
        ChatLogs.push({
          id: ChatLogs.length+1 ,
          date:"2024-12-12",
          time:"9:30 AM",
          Message:AI_Response,
          user:"AI"});
        console.log(AI_Response);
        
      } catch (error) {
        console.error("POST Error:", error.message);
      }
    }
      
      

    };
  

    const HandleSubmit = (event) => {
     if(event.key == "Enter"){
     ChatLogs.push({
      id: ChatLogs.length+1 ,
      date:"2024-12-12",
      time:"9:30 AM",
      Message:ChatMessage,
      user:"Human"});
    
      postData(event);

      setChatMessage("");
     }


    }

    const renderCell = (ChatMessage) => {
    
        switch (ChatMessage.user) {
          case "AI":
            return (
                <div className="flex gap-2 justify-start">
                <Avatar showFallback src="https://images.unsplash.com/broken" />
                <Textarea
                  data-testid={"AI-Bubble " + ChatMessage.id}
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
                  data-testid={"Human-Bubble " + ChatMessage.id}
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
                    <button size="lg" data-testid="send-button"  onClick={HandleSubmit} color="primary"className={`bg-TweetBlue text-white h-10 min-w-[100px] mt-4 `}>
                      <IoSend />
                    </button>
                  }
                />
            </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AIChat;