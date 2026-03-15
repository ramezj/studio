import { describe, it, expect } from "vitest";
import { hexToRgb, rgbToHex, lerpColor, getColorAtPosition } from "./color";

describe("hexToRgb", () => {
  it("parses with #", () => {
    expect(hexToRgb("#ff8800")).toEqual({ r: 255, g: 136, b: 0 });
  });

  it("parses without #", () => {
    expect(hexToRgb("00ff00")).toEqual({ r: 0, g: 255, b: 0 });
  });

  it("returns null for invalid hex", () => {
    expect(hexToRgb("nope")).toBeNull();
    expect(hexToRgb("#fff")).toBeNull();
  });
});

describe("rgbToHex", () => {
  it("round-trips with hexToRgb", () => {
    const hex = "#ab12cd";
    const rgb = hexToRgb(hex)!;
    expect(rgbToHex(rgb.r, rgb.g, rgb.b)).toBe(hex);
  });

  it("clamps out-of-range values", () => {
    expect(rgbToHex(300, -10, 128)).toBe("#ff0080");
  });
});

describe("lerpColor", () => {
  it("t=0 returns first color", () => {
    expect(lerpColor("#000000", "#ffffff", 0)).toBe("#000000");
  });

  it("t=1 returns second color", () => {
    expect(lerpColor("#000000", "#ffffff", 1)).toBe("#ffffff");
  });

  it("t=0.5 returns midpoint", () => {
    expect(lerpColor("#000000", "#ffffff", 0.5)).toBe("#808080");
  });
});

describe("getColorAtPosition", () => {
  it("single stop returns that color", () => {
    expect(getColorAtPosition([{ color: "#ff0000", position: 0.5 }], 0)).toBe(
      "#ff0000",
    );
  });

  it("returns start color at position 0", () => {
    const stops = [
      { color: "#000000", position: 0 },
      { color: "#ffffff", position: 1 },
    ];
    expect(getColorAtPosition(stops, 0)).toBe("#000000");
  });

  it("returns end color at position 1", () => {
    const stops = [
      { color: "#000000", position: 0 },
      { color: "#ffffff", position: 1 },
    ];
    expect(getColorAtPosition(stops, 1)).toBe("#ffffff");
  });

  it("interpolates multi-stop gradient", () => {
    const stops = [
      { color: "#000000", position: 0 },
      { color: "#ff0000", position: 0.5 },
      { color: "#ffffff", position: 1 },
    ];
    // At 0.25, halfway between black and red
    const result = getColorAtPosition(stops, 0.25);
    expect(result).toBe("#800000");
  });

  it("clamps out of range", () => {
    const stops = [
      { color: "#ff0000", position: 0.2 },
      { color: "#0000ff", position: 0.8 },
    ];
    expect(getColorAtPosition(stops, 0)).toBe("#ff0000");
    expect(getColorAtPosition(stops, 1)).toBe("#0000ff");
  });
});
