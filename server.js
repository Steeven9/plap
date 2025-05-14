import next from "next";
import { createServer } from "node:http";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port, turbopack: true });
const handler = app.getRequestHandler();

const filterVotes = (votes) => {
  return Array.from(votes.entries())
    .map(([name, vote]) => ({
      name,
      vote,
    }))
    .filter((vote) => vote.vote != "None");
};

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  let currentGameData = {
    storyName: process.env.NEXT_PUBLIC_DEFAULT_ISSUE_KEY ?? "",
    votes: new Map(), //<string, string>
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
      currentGameData.votes = new Map();
      io.emit("newStory", data);
    });

    socket.on("submitVote", (data) => {
      // input is a Vote object
      console.info(
        `Received vote update from ${data.name}: ${data.vote}`,
        currentGameData.votes
      );
      currentGameData.votes.set(data.name, data.vote);

      if (currentGameData.votes.size === currentGameData.connectedPlayers) {
        console.info(`Full votes (${currentGameData.votes.size})`);

        io.emit("revealVotes", filterVotes(currentGameData.votes));
      }
    });

    socket.on("reload", () => {
      console.info(`Force reload`, socket.id);
      io.emit("reload");
    });

    socket.on("reveal", () => {
      console.info(`Force reveal`, socket.id);
      io.emit("revealVotes", filterVotes(currentGameData.votes));
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
