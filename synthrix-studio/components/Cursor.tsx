"use client";
import { useEffect } from "react";

export default function Cursor() {
  useEffect(() => {
    const cur = document.getElementById("cur");
    const dot = document.getElementById("cur-dot");
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch || !cur || !dot) {
      if (cur) cur.style.display = "none";
      if (dot) dot.style.display = "none";
      document.body.style.cursor = "auto";
      return;
    }

    let mx = 0, my = 0, cx = 0, cy = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px"; dot.style.top = my + "px";
    };
    document.addEventListener("mousemove", onMove);

    const animate = () => {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      cur.style.left = cx + "px";
      cur.style.top  = cy + "px";
      requestAnimationFrame(animate);
    };
    animate();

    const addBig = () => cur.classList.add("big");
    const rmBig  = () => cur.classList.remove("big");

    const attach = () => {
      document.querySelectorAll("a,button,.gcard,.r-card,.dl-row,.blog-card,.role-row,.portal-btn").forEach((el) => {
        el.removeEventListener("mouseenter", addBig);
        el.removeEventListener("mouseleave", rmBig);
        el.addEventListener("mouseenter", addBig);
        el.addEventListener("mouseleave", rmBig);
      });
    };
    attach();
    const obs = new MutationObserver(attach);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => { document.removeEventListener("mousemove", onMove); obs.disconnect(); };
  }, []);

  return (
    <>
      <div id="cur" />
      <div id="cur-dot" />
    </>
  );
}
