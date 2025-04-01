"use client";
import { Button } from "@/components/ui/button";

export default function SetCookieButton({
  handleClick,
}: {
  handleClick: () => void;
}) {
  return <Button onClick={handleClick}>click here</Button>;
}
