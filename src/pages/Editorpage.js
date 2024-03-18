import React,{useState,useRef, useEffect} from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import ACTIONS from "../Actions";
import initSocket from "../socket";
import { useLocation, useNavigate, Navigate,useParams} from 'react-router-dom';



const Editorpage = () => {
    const socketRef = useRef(null);
    const {roomId} = useParams();
    
    const location =useLocation();
    const reactNavigate = useNavigate();
    const [clients, setClients] = useState([
       
    
    ]);
    

     useEffect(() => {
        const init = async() =>{
            socketRef.current =await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);//toast adding is pending
                alert("Socket connection failed, try again later");
                reactNavigate('/');
            }

            socketRef.current.emit(ACTIONS.JOIN,{
                roomId,   
                username:location.state?.username
            });

            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        alert(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    
                }
            )
            

        }
        init();
       
    },[])
    
    
    
    //if (!location.state) {
      //  return <Navigate to="/" />;
    //}







  

    return (
        <div className="mainWrap">
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img  className="logoImage" src="/code-sync.png" alt="logo"></img>
                    </div>
                    <h3>Connected</h3>
                    <div className="clientsList">
                        {clients.map((client) => (
                            <Client
                                key={client.socketId}
                                username={client.username}
                            />
                        ))}
                    </div>
                </div>
                <button className="btn copyBtn" >
                    Copy ROOM ID
                </button>
                <button className="btn leaveBtn" >
                    Leave
                </button>

            </div>
            <div className="editorWrap">
            <Editor/>
            </div>
           
        </div>
    );
};

export default Editorpage;