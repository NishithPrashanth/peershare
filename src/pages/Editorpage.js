import React,{useState,useRef, useEffect} from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import ACTIONS from "../Actions";
import initSocket from "../socket";
import { useLocation, useNavigate, Navigate,useParams} from 'react-router-dom';



const Editorpage = () => {
    const socketRef = useRef(null);
    const {roomId} = useParams();
    const codeRef = useRef(null);
    
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
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                    
                }
            )

            //for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    if (username !== location.state?.username) {
                        alert(`${username} left the room.`);
                        console.log(`${username} left`);
                    }
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
            

        }
        init();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
       
    },[])

    function copyRoomId() {
       
    
        navigator.clipboard.writeText(roomId)
            .then(() => {
                alert("Room ID copied to clipboard");
            })
            .catch((error) => {
                console.error('Failed to copy: ', error);
                alert("Failed to copy Room ID to clipboard");
            });
    }
    

    function leaveRoom(){
        reactNavigate('/');
    }
    
    
    
    if (!location.state) {
        return <Navigate to="/" />;
    }







  

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
                <button className="btn copyBtn" onClick={copyRoomId} >
                    Copy ROOM ID
                </button>
                <button className="btn leaveBtn" onClick={leaveRoom} >
                    Leave
                </button>

            </div>
            <div className="editorWrap">
            <Editor
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={(code) => {
                codeRef.current = code;
            }}
        
            />
            </div>
           
        </div>
    );
};

export default Editorpage;