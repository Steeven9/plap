"use client";

import { socket } from "@/socket";
import { Vote } from "@/utils/game";
import { sizes } from "@/utils/sizes";
import { useEffect, useState } from "react";
import Button from "./button";

interface Props {
  name: string;
  enabled: boolean;
}

export default function VoteSelector({ name, enabled }: Props) {
  const [selectedSize, setSelectedSize] = useState("");

  function selectSize(size: string) {
    setSelectedSize(size);

    const data: Vote = {
      vote: size,
      name: name,
    };
    socket.emit("submitVote", data);
  }

  useEffect(() => {
    socket.on("newStory", () => {
      console.info("Reset size");
      setSelectedSize("");
    });

    return () => {
      socket.off("newStory");
    };
  }, []);

  return sizes.map((size) => (
    <Button
      label={size.tshirt}
      key={size.tshirt}
      disabled={!enabled}
      className={`m-2 ${selectedSize === size.tshirt ? "bg-blue-600!" : ""}`}
      onClick={() => selectSize(size.tshirt)}
    />
  ));
}
