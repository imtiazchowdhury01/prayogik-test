"use client";

import { X } from "lucide-react";
import React from "react";

const MessageClose = () => {
  const handleClose = () => {
    const messageElement = document.getElementById("subscription-message");
    if (messageElement) {
      // Add transition classes
      messageElement.style.transition =
        "opacity 0.3s ease-out, transform 0.3s ease-out";
      messageElement.style.opacity = "0";
      messageElement.style.transform = "translateY(-10px)";

      // Hide the element after transition completes
      setTimeout(() => {
        messageElement.style.display = "none";
      }, 300);
    }
  };

  return (
    <button
      onClick={handleClose}
      className="p-1 hover:bg-gray-200 rounded-md transition-colors duration-200"
      aria-label="Close subscription message"
    >
      <X className="w-5 h-5" />
    </button>
  );
};

export default MessageClose;
