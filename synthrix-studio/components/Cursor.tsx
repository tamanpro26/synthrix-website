"use client";
import { useEffect } from "react";

export default function Cursor() {
  useEffect(() => {
    const cur    = document.getElementById("cur");
    const curDot = document.getElementById("cur-dot");
    if (!cur || !curDot) return;

    const move = (e: MouseEvent) => {
      cur.style.left    = e.clientX + "px";
      cur.style.top     = e.clientY + "px";
      curDot.style.left = e.clientX + "px";
      curDot.style.top  = e.clientY + "px";
    };

    const over = () => cur.classList.add("big");
    const out  = () => cur.classList.remove("big");

    window.addEventListener("mousemove", move);
    document.querySelectorAll("a,button,[data-cur]").forEach((el) => {
      el.addEventListener("mouseenter", over);
      el.addEventListener("mouseleave", out);
    });

    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <div id="cur" />
      <div id="cur-dot" />
    </>
  );
}
