"use client";

import Lottie from "lottie-react";
import animation from "@/animation.json"
export default function Loading() {

  return (
    <div className="absolute right-10 top-10 w-20 h-20">
      <Lottie animationData={animation} loop={true} />
    </div>
  );
}
