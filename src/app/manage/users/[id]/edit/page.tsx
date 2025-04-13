"use client"

import { Suspense } from "react";
import EditUser from "@/components/editUser";
import Navbar from "@/components/navbar";

export default function User() {
  return (
    <Suspense>
      <Navbar activeTab={1} />
      <EditUser />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";
