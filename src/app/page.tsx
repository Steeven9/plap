"use client";

import Textfield from "@/components/textfield";
import VoteSelector from "@/components/voteSelector";
import { Vote } from "@/utils/game";
import { socket } from "@/utils/socket";
import useDebounce from "@/utils/useDebounce";
import Link from "next/link";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export default function Home() {
  const defaultIssueKey = process.env.NEXT_PUBLIC_DEFAULT_ISSUE_KEY ?? "ABC-";
  // textfields
  const [name, setName] = useState("");
  const [storyName, setStoryName] = useState(defaultIssueKey);
  const debouncedStoryName = useDebounce(storyName, 500);
  // results and data
  const [playersCount, setPlayersCount] = useState(0);
  const [results, setResults] = useState<Vote[]>([]);
  const [isExploding, setIsExploding] = useState(false);

  const resourcesLinks = JSON.parse(
    process.env.NEXT_PUBLIC_RESOURCES_LINKS ?? "{}"
  );

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

  useEffect(() => {
    if (debouncedStoryName != defaultIssueKey) {
      socket.emit("updateStory", debouncedStoryName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedStoryName]);

  return (
    <>
      {isExploding ? (
        <Confetti
          recycle={false}
          numberOfPieces={200}
          onConfettiComplete={() => setIsExploding(false)}
        />
      ) : null}

      <Textfield
        name="Name"
        placeholder="Best developer ever"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          localStorage.setItem("plap_name", e.target.value);
        }}
        required
      />

      <Textfield
        name="Issue key"
        placeholder={process.env.NEXT_PUBLIC_DEFAULT_ISSUE_KEY}
        value={storyName}
        onChange={(e) => setStoryName(e.target.value)}
        required
      />

      <div className="mt-6">
        <div className="text-xl mb-2">Your vote</div>
        <VoteSelector
          name={name}
          enabled={results.length == 0 && name.length > 0}
        />
      </div>

      {results.length > 0 ? (
        <div className="mt-6 p-2 border border-amber-600">
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

      <div className="mt-6">Connected players: {playersCount}</div>

      <div className="mt-6">
        <div className="text-xl mb-2">Resources</div>
        {Object.entries(resourcesLinks).map(([name, url]) => (
          <Link
            key={name}
            className="block ml-2 mb-2"
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
