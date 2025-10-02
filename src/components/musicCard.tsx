import React from "react";
import {
  Card,
  CardDescription,
  // CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MusicCardType } from "@/app/page";

export function MusicCard({
  musicCard,
  hidden,
  success = null,
}: {
  hidden: boolean;
  musicCard: MusicCardType;
  success?: boolean | null;
}) {
  return (
    <Card
      className="w-30 h-40"
      style={{
        border:
          success === true
            ? "2px solid green"
            : success === false
            ? "2px solid red"
            : undefined,
      }}
    >
      <CardHeader className="text-center">
        <CardTitle>{!hidden ? musicCard.year : "???"}</CardTitle>
        {!hidden && (
          <>
            <CardDescription>{musicCard.title}</CardDescription>
            <CardDescription>{musicCard.artist}</CardDescription>
          </>
        )}
      </CardHeader>
    </Card>
  );
}
