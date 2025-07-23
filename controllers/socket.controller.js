import mongoose from "mongoose";
import Room from "../models/room.model.js";
import Message from "../models/message.model.js";
import {
  addConnectedUser,
  getConnectedUserBySocketId,
  getConnectedUsersInRoom,
  removeConnectedUser,
} from "../utils/socket.js";

const setupSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log(`A new client connected: ${socket.id}`);

    socket.on("joinRoom", async ({ email, roomId, userId }) => {
      const currentUser = getConnectedUserBySocketId(socket.id);
      if (currentUser && currentUser.currentRoomId) {
        const prevRoomId = currentUser.currentRoomId;
        socket.leave(prevRoomId);
        console.log(`User ${email} left room ${prevRoomId}`);
        io.to(prevRoomId).emit("roomUsers", getConnectedUsersInRoom(prevRoomId));
      }

      //find or create the room in database
      let room;
      try {
        if (mongoose.Types.ObjectId.isValid(roomId)) {
          room = await Room.findById(roomId);
        }
        if (!room) {
          room = await Room.findOne({ name: roomId });
        }
        if (!room) {
          room = new Room({ name: roomId });
          await room.save();
          console.log(`New room created in DB: ${room.name} (ID: ${room._id})`);
          io.emit("newRoomCreated", room); // Inform all connected clients
        }
        roomId = room._id.toString();
      } catch (error) {
        console.error(
          `Error finding/creating room for ${email}:`,
          error.message
        );
        socket.emit(
          "error",
          "Failed to join room: Server error during room lookup/creation."
        );
        return;
      }

      //Add user to the socket.io room and our in-memory connectedUsers
      socket.join(roomId);
      addConnectedUser(socket.id, email, roomId, userId);

      console.log(
        `${email} (Socket: ${socket.id}) joined Socket.io room: ${room.name} (ID: ${roomId})`
      );

      // fetch and send chat history for the joined room

      try {
        const messages = await Message.find({ room: roomId })
          .sort({ timestamp: 1 })
          .limit(100);
        socket.emit("chatHistory", messages);
        console.log(
          `Sent ${messages.length} messages history to ${email} for room ${room.name}`
        );
      } catch (error) {
        console.error(
          `Error fetching chat history for room ${roomId}:`,
          error.message
        );
        socket.emit("error", "Failed to load chat history.");
      }

      // Broadcast the updated online user list to everyone in the room
      io.to(roomId).emit("roomUsers", getConnectedUsersInRoom(roomId));
      console.log(
        `Broadcasted updated online users for room ${room.name}. Count: ${
          getConnectedUsersInRoom(roomId).length
        }`
      );

      //send welcome messages

      socket.emit("message", {
        senderUsername: "system",
        text: `Welcome to ${room.name}!, ${email}`,
        timestamp: new Date(),
      });

      socket.to(roomId).emit("message", {
        senderUsername: "System",
        text: `${email} has joined the room.`,
        timestamp: new Date(),
      });
    });

    socket.on("chatMessage", async (msgText) => {
      const user = getConnectedUserBySocketId(socket.id);
      if (
        user &&
        msgText &&
        typeof msgText === "string" &&
        msgText.trim() !== ""
      ) {
        try {
          const newMessage = new Message({
            room: user.currentRoomId,
            sender: user.userId || null,
            senderUsername: user.email,
            text: msgText.trim(),
            timestamp: new Date(),
          });
          await newMessage.save();

          io.to(user.currentRoomId).emit("message", {
            senderUsername: user.email,
            text: msgText.trim(),
            timestamp: newMessage.timestamp,
          });
          console.log(
            `Message from ${user.email} in room ${
              user.currentRoomId
            }: "${msgText.trim()}"`
          );
        } catch (error) {
          console.error(
            `Error saving/broadcasting message from ${user.email}:`,
            error.message
          );
          socket.emit("error", "Failed to send message.");
        }
      } else {
        socket.emit(
          "error",
          "Cannot send empty message or user not in a room."
        );
      }
    });

    socket.on("typing", (isTyping) => {
      const user = getConnectedUserBySocketId(socket.id);
      if (user) {
        socket.to(user.currentRoomId).emit("typingStatus", {
          email: user.email,
          isTyping: isTyping,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
      const user = removeConnectedUser(socket.id);
      if (user && user.currentRoomId) {
        io.to(user.currentRoomId).emit(
          "roomUsers",
          getConnectedUsersInRoom(user.currentRoomId)
        );
        socket.to(user.currentRoomId).emit("message", {
          senderUsername: "System",
          text: `${user.email} has left the room.`,
          timestamp: new Date(),
        });
        console.log(
          `${user.email} left room ${user.currentRoomId} due to disconnect.`
        );
      }
    });

    socket.on("error", (errorMessage) => {
      console.error("Socket error emitted to client:", errorMessage);
    });
  });
};

export default setupSocketHandlers;