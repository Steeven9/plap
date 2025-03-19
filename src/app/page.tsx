"use client";

import VoteSelector from "@/components/voteSelector";
import { socket } from "@/socket";
import { Vote } from "@/utils/game";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [storyName, setStoryName] = useState("");
  const [playersCount, setPlayersCount] = useState(0);
  const [results, setResults] = useState([]);

  useEffect(() => {
    socket.on("newStory", (data) => {
      console.info("Update story name");
      setStoryName(data);
      setResults([]);
    });

    socket.on("revealVotes", (data) => {
      console.info("Revealing", data);
      setResults(data);
    });

    socket.on("updatePlayers", (data) => {
      console.info("New players joined", data);
      setPlayersCount(data);
    });

    return () => {
      socket.off("newStory");
    };
  }, []);

  return (
    <>
      <div className="m-4">
        {/* TODO make component and r/w from localstorage */}
        Name
        <br />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Best developer ever"
          className="bg-white text-black"
        />
      </div>

      <div className="m-4">
        Story
        <br />
        <input
          type="text"
          value={storyName}
          onChange={(e) => setStoryName(e.target.value)}
          onBlur={() => socket.emit("updateStory", storyName)}
          className="bg-white text-black"
        />
      </div>

      <div>Players: {playersCount}</div>

      <div className="m-4">
        <div>Your vote</div>
        <VoteSelector name={name} />
      </div>

      {results.length > 0 ? (
        <div className="m-4 border border-amber-600">
          <div>Results</div>
          {results.map((result: Vote) => (
            <div key={result.name}>
              {result.name} voted {result.vote}
            </div>
          ))}
        </div>
      ) : null}

      <div className="m-4">
        <div>Resources</div>
        {
          //TODO grab from env vars
        }
        <Link className="block ml-1" href="">
          Reference stories
        </Link>
        <Link className="block ml-1" href="">
          Jira board
        </Link>
      </div>
    </>
  );
}
