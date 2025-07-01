// import Call2 from '../layout2/call2'
import Project2 from '../layout2/project2'
import Agent2 from '../layout2/agent2';
import Sentiment2 from '../layout2/sentiment2'
import Chatbot2 from '../layout2/chatbot2'
import { Route, Routes } from 'react-router-dom'
import Layout2 from '../layout2/layout2'


const SecondLayout = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout2 />} >
                <Route index element={<Project2 />} />
                <Route path='/call' element={<Agent2 />} />
                <Route path='/sentiment2' element={<Sentiment2 />} />
                <Route path='/chatbot2' element={<Chatbot2 />} />
            </Route>
        </Routes>
    )
}
export default SecondLayout