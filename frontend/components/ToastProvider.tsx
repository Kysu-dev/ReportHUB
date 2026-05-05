// components/ToastProvider.tsx
"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          border: "4px solid black",
          borderRadius: "0px",
          background: "#FFFDD0",
          color: "black",
          fontWeight: "bold",
          boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
        },
      }}
    />
  );
}