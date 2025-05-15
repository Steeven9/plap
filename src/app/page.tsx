"use client";

import Button from "@/components/button";
import Textfield from "@/components/textfield";
import VoteSelector from "@/components/voteSelector";
import { Vote } from "@/utils/game";
import { socket } from "@/utils/socket";
import Link from "next/link";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export default function Home() {
  // setup
  const defaultIssueKey = process.env.NEXT_PUBLIC_DEFAULT_ISSUE_KEY ?? "ABC-";
  const defaultAdminName =
    process.env.NEXT_PUBLIC_DEFAULT_ADMIN_NAME ?? "admin";
  const resourcesLinks = JSON.parse(
    process.env.NEXT_PUBLIC_RESOURCES_LINKS ?? "{}"
  );
  const [showHelp, setShowHelp] = useState(false);
  // textfields
  const [name, setName] = useState("");
  const [storyName, setStoryName] = useState(defaultIssueKey);
  // results and data
  const [playersCount, setPlayersCount] = useState(0);
  const [results, setResults] = useState<Vote[]>([]);
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    // first load: show help message
    if (localStorage.getItem("plap_hide_help") != "true") {
      setShowHelp(true);
    }

    // read name from localstorage, if any
    setName(localStorage.getItem("plap_name") ?? "");

    // set up socket events
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

    socket.on("reload", () => {
      location.reload();
    });

    return () => {
      socket.off("newStory");
    };
  }, []);

  if (showHelp) {
    return (
      <>
        <div className="text-2xl mb-2">How2plap</div>
        <p>Fill in your name first - can&apos;t vote without that!</p>

        <div className="text-xl mb-2 mt-4">As a dealer (PO/SM)</div>
        <p>
          Enter the issue key and press on <i>None</i> to skip voting. The issue
          will be updated for everyone only after you click on the vote button.
          <br />
          When everyone has voted, the results will be displayed automatically.
          If for some reason they don&apos;t, use the <i>Reveal</i> button at
          the bottom of the page.
        </p>

        <div className="text-xl mb-2 mt-4">As a player (engineer)</div>
        <p>
          Wait for the correct issue key to appear and cast your vote -
          don&apos;t worry, you can change it until the results are revealed.
          <br />
          Please don&apos;t try to change the issue key, as that will reset the
          votes of everyone. Let the dealer deal with that 🥁
        </p>

        <p className="mt-2">
          The app is designed to work without refreshing the page. If you
          don&apos;t see anything move, just wait - the dealer is probably still
          switching tabs 🙃
        </p>

        <Button
          label="🚀 Let's go!"
          className="mt-4"
          onClick={() => {
            localStorage.setItem("plap_hide_help", "true");
            setShowHelp(false);
          }}
        />
      </>
    );
  }

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
        onBlur={(e) => socket.emit("updateStory", e.target.value)}
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
        <div className="text-xl mb-2">
          Useful links to click directly instead of searching in Wiki
        </div>
        {Object.entries(resourcesLinks).map(([name, url]) => (
          <Link
            key={name}
            className="block ml-2 mb-2 w-fit"
            href={url as string}
            target="_blank"
          >
            {name}
          </Link>
        ))}
      </div>

      {/* TODO better auth lmao */}
      {name === defaultAdminName ? (
        <div className="mt-6">
          <div className="text-xl mb-2">Admin controls</div>
          <Button
            label={"♻️ Reload"}
            className={`m-2`}
            onClick={() => socket.emit("reload")}
          />
          <Button
            label={"👀 Reveal"}
            className={`m-2`}
            onClick={() => socket.emit("reveal")}
          />
        </div>
      ) : null}
    </>
  );
}
