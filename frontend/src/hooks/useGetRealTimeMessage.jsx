import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "@/redux/chatSlice";
import { useSocket } from "@/App";

const useGetRealTimeMessage = () => {
    const dispatch = useDispatch();
    const { messages } = useSelector(store => store.chat);
    const socket = useSocket();

    const messageReceivedSound=new Audio('/sounds/message_received.mp3')

    useEffect(() => {
        if (!socket) return;

        socket.on('newMessage', (newMessage) => {
            dispatch(setMessages([...messages, newMessage]));
            messageReceivedSound.play()
        });

        return () => {
            socket.off('newMessage');
        };
    }, [socket, messages, dispatch]);

    return null;
};

export default useGetRealTimeMessage;
