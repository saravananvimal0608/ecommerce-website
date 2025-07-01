import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Dashboard from './components/dashboard';
import Layout from './components/layout';
import Project from './components/project'
import Call from './components/call'
import Agent from './components/agent'
import Sentiment from './components/sentiment'
import Chatbot from './components/chatbot'
import Whatsapp from './components/whatsapp'
import SecondLayout from './layout2/link'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='/project' element={<Project />} />
          <Route path='/call' element={<Call />} />
          <Route path='/agent' element={<Agent />} />
          <Route path='/sentiment' element={<Sentiment />} />
          <Route path='/chatbot' element={<Chatbot />} />
          <Route path='/whatsapp' element={<Whatsapp />} />
        </Route>


        <Route path="/admin/*" element={<SecondLayout />}/>
          
       
      </Routes>
    </BrowserRouter>
  );
};

export default App;
