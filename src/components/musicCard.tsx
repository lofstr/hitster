import React from "react";
import {
  Card,
  // CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function MusicCard({ year }: { year: number }) {
  return (
    <Card className="w-25">
      <CardHeader className="text-center">
        <CardTitle>{year}</CardTitle>
        {/* <CardDescription>Håll till höger Svensson</CardDescription>
          <CardDescription>The Telstars</CardDescription> */}
      </CardHeader>
    </Card>
  );
}
