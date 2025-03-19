"use client";

import { sizes } from "@/utils/sizes";
import { useState } from "react";
import Button from "./button";

export default function VoteSelector() {
  const [selectedSize, setselectedSize] = useState("");

  function selectSize(size: string) {
    setselectedSize(size);
    //TODO send to socket
  }

  return sizes.map((size) => (
    <Button
      label={size.tshirt}
      key={size.tshirt}
      className={`m-2 ${selectedSize === size.tshirt ? "bg-blue-600!" : ""}`}
      onClick={() => selectSize(size.tshirt)}
    />
  ));
}
