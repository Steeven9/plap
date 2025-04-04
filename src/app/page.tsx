"use client";

import Button from "@/components/button";
import VoteSelector from "@/components/voteSelector";
import { Vote } from "@/utils/game";
import { socket } from "@/utils/socket";
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
    socket.on("newStory", (data: string) => {
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

    socket.on("updatePlayers", (data: number) => {
      console.info("New player joined", data);
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
          className="textfield"
        />
      </div>

      <div className="m-4">
        Issue key
        <br />
        <input
          type="text"
          value={storyName}
          placeholder={process.env.NEXT_PUBLIC_DEFAULT_ISSUE_KEY}
          onChange={(e) => setStoryName(e.target.value)}
          className="textfield mr-2"
        />
        <Button
          label="Update"
          onClick={() => socket.emit("updateStory", storyName)}
        />
      </div>

      <div className="m-4">Players: {playersCount}</div>

      <div className="m-4">
        <div>Your vote</div>
        <VoteSelector
          name={name}
          enabled={results.length == 0 && name.length > 0}
        />
      </div>

      {results.length > 0 ? (
        <div className="m-4 p-2 border border-amber-600">
          <div className="text-xl mb-2">Results</div>
          {results
            .toSorted((a, b) => a.name.localeCompare(b.name))
            .map((result: Vote) => (
              <div key={result.name}>
                {result.name} voted {result.vote}
              </div>
            ))}
        </div>
      ) : null}

      <div className="m-4">
        <div className="text-xl mb-2">Resources</div>
        {Object.entries(resourcesLinks).map(([name, url]) => (
          <Link
            key={name}
            className="block ml-2"
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
