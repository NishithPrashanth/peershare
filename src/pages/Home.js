import React,{useState} from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useNavigate} from 'react-router-dom';

const Home = () => {
    const [roomId, setInputValue] = useState('');
    const [username, setUserName] = useState('');
    const navigate = useNavigate();

    const createRoom = (e) => {
        e.preventDefault();
        const id = uuidv4();
        setInputValue(id);
        
        

    }
    const joinRoom = (e) => {
        e.preventDefault(); // Prevents the default form submission behavior, if this function is attached to a form onSubmit event
    
        if (!roomId || !username) {
            
            return;
        }
    
        // Redirect to the editor page with the roomId and username in the state
        navigate(`/editor/${roomId}`, {
            state: {
                username: username, // Ensure that username is defined
            },
        });
    };
    


    return (
        <div className="homePageWrapper">
            <div className="formWrapper">
                <img
                    className="homePageLogo"
                    src="/code-sync.png"
                    alt="code-sync-logo"
                />
                <h4 className="mainLabel">Paste invitation ROOM ID</h4>
                <div className="inputGroup">
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="ROOM ID"
                        value={roomId}
                        onChange={(e) => setInputValue(e.target.value)}
                       
                    />
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="USERNAME"
                        onChange={(e) => setUserName(e.target.value)}
                        value={username}
                        
                    />
                    <button className="btn joinBtn" onClick={joinRoom}>
                        Join
                    </button>
                    <span className="createInfo">
                        If you don't have an invite then create &nbsp;
                       <a onClick={createRoom} href="#" className='createNewBtn'  >new room</a>
                    </span>
                </div>
            </div>
            <footer>
                <h4>
                    Built with 💛 &nbsp; by &nbsp;
                    <a href="https://github.com/NishithPrashanth">Nishith</a>
                </h4>
            </footer>
        </div>
    );
};

export default Home;