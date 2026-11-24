export function getScrollMotion(deltaY: number, elapsedMilliseconds: number): number {
  if (!Number.isFinite(deltaY) || !Number.isFinite(elapsedMilliseconds) || elapsedMilliseconds <= 0) {
    return 0;
  }

  return Math.max(-1, Math.min(1, deltaY / elapsedMilliseconds / 0.7));
}

export function getSpiderFacingAngle(tangentX: number, tangentY: number, direction: number): number {
  const forwardAngle = Math.atan2(-tangentX, -tangentY);
  return forwardAngle + (direction < 0 ? Math.PI : 0);
}
