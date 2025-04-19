"use client"

import { Suspense } from "react";
import CreateQuiz from "@/components/quiz/createQuiz";
import Navbar from "@/components/navbar";



export default function User() {
  return (
    <Suspense>
      <Navbar activeTab={3} />
      <CreateQuiz />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";
