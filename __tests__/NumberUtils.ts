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

test("Tests for toStep", () => {
  const nums = [9, 13, 20, 33, 99, 101, 3009];
  const results = nums.map((num) => num.toStep(10));
  expect(results).toStrictEqual([0, 10, 20, 30, 90, 100, 3000]);

  const results2 = nums.map((num) => num.toStep(8));
  expect(results2).toStrictEqual([8, 8, 16, 32, 96, 96, 3008]);
});

test("Tests for getMonthPeriod", () => {
  expect(NumberUtils.getMonthPeriod(2025, 0)).toBe(202501);
  expect(NumberUtils.getMonthPeriod(2025, 11)).toBe(202512);
  expect(NumberUtils.getMonthPeriod(2026, 5)).toBe(202606);

  const date = new Date(Date.parse("January 13, 1980"));
  const result = 198001;
  expect(NumberUtils.getMonthPeriod(date.getFullYear(), date.getMonth())).toBe(
    result
  );
  expect(NumberUtils.getMonthPeriod(date)).toBe(result);
});

test("Tests for getMonthPeriodRange", () => {
  expect(NumberUtils.getMonthPeriodRange(2025)).toStrictEqual([202501, 202512]);
  expect(NumberUtils.getMonthPeriodRange(2026)).toStrictEqual([202601, 202612]);
});

test("Tests for getQuarterPeriod", () => {
  expect(NumberUtils.getQuarterPeriod(2025, 0)).toBe(20251);
  expect(NumberUtils.getQuarterPeriod(2025, 3)).toBe(20252);
  expect(NumberUtils.getQuarterPeriod(2025, 6)).toBe(20253);
  expect(NumberUtils.getQuarterPeriod(2025, 9)).toBe(20254);
});

test("Tests for getQuarterPeriodRange", () => {
  expect(NumberUtils.getQuarterPeriodRange(2025)).toStrictEqual([20251, 20254]);
  expect(NumberUtils.getQuarterPeriodRange(2026)).toStrictEqual([20261, 20264]);
});
