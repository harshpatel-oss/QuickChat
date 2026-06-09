import { Server } from "socket.io";

export const userSocketMap = {};

export const io = new Server({
    cors: {
        origin: "*"
    }
});

export const attachSocketServer = (server) => {
    io.attach(server);

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        console.log("User Connected", userId);

        if (userId) userSocketMap[userId] = socket.id;

        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        socket.on("disconnect", () => {
            console.log("User Disconnected", userId);
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
    });
};
