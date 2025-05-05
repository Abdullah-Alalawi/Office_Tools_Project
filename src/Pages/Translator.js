import React, {useEffect,useState} from "react";
import MainLayout from "../CommonElements/MainLayout";
import { PiArrowsLeftRightBold } from "react-icons/pi"
import { MdOutlineTranslate } from "react-icons/md";
import { IoChatbubbles } from "react-icons/io5";
import {  Textarea, Card,CardBody, Select, SelectItem , Spacer} from "@nextui-org/react";
import { LuBookOpenCheck } from "react-icons/lu";
import AWS from "aws-sdk";
import { useNavigate } from 'react-router-dom';



const Translator = () => {
  const sidebarButtons = [
    { label: "Grammar & Spell Checker", icon: LuBookOpenCheck, path: "/GrammarChecker" },
    { label: "Translator", icon: MdOutlineTranslate, path: "/Translator" },
    { label: "GPT ChatBot", icon: IoChatbubbles, path: "/AIChatGPT" },
    { label: "DeepSeek ChatBot", icon: IoChatbubbles, path: "/AIChatDeepSeek" }
    
  ];
  

      // IAM Role with fullAccess to the aws translation service 
      AWS.config.update({
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        region: process.env.REACT_APP_AWS_REGION,
      });
      
      const translate = new AWS.Translate();



      const Languages = [
        { Lang: "Afrikaans", App: "af" },
        { Lang: "Albanian", App: "sq" },
        { Lang: "Amharic", App: "am" },
        { Lang: "Arabic", App: "ar" },
        { Lang: "Armenian", App: "hy" },
        { Lang: "Azerbaijani", App: "az" },
        { Lang: "Bengali", App: "bn" },
        { Lang: "Bosnian", App: "bs" },
        { Lang: "Bulgarian", App: "bg" },
        { Lang: "Catalan", App: "ca" },
        { Lang: "Chinese (Simplified)", App: "zh" },
        { Lang: "Chinese (Traditional)", App: "zh-TW" },
        { Lang: "Croatian", App: "hr" },
        { Lang: "Czech", App: "cs" },
        { Lang: "Danish", App: "da" },
        { Lang: "Dari", App: "fa-AF" },
        { Lang: "Dutch", App: "nl" },
        { Lang: "English", App: "en" },
        { Lang: "Estonian", App: "et" },
        { Lang: "Farsi (Persian)", App: "fa" },
        { Lang: "Filipino, Tagalog", App: "tl" },
        { Lang: "Finnish", App: "fi" },
        { Lang: "French", App: "fr" },
        { Lang: "French (Canada)", App: "fr-CA" },
        { Lang: "Georgian", App: "ka" },
        { Lang: "German", App: "de" },
        { Lang: "Greek", App: "el" },
        { Lang: "Gujarati", App: "gu" },
        { Lang: "Haitian Creole", App: "ht" },
        { Lang: "Hausa", App: "ha" },
        { Lang: "Hebrew", App: "he" },
        { Lang: "Hindi", App: "hi" },
        { Lang: "Hungarian", App: "hu" },
        { Lang: "Icelandic", App: "is" },
        { Lang: "Indonesian", App: "id" },
        { Lang: "Irish", App: "ga" },
        { Lang: "Italian", App: "it" },
        { Lang: "Japanese", App: "ja" },
        { Lang: "Kannada", App: "kn" },
        { Lang: "Kazakh", App: "kk" },
        { Lang: "Korean", App: "ko" },
        { Lang: "Latvian", App: "lv" },
        { Lang: "Lithuanian", App: "lt" },
        { Lang: "Macedonian", App: "mk" },
        { Lang: "Malay", App: "ms" },
        { Lang: "Malayalam", App: "ml" },
        { Lang: "Maltese", App: "mt" },
        { Lang: "Marathi", App: "mr" },
        { Lang: "Mongolian", App: "mn" },
        { Lang: "Norwegian (Bokmål)", App: "no" },
        { Lang: "Pashto", App: "ps" },
        { Lang: "Polish", App: "pl" },
        { Lang: "Portuguese (Brazil)", App: "pt" },
        { Lang: "Portuguese (Portugal)", App: "pt-PT" },
        { Lang: "Punjabi", App: "pa" },
        { Lang: "Romanian", App: "ro" },
        { Lang: "Russian", App: "ru" },
        { Lang: "Serbian", App: "sr" },
        { Lang: "Sinhala", App: "si" },
        { Lang: "Slovak", App: "sk" },
        { Lang: "Slovenian", App: "sl" },
        { Lang: "Somali", App: "so" },
        { Lang: "Spanish", App: "es" },
        { Lang: "Spanish (Mexico)", App: "es-MX" },
        { Lang: "Swahili", App: "sw" },
        { Lang: "Swedish", App: "sv" },
        { Lang: "Tamil", App: "ta" },
        { Lang: "Telugu", App: "te" },
        { Lang: "Thai", App: "th" },
        { Lang: "Turkish", App: "tr" },
        { Lang: "Ukrainian", App: "uk" },
        { Lang: "Urdu", App: "ur" },
        { Lang: "Uzbek", App: "uz" },
        { Lang: "Vietnamese", App: "vi" },
        { Lang: "Welsh", App: "cy" }
      ];
    
    const [selectedLangFrom, setSelectedLangFrom] = useState(new Set([""]));
    const [selectedLangTo, setSelectedLangTo] = useState(new Set([""]));
    const [Text , setText] = useState("");
    const [TranslatedText , setTranslatedText] = useState("");



    const HandleLangSelectionFrom = async (LangFrom) => {

      if (Array.from(LangFrom)[0] == undefined){
        setSelectedLangFrom(new Set([""]))
        setTranslatedText("")
        return;
      }
      else{setSelectedLangFrom(LangFrom)}
      await translateText(Text,Array.from(LangFrom)[0],"");
    }

    const HandleLangSelectionTo =async (LangTo) =>{
        if (Array.from(LangTo)[0] == undefined){
          setSelectedLangTo(new Set([""]))
          setTranslatedText("")
          return;
        }
        else{setSelectedLangTo(LangTo)}
        console.log(Array.from(LangTo)[0])
        await translateText(Text,"",Array.from(LangTo)[0]);

    }


    const translateText = async (Text_To_Translate,LangFrom="" ,LangTo="") => {
      setText(Text_To_Translate)
      if (!Text_To_Translate || Text_To_Translate.trim() === "" ) {
        console.error("Error: The text input is empty!");
        return;
      }     
      try {
        const params = {
          Text: Text_To_Translate,
          SourceLanguageCode: (LangFrom ==="")? Array.from(selectedLangFrom)[0] : LangFrom,
          TargetLanguageCode: (LangTo ==="")? Array.from(selectedLangTo)[0] : LangTo,
        }
        const response = await translate.translateText(params).promise();
        setTranslatedText(response.TranslatedText);
      } catch (error) {
        console.error("Translation error: ", error);
        console.error("Error details:", error.message, error.stack);
        
      }
    };
        
  return (
    <MainLayout title="Translator" sidebarButtons={sidebarButtons} userName="" userType="">
        <Spacer y={64} />
        <div className="grid grid-cols-1 md:grid-cols-2 ">
            <Card>
                <CardBody className="space-y-4">
                    <Select
                  label="Select Language"
                  placeholder="Choose a Language "
                  selectedKeys={selectedLangFrom}
                  onSelectionChange={HandleLangSelectionFrom}
                
                >
                  {Languages.map((Language) => (
                        <SelectItem key={Language.App} value={Language.App}>
                        {Language.Lang}
                        </SelectItem>
                  ))}
                    </Select> 
                    <Textarea
                    key={"flat"}
                    variant={"flat"}
                    label="FROM"
                    placeholder="Enter text to translate"
                    className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                    value={Text}
                    onChange={(e) => translateText(e.target.value)}
                    
                    />
                </CardBody>
            </Card>

            <Card>
                <CardBody className="space-y-4">
                    <Select
                  label="Select Language"
                  placeholder="Choose a Language "
                  selectedKeys={selectedLangTo}
                  onSelectionChange={HandleLangSelectionTo}
                >
                  {Languages.map((Language) => (
                        <SelectItem key={Language.App} value={Language.App}>
                        {Language.Lang}
                        </SelectItem>
                  ))}
                    </Select> 
                    <Textarea
                    isReadOnly
                    key={"flat"}
                    variant={"flat"}
                    label="TO"
                    className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                    value={TranslatedText}
                    />
                </CardBody>
            </Card>
            
        </div>
     
                  
    </MainLayout>
  );
};

export default Translator;