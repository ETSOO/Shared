import { NumberUtils } from "../src/NumberUtils";

test("Tests for format", () => {
  expect(NumberUtils.format(12.4, "zh-CN", { style: "percent" })).toBe(
    "1,240%"
  );
});

test("Tests for formatMoney", () => {
  expect(NumberUtils.formatMoney(1282.4, "CNY", "zh-CN")).toBe("¥1,282.40");
  expect(NumberUtils.formatMoney(1282, "CNY", "zh-CN", true)).toBe("¥1,282");
});

test("Tests for getCurrencySymbol", () => {
  expect(NumberUtils.getCurrencySymbol("CNY")).toBe("¥");
  expect(NumberUtils.getCurrencySymbol("USD")).toBe("$");

  // When locale = 'en-US' will be failed with '$'
  expect(NumberUtils.getCurrencySymbol("USD", "symbol", "zh-CN")).toBe("US$");
  expect(NumberUtils.getCurrencySymbol("CNY", "name", "zh-CN")).toBe("人民币");
});

test("Tests for parse", () => {
  expect(NumberUtils.parse("123")).toBe(123);
  expect(NumberUtils.parse(Object(123))).toBe(123);
  expect(NumberUtils.parse("a")).toBeUndefined();
  expect(NumberUtils.parse("a", 0)).toBe(0);
  expect(NumberUtils.parse("")).toBeUndefined();
  expect(NumberUtils.parse("", -1)).toBe(-1);
});

test("Tests for parseWithUnit", () => {
  expect(NumberUtils.parseWithUnit("8px")).toStrictEqual([8, "px"]);
  expect(NumberUtils.parseWithUnit("16")).toStrictEqual([16, ""]);
  expect(NumberUtils.parseWithUnit("a16")).toBeUndefined();
});

test("Tests for toExact", () => {
  // 0.7000000000000001
  const result = 0.8 - 0.1;
  expect(result).not.toBe(0.7);
  expect(result.toExact()).toBe(0.7);
});

test("Tests for toFileSize", () => {
  expect(NumberUtils.formatFileSize(1551859712)).toBe("1.45 GB");
  expect(NumberUtils.formatFileSize(1551859712, 1)).toBe("1.4 GB");
  expect(NumberUtils.formatFileSize(5000)).toBe("4.88 KB");
  expect(NumberUtils.formatFileSize(999949)).toBe("976.51 KB");
  expect(NumberUtils.formatFileSize(1125000)).toBe("1.07 MB");
  expect(NumberUtils.formatFileSize(1125000, 1)).toBe("1.1 MB");
});
