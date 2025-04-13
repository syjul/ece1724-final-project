"use client"

import { Suspense } from "react";
import EditGroup from "@/components/editGroup";
import Navbar from "@/components/navbar";



export default function User() {
  return (
    <Suspense>
      <Navbar activeTab={2} />
      <EditGroup />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";
