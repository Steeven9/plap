"use client";

import VoteSelector from "@/components/voteSelector";
import { socket } from "@/socket";
import { Vote } from "@/utils/game";
import Link from "next/link";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export default function Home() {
  const [name, setName] = useState("");
  const [storyName, setStoryName] = useState(
    process.env.NEXT_PUBLIC_DEFAULT_ISSUE_KEY ?? ""
  );
  const [playersCount, setPlayersCount] = useState(0);
  const [results, setResults] = useState<Vote[]>([]);
  const resourcesLinks = JSON.parse(
    process.env.NEXT_PUBLIC_RESOURCES_LINKS ?? "{}"
  );
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    socket.on("newStory", (data) => {
      console.info("Update story name");
      setStoryName(data);
      setResults([]);
    });

    socket.on("revealVotes", (data: Vote[]) => {
      console.info("Revealing", data);
      setResults(data);
      if (data.every((vote) => vote.vote == data[0].vote)) {
        // we all have the same vote
        setIsExploding(true);
      }
    });

    socket.on("updatePlayers", (data) => {
      console.info("New players joined", data);
      setPlayersCount(data);
    });

    setName(localStorage.getItem("plap_name") ?? "");

    return () => {
      socket.off("newStory");
    };
  }, []);

  return (
    <>
      {isExploding ? (
        <Confetti
          recycle={false}
          numberOfPieces={500}
          onConfettiComplete={() => setIsExploding(false)}
        />
      ) : null}

      <div className="m-4">
        Name
        <br />
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            localStorage.setItem("plap_name", e.target.value);
          }}
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
          placeholder={process.env.NEXT_PUBLIC_DEFAULT_ISSUE_KEY}
          onChange={(e) => setStoryName(e.target.value)}
          onBlur={() => socket.emit("updateStory", storyName)}
          className="bg-white text-black"
        />
      </div>

      <div className="m-4">Players: {playersCount}</div>

      <div className="m-4">
        <div>Your vote</div>
        <VoteSelector name={name} enabled={results.length == 0} />
      </div>

      {results.length > 0 ? (
        <div className="m-4 p-2 border border-amber-600">
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
        {Object.entries(resourcesLinks).map(([name, url]) => (
          <Link
            key={name}
            className="block ml-1"
            href={url as string}
            target="_blank"
          >
            {name}
          </Link>
        ))}
      </div>
    </>
  );
}
