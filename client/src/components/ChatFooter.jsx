import React, { useState } from 'react';
import axios from 'axios';
import { baseURL } from "../util";

const ChatFooter = ({ openChat, socket, user, setMessages }) => {
    const [MessageChannel, setMessage] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newMessage = {
            sender: user._id,
            message, 
            chatId: openChat.chatId
        }

        let receivers = openChat.members.filter((memberId) => memberId !== user.id);
        // Send new message to any other members of the chat that are online
        socket.current.emit("sendMessage", {
            sender: user._id,
            receivers,
            message
        })
        // add message to DB
        await axios.post(`${baseURL}/users/message`, newMessage).then((res) => {
            console.log(res.data.message);
            setMessages((prev) => [...prev, res.data.message]);
        }).catch(err => console.log(err))
        setMessage("");
    }
}