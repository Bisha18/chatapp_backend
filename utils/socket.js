const connectedUsers = {};

export const addConnectedUser = (
  socketId,
  email,
  currentRoomId,
  userId = null
) => {
  connectedUsers[socketId] = { email, currentRoomId, userId };
  console.log(
    `Connected user added: ${email} (Socket: ${socketId}) in room ${currentRoomId}`
  );
};

export const removeConnectedUser = (socketId) => {
  const user = connectedUsers[socketId];
  delete connectedUsers[socketId];
  console.log(
    `Connected user removed: ${
      user ? user.email : "unknown"
    } (Socket: ${socketId})`
  );
  return user;
};

export const getConnectedUsersInRoom = (roomId) => {
  // FIX: Only return email, as socketId is not a property of the user object stored.
  return Object.values(connectedUsers)
    .filter((user) => user.currentRoomId === roomId)
    .map((user) => ({ email: user.email }));
};

export const getConnectedUserBySocketId = (socketId) => {
    return connectedUsers[socketId];
};