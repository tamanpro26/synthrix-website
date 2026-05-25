"use client";
import { useEffect } from "react";

export default function Cursor() {
  useEffect(() => {
    const cursor = document.getElementById("sx-cursor");
    const dot    = document.getElementById("sx-dot");
    const trail  = document.getElementById("sx-trail");
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch || !cursor || !dot || !trail) {
      if (cursor) cursor.style.display = "none";
      if (dot)    dot.style.display    = "none";
      if (trail)  trail.style.display  = "none";
      document.body.style.cursor = "auto";
      return;
    }

    let mx = 0, my = 0, cx = 0, cy = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px"; dot.style.top = my + "px";
      trail.style.left = mx + "px"; trail.style.top = my + "px";
      trail.style.opacity = "0.5";
    };
    document.addEventListener("mousemove", onMove);

    const animate = () => {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      cursor.style.left = cx + "px";
      cursor.style.top  = cy + "px";
      requestAnimationFrame(animate);
    };
    animate();

    document.addEventListener("mousedown", () => cursor.classList.add("clicking"));
    document.addEventListener("mouseup",   () => cursor.classList.remove("clicking"));

    const addHover = () => { cursor.classList.add("hovered"); trail.style.opacity = "0"; };
    const rmHover  = () => { cursor.classList.remove("hovered"); trail.style.opacity = "0.5"; };

    const attach = () => {
      document.querySelectorAll("a,button,.game-card,.news-item,.contact-link,.gw-panel").forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", rmHover);
        el.addEventListener("mouseenter", addHover);
        el.addEventListener("mouseleave", rmHover);
      });
    };
    attach();
    const obs = new MutationObserver(attach);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <div id="sx-cursor" className="cursor" />
      <div id="sx-dot"    className="cursor-dot" />
      <div id="sx-trail"  className="cursor-trail" style={{ width: "60px", height: "60px", opacity: 0 }} />
    </>
  );
}
