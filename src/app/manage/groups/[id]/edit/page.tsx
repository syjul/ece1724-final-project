"use client"

import { Suspense } from "react";
import EditGroup from "@/components/group/editGroup";
import Navbar from "@/components/navbar";



export default function GroupEdit() {
  return (
    <Suspense>
      <Navbar activeTab={2} />
      <EditGroup />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";
