import React, {useState} from "react";
import MainLayout from "../CommonElements/MainLayout";
import { MdOutlineTranslate } from "react-icons/md";
import { IoChatbubbles } from "react-icons/io5";
import {  Textarea, Card,CardBody, Select, SelectItem , Spacer} from "@nextui-org/react";
import { LuBookOpenCheck } from "react-icons/lu";
import AWS from "aws-sdk";



const Translator = () => {
  const sidebarButtons = [
    { label: "Grammar & Spell Checker", icon: LuBookOpenCheck, path: "/GrammarChecker" },
    { label: "Translator", icon: MdOutlineTranslate, path: "/Translator" },
    { label: "GPT ChatBot", icon: IoChatbubbles, path: "/AIChatGPT" },
    { label: "DeepSeek ChatBot", icon: IoChatbubbles, path: "/AIChatDeepSeek" }
    
  ];
  

      // IAM Role with fullAccess to the aws translation service 
      AWS.config.update({
        accessKeyId: process.env.REACT_APP_AWS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_ACCESS_KEY,
        region: process.env.REACT_APP_AWS_REGION,
      });
      
      const translate = new AWS.Translate();



const Languages = [
  { id: 1,  Lang: "Afrikaans",                   App: "af"    },
  { id: 2,  Lang: "Albanian",                    App: "sq"    },
  { id: 3,  Lang: "Amharic",                    App: "am"    },
  { id: 4,  Lang: "Arabic",                     App: "ar"    },
  { id: 5,  Lang: "Armenian",                   App: "hy"    },
  { id: 6,  Lang: "Azerbaijani",                App: "az"    },
  { id: 7,  Lang: "Bengali",                    App: "bn"    },
  { id: 8,  Lang: "Bosnian",                    App: "bs"    },
  { id: 9,  Lang: "Bulgarian",                  App: "bg"    },
  { id: 10, Lang: "Catalan",                    App: "ca"    },
  { id: 11, Lang: "Chinese (Simplified)",       App: "zh"    },
  { id: 12, Lang: "Chinese (Traditional)",      App: "zh-TW" },
  { id: 13, Lang: "Croatian",                   App: "hr"    },
  { id: 14, Lang: "Czech",                      App: "cs"    },
  { id: 15, Lang: "Danish",                     App: "da"    },
  { id: 16, Lang: "Dari",                       App: "fa-AF" },
  { id: 17, Lang: "Dutch",                      App: "nl"    },
  { id: 18, Lang: "English",                    App: "en"    },
  { id: 19, Lang: "Estonian",                   App: "et"    },
  { id: 20, Lang: "Farsi (Persian)",            App: "fa"    },
  { id: 21, Lang: "Filipino, Tagalog",          App: "tl"    },
  { id: 22, Lang: "Finnish",                    App: "fi"    },
  { id: 23, Lang: "French",                     App: "fr"    },
  { id: 24, Lang: "French (Canada)",            App: "fr-CA" },
  { id: 25, Lang: "Georgian",                   App: "ka"    },
  { id: 26, Lang: "German",                     App: "de"    },
  { id: 27, Lang: "Greek",                      App: "el"    },
  { id: 28, Lang: "Gujarati",                   App: "gu"    },
  { id: 29, Lang: "Haitian Creole",             App: "ht"    },
  { id: 30, Lang: "Hausa",                      App: "ha"    },
  { id: 31, Lang: "Hebrew",                     App: "he"    },
  { id: 32, Lang: "Hindi",                      App: "hi"    },
  { id: 33, Lang: "Hungarian",                  App: "hu"    },
  { id: 34, Lang: "Icelandic",                  App: "is"    },
  { id: 35, Lang: "Indonesian",                 App: "id"    },
  { id: 36, Lang: "Irish",                      App: "ga"    },
  { id: 37, Lang: "Italian",                    App: "it"    },
  { id: 38, Lang: "Japanese",                   App: "ja"    },
  { id: 39, Lang: "Kannada",                    App: "kn"    },
  { id: 40, Lang: "Kazakh",                     App: "kk"    },
  { id: 41, Lang: "Korean",                     App: "ko"    },
  { id: 42, Lang: "Latvian",                    App: "lv"    },
  { id: 43, Lang: "Lithuanian",                 App: "lt"    },
  { id: 44, Lang: "Macedonian",                 App: "mk"    },
  { id: 45, Lang: "Malay",                      App: "ms"    },
  { id: 46, Lang: "Malayalam",                  App: "ml"    },
  { id: 47, Lang: "Maltese",                    App: "mt"    },
  { id: 48, Lang: "Marathi",                    App: "mr"    },
  { id: 49, Lang: "Mongolian",                  App: "mn"    },
  { id: 50, Lang: "Norwegian (Bokmål)",         App: "no"    },
  { id: 51, Lang: "Pashto",                     App: "ps"    },
  { id: 52, Lang: "Polish",                     App: "pl"    },
  { id: 53, Lang: "Portuguese (Brazil)",        App: "pt"    },
  { id: 54, Lang: "Portuguese (Portugal)",      App: "pt-PT" },
  { id: 55, Lang: "Punjabi",                    App: "pa"    },
  { id: 56, Lang: "Romanian",                   App: "ro"    },
  { id: 57, Lang: "Russian",                    App: "ru"    },
  { id: 58, Lang: "Serbian",                    App: "sr"    },
  { id: 59, Lang: "Sinhala",                    App: "si"    },
  { id: 60, Lang: "Slovak",                     App: "sk"    },
  { id: 61, Lang: "Slovenian",                  App: "sl"    },
  { id: 62, Lang: "Somali",                     App: "so"    },
  { id: 63, Lang: "Spanish",                    App: "es"    },
  { id: 64, Lang: "Spanish (Mexico)",           App: "es-MX" },
  { id: 65, Lang: "Swahili",                    App: "sw"    },
  { id: 66, Lang: "Swedish",                    App: "sv"    },
  { id: 67, Lang: "Tamil",                      App: "ta"    },
  { id: 68, Lang: "Telugu",                     App: "te"    },
  { id: 69, Lang: "Thai",                       App: "th"    },
  { id: 70, Lang: "Turkish",                    App: "tr"    },
  { id: 71, Lang: "Ukrainian",                  App: "uk"    },
  { id: 72, Lang: "Urdu",                       App: "ur"    },
  { id: 73, Lang: "Uzbek",                      App: "uz"    },
  { id: 74, Lang: "Vietnamese",                 App: "vi"    },
  { id: 75, Lang: "Welsh",                      App: "cy"    },
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
