"use client"

import { Suspense, useEffect } from "react";
import CreateLogin from "@/components/createLogin"
import { authClient } from "@/lib/auth-client";

export default function Home() {
  // check if already logged in
useEffect(()=>{
  authClient.getSession().then((d)=>{
    if(!d.error && d.data) {
      window.location.href = "/dashboard"
    }})
},[])

  return (
    <Suspense>
      <CreateLogin />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";
