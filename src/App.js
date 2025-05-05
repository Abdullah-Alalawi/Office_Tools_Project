import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Translator from './Pages/Translator';
import AIChatGPT from './Pages/GPTChatBot';
import AIChatDeepSeek from './Pages/DeepSeekChatBot';
import GrammarChecker from './Pages/GrammarCorrection'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/GrammarChecker" replace />} />
        <Route path="/Translator" element={<Translator />} />
        <Route path="/AIChatGPT" element={<AIChatGPT />} /> 
        <Route path="/AIChatDeepSeek" element={<AIChatDeepSeek />} /> 
        <Route path="/GrammarChecker" element={<GrammarChecker />} /> 

      </Routes>
    </BrowserRouter>
  );
}

export default App;
