"use client";

import { useEffect } from "react";

export default function ThriveDesk() {
  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      // Create script element
      const script = document.createElement("script");

      // Set script content with your Assistant ID
      script.innerHTML = `
        !function(t,e,n){function s(){
      var t=e.getElementsByTagName("script")[0],n=e.createElement("script");
      n.type="text/javascript",n.async=!0,n.src="https://assistant.thrivedesk.com/bootloader.js?"+Date.now(),
      t.parentNode.insertBefore(n,t)}if(t.Assistant=n=function(e,n,s){t.Assistant.readyQueue.push({method:e,options:n,data:s})},
      n.readyQueue=[],"complete"===e.readyState)return s();
    t.attachEvent?t.attachEvent("onload",s):t.addEventListener("load",s,!1)}
    (window,document,window.Assistant||function(){}),window.Assistant("init","${process.env.NEXT_PUBLIC_THRIVEDESK_ASSISTANT_ID}");
      `;

      // Append script to document
      document.body.appendChild(script);

      // Clean up
      return () => {
        if (script.parentNode) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

  return null;
}
