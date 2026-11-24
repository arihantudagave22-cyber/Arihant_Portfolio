const SCROLL_FACTOR = 0.1;
const EDITABLE_TARGETS = "input, textarea, select, [contenteditable='true'], [role='textbox']";

function isEditableTarget(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(EDITABLE_TARGETS) !== null;
}

export function installSlowScroll(): () => void {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let targetScrollX = window.scrollX;
  let targetScrollY = window.scrollY;
  let animationFrame = 0;

  const animateScroll = () => {
    const remainingX = targetScrollX - window.scrollX;
    const remainingY = targetScrollY - window.scrollY;
    if (Math.abs(remainingX) < 0.5 && Math.abs(remainingY) < 0.5) {
      window.scrollTo({ left: targetScrollX, top: targetScrollY, behavior: "instant" });
      animationFrame = 0;
      return;
    }

    window.scrollTo({
      left: window.scrollX + remainingX * 0.05,
      top: window.scrollY + remainingY * 0.05,
      behavior: "instant",
    });
    animationFrame = window.requestAnimationFrame(animateScroll);
  };

  const scrollByScaledAmount = (deltaX: number, deltaY: number) => {
    if (!animationFrame) {
      targetScrollX = window.scrollX;
      targetScrollY = window.scrollY;
    }

    const maxScrollX = Math.max(document.documentElement.scrollWidth - window.innerWidth, 0);
    const maxScrollY = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
    targetScrollX = Math.max(0, Math.min(maxScrollX, targetScrollX + deltaX * SCROLL_FACTOR));
    targetScrollY = Math.max(0, Math.min(maxScrollY, targetScrollY + deltaY * SCROLL_FACTOR));

    if (reducedMotion) {
      window.scrollTo({ left: targetScrollX, top: targetScrollY, behavior: "instant" });
    } else if (!animationFrame) {
      animationFrame = window.requestAnimationFrame(animateScroll);
    }
  };

  const onWheel = (event: WheelEvent) => {
    if (event.ctrlKey || isEditableTarget(event.target) || !event.cancelable) return;

    const unitScale = event.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? 16
      : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
        ? window.innerHeight
        : 1;
    const deltaX = event.deltaX * unitScale;
    const deltaY = event.deltaY * unitScale;
    if (deltaX === 0 && deltaY === 0) return;

    event.preventDefault();
    scrollByScaledAmount(deltaX, deltaY);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || isEditableTarget(event.target)) return;
    if (event.key === " " && event.target instanceof Element && event.target.closest("a, button, [role='button']")) return;

    const pageStep = window.innerHeight * 0.8;
    let deltaY = 0;
    switch (event.key) {
      case "ArrowDown":
        deltaY = 40;
        break;
      case "ArrowUp":
        deltaY = -40;
        break;
      case "PageDown":
        deltaY = pageStep;
        break;
      case "PageUp":
        deltaY = -pageStep;
        break;
      case " ":
        deltaY = event.shiftKey ? -pageStep : pageStep;
        break;
      case "Home":
        deltaY = -window.scrollY;
        break;
      case "End":
        deltaY = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
        break;
      default:
        return;
    }

    if (deltaY === 0) return;
    event.preventDefault();
    scrollByScaledAmount(0, deltaY);
  };

  document.addEventListener("wheel", onWheel, { passive: false });
  document.addEventListener("keydown", onKeyDown);

  return () => {
    window.cancelAnimationFrame(animationFrame);
    document.removeEventListener("wheel", onWheel);
    document.removeEventListener("keydown", onKeyDown);
  };
}
