const SCROLL_FACTOR = 0.2;
const EDITABLE_TARGETS = "input, textarea, select, [contenteditable='true'], [role='textbox']";

function isEditableTarget(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(EDITABLE_TARGETS) !== null;
}

function scrollByScaledAmount(deltaX: number, deltaY: number) {
  window.scrollBy({
    left: deltaX * SCROLL_FACTOR,
    top: deltaY * SCROLL_FACTOR,
    behavior: "instant",
  });
}

export function installSlowScroll(): () => void {
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

  let lastTouchY: number | null = null;
  const onTouchStart = (event: TouchEvent) => {
    lastTouchY = event.touches.length === 1 && !isEditableTarget(event.target)
      ? event.touches[0].clientY
      : null;
  };
  const onTouchMove = (event: TouchEvent) => {
    if (lastTouchY === null) return;
    if (event.touches.length !== 1 || !event.cancelable) {
      lastTouchY = null;
      return;
    }

    const touchY = event.touches[0].clientY;
    const deltaY = lastTouchY - touchY;
    lastTouchY = touchY;
    event.preventDefault();
    scrollByScaledAmount(0, deltaY);
  };
  const resetTouch = () => {
    lastTouchY = null;
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
  document.addEventListener("touchstart", onTouchStart, { passive: true });
  document.addEventListener("touchmove", onTouchMove, { passive: false });
  document.addEventListener("touchend", resetTouch, { passive: true });
  document.addEventListener("touchcancel", resetTouch, { passive: true });
  document.addEventListener("keydown", onKeyDown);

  return () => {
    document.removeEventListener("wheel", onWheel);
    document.removeEventListener("touchstart", onTouchStart);
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", resetTouch);
    document.removeEventListener("touchcancel", resetTouch);
    document.removeEventListener("keydown", onKeyDown);
  };
}
