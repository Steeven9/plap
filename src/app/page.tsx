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
  const defaultAdminNames = (
    process.env.NEXT_PUBLIC_DEFAULT_ADMIN_NAME ?? "admin"
  ).split(", ");
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
  const isAdmin =
    name.length > 0 && defaultAdminNames.includes(name.toLowerCase());

  useEffect(() => {
    // first load: show help message
    if (localStorage.getItem("plap_show_help") === "true") {
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

        <div className="text-xl mb-2 mt-4">As a player (engineer)</div>
        <p>
          Wait for the correct issue key to appear and cast your vote -
          don&apos;t worry, you can change it until the results are revealed.
          <br />
          Please <b>don&apos;t</b> try to change the issue key, as that will
          reset the votes of everyone. Let the dealer deal with that 🥁
        </p>

        <div className="text-xl mb-2 mt-4">As a dealer (PO/SM)</div>
        <p>
          Enter the issue key and press on the <i>None</i> button to skip
          voting. The issue will be updated for everyone only <b>after</b> you
          click on the vote button.
          <br />
          When everyone has voted, the results will be displayed automatically.
          If for some reason they don&apos;t, use the <i>Reveal</i> button at
          the bottom of the page.
          <br />
          There are some links at the bottom of the page to quickly access
          useful resources like backlog and reference stories without searching
          in wiki 😉
        </p>

        <p className="mt-2">
          The app is designed to work without refreshing the page. If you
          don&apos;t see anything move, just <b>wait</b> - the dealer is
          probably still switching tabs 🙃
          <br />
          Important note: the process will be stuck until everyone has voted! If
          you don&apos;t know what to vote, press on <i>None</i>.
        </p>

        <Button
          label="🚀 Let's go!"
          className="mt-6"
          onClick={() => {
            localStorage.setItem("plap_show_help", "false");
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
        <div className="text-xl mb-4">Useful links</div>
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

      <Button
        label="🆘 Tutorial"
        className="m-2 mt-6"
        tooltip="Show some useful instructions to get started"
        onClick={() => setShowHelp(true)}
      />

      {isAdmin ? (
        <div className="mt-6">
          <div className="text-xl mb-2">Admin controls</div>
          <Button
            label="🗑️ Clear"
            className="m-2"
            tooltip="Resets all votes and the issue key"
            onClick={() => socket.emit("updateStory", "")}
          />
          <Button
            label="♻️ Reload"
            className="m-2"
            tooltip="Reload the page for everyone (use if everything is broken)"
            onClick={() => socket.emit("reload")}
          />
          <Button
            label="👀 Reveal"
            className="m-2"
            tooltip="Force reveal the votes (use if they aren't showing)"
            onClick={() => socket.emit("reveal")}
          />
        </div>
      ) : null}
    </>
  );
}
