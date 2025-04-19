"use client"

import { Suspense } from "react";
import CreateUser from "@/components/user/createUser";
import Navbar from "@/components/navbar";

export default function User() {
  return (
    <Suspense>
      <Navbar activeTab={1} />
      <CreateUser />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";
