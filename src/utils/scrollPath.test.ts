import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { makeHairpinScrollPath } from "./scrollPath";

describe("makeHairpinScrollPath", () => {
  it("alternates horizontal rows with outward hairpin turns", () => {
    const path = makeHairpinScrollPath(390, 844, 88);
    const rightTurn = path.curves[1];
    const leftRow = path.curves[3];
    const leftTurn = path.curves[4];

    expect(rightTurn).toBeInstanceOf(THREE.CubicBezierCurve3);
    expect(leftTurn).toBeInstanceOf(THREE.CubicBezierCurve3);
    expect(leftRow.getPoint(1).x).toBeLessThan(leftRow.getPoint(0).x);
    expect(rightTurn.getPoint(0.5).x).toBeGreaterThan(rightTurn.getPoint(0).x);
    expect(leftTurn.getPoint(0.5).x).toBeLessThan(leftTurn.getPoint(0).x);
  });

  it("keeps the path inside narrow viewports", () => {
    const width = 320;
    const height = 480;
    const path = makeHairpinScrollPath(width, height, 88);

    for (let progress = 0; progress <= 1; progress += 0.05) {
      const point = path.getPointAt(progress);
      expect(point.x).toBeGreaterThanOrEqual(0);
      expect(point.x).toBeLessThanOrEqual(width);
      expect(point.y).toBeGreaterThanOrEqual(0);
      expect(point.y).toBeLessThanOrEqual(height);
    }
  });

  it("uses frequent turns for a longer zigzagging route", () => {
    const path = makeHairpinScrollPath(390, 844, 88);
    const turns = path.curves.filter((curve) => curve instanceof THREE.CubicBezierCurve3);

    expect(turns.length).toBeGreaterThanOrEqual(24);
  });
});
