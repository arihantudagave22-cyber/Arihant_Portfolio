import * as THREE from "three";

export function makeHairpinScrollPath(width: number, height: number, spiderSize: number) {
  const path = new THREE.CurvePath<THREE.Vector3>();
  const left = spiderSize / 2 + 8;
  const right = width - left;
  const top = Math.max(spiderSize + 12, Math.min(120, height * 0.16));
  const bottom = Math.max(top + 120, height - spiderSize - 12);
  const radius = Math.max(12, Math.min(22, (bottom - top) / 20));
  const rows = Math.max(3, Math.floor((bottom - top) / (radius * 2)) + 1);
  const spacing = (bottom - top) / (rows - 1);
  const turnRadius = spacing / 2;
  const handle = turnRadius * 0.55228475;
  const point = (x: number, y: number) => new THREE.Vector3(x, y, 0);
  const line = (start: THREE.Vector3, end: THREE.Vector3) => path.add(new THREE.LineCurve3(start, end));
  const curve = (start: THREE.Vector3, control1: THREE.Vector3, control2: THREE.Vector3, end: THREE.Vector3) => {
    path.add(new THREE.CubicBezierCurve3(start, control1, control2, end));
  };

  let movingRight = true;
  let start = point(left, top);
  for (let row = 0; row < rows; row += 1) {
    const y = top + row * spacing;
    const end = point(movingRight ? right - turnRadius : left + turnRadius, y);
    line(start, end);
    if (row === rows - 1) break;

    const centerX = movingRight ? right - turnRadius : left + turnRadius;
    const centerY = y + turnRadius;
    const side = movingRight ? 1 : -1;
    const middle = point(centerX + side * turnRadius, centerY);
    const next = point(centerX, centerY + turnRadius);

    curve(
      end,
      point(centerX + side * handle, y),
      point(centerX + side * turnRadius, centerY - handle),
      middle,
    );
    curve(
      middle,
      point(centerX + side * turnRadius, centerY + handle),
      point(centerX + side * handle, centerY + turnRadius),
      next,
    );
    start = next;
    movingRight = !movingRight;
  }

  return path;
}
