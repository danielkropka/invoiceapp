import { Switch } from "@/components/ui/switch";
import React from "react";

function Page() {
  return (
    <div className="flex">
      <div className="flex flex-row items-center justify-between">
        <span className="text-2xl font-semibold">Motyw</span>
        <Switch />
      </div>
    </div>
  );
}

export default Page;
