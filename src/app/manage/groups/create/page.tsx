"use client"

import { Suspense } from "react";
import CreateGroup from "@/components/createGroup";
import Navbar from "@/components/navbar";



export default function User() {
  return (
    <Suspense>
      <Navbar activeTab={2} />
      <CreateGroup />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";
