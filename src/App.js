import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Translator from './Pages/Translator';
import AIChatGPT from './Pages/GPTChatBot';
import AIChatDeepSeek from './Pages/DeepSeekChatBot';
import GrammarChecker from './Pages/GrammarCorrection'
import Login from './LoginSection/Login';
import PasswordResetPage from './LoginSection/PasswordResetPage';
import SendEmailPage from './LoginSection/SendEmailPage';
import OTPConfirmation from './LoginSection/OTPConfirmation';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/GrammaerChecker" replace />} />
        <Route path="/Translator" element={<Translator />} />
        <Route path="/AIChatGPT" element={<AIChatGPT />} /> 
        <Route path="/AIChatDeepSeek" element={<AIChatDeepSeek />} /> 
        <Route path="/GrammarChecker" element={<GrammarChecker />} /> 
        <Route path="/Login" element={<Login />} /> 
        <Route path="/PasswordReset" element={<PasswordResetPage />} /> 
        <Route path="/SendEmailPage" element={<SendEmailPage/>}/>
        <Route path="/OTPConfirmation" element={<OTPConfirmation/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
