"use client";

import Lottie from "lottie-react";
import animation from "@/animation.json"
export default function Loading() {

  return (
    <div className="flex items-center justify-center w-100px h-100px">
      <Lottie animationData={animation} loop={true} />
    </div>
  );
}
