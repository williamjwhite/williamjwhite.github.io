import * as React from "react";

export function TwoCol({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {left}
      {right}
    </div>
  );
}
