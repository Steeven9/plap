import next from "next";
import { createServer } from "node:http";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port, turbopack: true });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  let currentGameData = {
    storyName: process.env.NEXT_DEFAULT_ISSUE_KEY ?? "",
    votes: [],
    connectedPlayers: 0,
  };

  io.on("connection", (socket) => {
    console.info("Connection accepted", socket.id);
    currentGameData.connectedPlayers = currentGameData.connectedPlayers + 1;
    socket.emit("newStory", currentGameData.storyName);
    io.emit("updatePlayers", currentGameData.connectedPlayers);

    socket.on("updateStory", (data) => {
      // input is string, name of the new story
      console.info(`Received story update`, data);
      currentGameData.storyName = data;
      currentGameData.votes = [];
      io.emit("newStory", data);
    });

    socket.on("submitVote", (data) => {
      // input is a Vote object
      console.info(`Received vote update`, data);
      currentGameData.votes = [...currentGameData.votes, data];
      if (currentGameData.votes.length === currentGameData.connectedPlayers) {
        console.info(`Full votes (${currentGameData.connectedPlayers})`);
        io.emit("revealVotes", currentGameData.votes);
      }
    });

    socket.on("disconnect", () => {
      console.info(`Disconnected`, socket.id);
      currentGameData.connectedPlayers = currentGameData.connectedPlayers - 1;
      io.emit("updatePlayers", currentGameData.connectedPlayers);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.info(`> Ready on http://${hostname}:${port}`);
    });
});
