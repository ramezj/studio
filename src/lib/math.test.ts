import { describe, it, expect } from "vitest";
import { seededRandom, mapRange, constrain, randomInt } from "./math";

describe("seededRandom", () => {
  it("produces deterministic output", () => {
    const a = seededRandom(42);
    const b = seededRandom(42);
    expect(a()).toBe(b());
    expect(a()).toBe(b());
    expect(a()).toBe(b());
  });

  it("different seeds diverge", () => {
    const a = seededRandom(1);
    const b = seededRandom(2);
    expect(a()).not.toBe(b());
  });

  it("output is in [0, 1)", () => {
    const rng = seededRandom(99);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("mapRange", () => {
  it("identity mapping", () => {
    expect(mapRange(0.5, 0, 1, 0, 1)).toBe(0.5);
  });

  it("scales correctly", () => {
    expect(mapRange(5, 0, 10, 0, 100)).toBe(50);
  });

  it("handles negative ranges", () => {
    expect(mapRange(0, -1, 1, 0, 100)).toBe(50);
  });
});

describe("constrain", () => {
  it("clamps below min", () => {
    expect(constrain(-5, 0, 10)).toBe(0);
  });

  it("clamps above max", () => {
    expect(constrain(15, 0, 10)).toBe(10);
  });

  it("passes through in range", () => {
    expect(constrain(5, 0, 10)).toBe(5);
  });
});

describe("randomInt", () => {
  it("stays within bounds", () => {
    for (let i = 0; i < 200; i++) {
      const v = randomInt(3, 7);
      expect(v).toBeGreaterThanOrEqual(3);
      expect(v).toBeLessThanOrEqual(7);
      expect(Number.isInteger(v)).toBe(true);
    }
  });
});
