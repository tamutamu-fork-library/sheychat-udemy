import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatArea from "./components/ChatArea";
import UserSearch from "./components/UserSearch";
import UsersList from "./components/UsersList";
import { SetAllUsers } from "../redux/userSlice";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL);
function Home() {
  const [searchKey, setSearchKey] = React.useState("");
  const { selectedChat, user } = useSelector((state) => state.userReducer);
  const [onlineUsers, setOnlineUsers] = React.useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    // join the room
    if (user) {
      socket.emit("join-room", user._id);
      socket.emit("came-online", user._id);

      socket.on("online-users-updated", (users) => {
        setOnlineUsers(users);
        dispatch(SetAllUsers(users));
      });
    }
  }, [user]);

  return (
    <div className="flex gap-5">
      {/* 1st part   user search , userslist/chatlist */}
      <div className="w-96">
        <UserSearch searchKey={searchKey} setSearchKey={setSearchKey} />
        <UsersList
          searchKey={searchKey}
          socket={socket}
          onlineUsers={onlineUsers}
        />
      </div>

      {/* 2nd part   chatbox */}
      {selectedChat && (
        <div className="w-full">
          <ChatArea socket={socket} />
        </div>
      )}

      {!selectedChat && (
        <div className="w-full h-[80vh]  items-center justify-center flex bg-white flex-col">
          <img
            src="https://www.pngmart.com/files/16/Speech-Chat-Icon-Transparent-PNG.png"
            alt=""
            className="w-96 h-96"
          />
          <h1 className="text-2xl font-semibold text-gray-500">
            Select a user to chat
          </h1>
        </div>
      )}
    </div>
  );
}

export default Home;
