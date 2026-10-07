"use client";

import React from "react";
import { ToastContainer, toast, type ToastOptions } from "react-toastify";
import { useTheme } from "next-themes";
import "react-toastify/dist/ReactToastify.css";

export function ToastifyContainer() {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="top-right"
      autoClose={3500}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme === "dark" ? "dark" : "light"}
      className="!font-sans text-sm"
      toastClassName="!rounded-xl !shadow-xl !border !border-border/60 !backdrop-blur-md"
      progressClassName="!bg-[#E51A31]"
    />
  );
}

export { toast };
export type { ToastOptions };
