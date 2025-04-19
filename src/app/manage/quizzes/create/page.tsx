"use client"

import { Suspense } from "react";
import Navbar from "@/components/navbar";
import CreateQuiz from "@/components/quiz/createQuiz";

export default function Quiz() {
  return (
    <Suspense>
      <Navbar activeTab={3} />
      <CreateQuiz />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";