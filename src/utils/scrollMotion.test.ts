import { describe, expect, it } from "vitest";
import { getScrollMotion, getSpiderFacingAngle } from "./scrollMotion";

describe("getScrollMotion", () => {
  it("preserves the direction of scrolling", () => {
    expect(getScrollMotion(20, 100)).toBeGreaterThan(0);
    expect(getScrollMotion(-20, 100)).toBeLessThan(0);
  });

  it("scales with scroll speed and clamps fast movement", () => {
    expect(getScrollMotion(40, 100)).toBeGreaterThan(getScrollMotion(10, 100));
    expect(getScrollMotion(500, 10)).toBe(1);
    expect(getScrollMotion(-500, 10)).toBe(-1);
  });

  it("returns no movement for invalid timing or values", () => {
    expect(getScrollMotion(10, 0)).toBe(0);
    expect(getScrollMotion(Number.NaN, 10)).toBe(0);
  });

  it("faces along the path and reverses when progress runs backward", () => {
    expect(getSpiderFacingAngle(1, 0, 1)).toBeCloseTo(-Math.PI / 2);
    expect(getSpiderFacingAngle(1, 0, -1)).toBeCloseTo(Math.PI / 2);
    expect(Math.abs(getSpiderFacingAngle(0, 1, -1))).toBeCloseTo(0);
  });
});
