import { ArrayUtils } from "../src/ArrayUtils";

test("Tests for simple type toUnique", () => {
  const result = [1, 1, 3, 5, 5].toUnique();
  expect(result).toStrictEqual([1, 3, 5]);
});

test("Tests for object type toUnique", () => {
  const result = [
    { id: 1, label: "a" },
    { id: 2, label: "b" },
    { id: 2, label: "b" }
  ].toUnique();
  expect(result.length).toBe(2);
});

test("Tests for differences", () => {
  const a1 = ["a", "b", "c", "e"];
  const a2 = ["a", "c", "d"];
  expect(ArrayUtils.differences(a1, a2)).toEqual(["b", "e"]);
  expect(ArrayUtils.differences(a1, a2, true)).toEqual(["b", "e", "d"]);
});

test("Tests for sum numbers", () => {
  const items = [12, 8, 22];
  expect(items.sum()).toBe(42);
});

test("Tests for sum fields", () => {
  const items = [
    { id: 1, label: "a", amount: 3.14 },
    { id: 2, label: "b", amount: 4.54 }
  ];
  expect(items.sum("amount")).toBe(7.68);
});

test("Tests for max / min numbers", () => {
  const items = [12, 8, 22];
  expect(items.max()).toBe(22);
  expect(items.min()).toBe(8);
});

test("Tests for max / min fields", () => {
  const items = [
    { id: 1, label: "a", amount: 3.14 },
    { id: 2, label: "b", amount: 4.54 },
    { id: 3, label: "b", amount: 1.52 }
  ];
  expect(items.max("amount")).toBe(4.54);
  expect(items.min("amount")).toBe(1.52);
});

test("Tests for maxItem / minItem", () => {
  const items = [
    { id: 1, label: "a", amount: 3.14 },
    { id: 2, label: "b", amount: 4.54 },
    { id: 3, label: "b", amount: 1.52 }
  ];
  expect(items.maxItem("amount")?.id).toBe(2);
  expect(items.minItem("amount")?.id).toBe(3);

  const emptyItems: { id: string; amount: number }[] = [];
  expect(emptyItems.maxItem("amount")).toBeUndefined();
});

test("Tests for mergeArrays", () => {
  const a1 = ["e", "a", "c"];
  const a2 = ["a", "c", "d"];
  const a3 = ["b", "c", "f"];
  const result = ArrayUtils.mergeArrays(a1, a2, a3);
  expect(result).toEqual(["e", "a", "c", "d", "b", "f"]);
  expect(result.length).toBe(6);
});

test("Tests for remove simple", () => {
  const items = [1, 2, 3, 4, 5];
  const result = items.remove(1, 5, (item) => item % 2 === 0);
  expect(items).toStrictEqual([3]);
  expect(result.length).toBe(4);
});

test("Tests for remove object", () => {
  const item = { id: 4, label: "d", amount: 9.66 };
  const items = [
    { id: 1, label: "a", amount: 3.14 },
    { id: 2, label: "b", amount: 4.54 },
    { id: 3, label: "b", amount: 1.52 },
    item
  ];

  const result = items.remove(
    item,
    (item) => item.id === 2,
    (item) => item.amount <= 2
  );

  expect(items.length).toBe(1);
  expect(items[0].id).toBe(1);
  expect(result.length).toBe(3);
});

test("Tests for sortIds 1", () => {
  const source = [
    {
      id: "zh-Hans",
      label: "中文（简体）, Chinese (Simplified)"
    },
    {
      id: "en",
      label: "英语, English"
    },
    {
      id: "fr",
      label: "法语, French"
    },
    {
      id: "de",
      label: "德语, German"
    },
    {
      id: "zh-Hant",
      label: "中文（繁体）, Chinese (Traditional)"
    }
  ];
  source.sortByProperty("id", ["en", "zh-Hans", "zh-Hant"]);

  const ids = source.map((s) => s.id);
  expect(ids).toStrictEqual(["en", "zh-Hans", "zh-Hant", "fr", "de"]);
});

test("Tests for sortIds 2", () => {
  const source = [
    { id: "AUD", label: "澳元" },
    { id: "CAD", label: "加元" },
    { id: "CNY", label: "人民币" },
    { id: "EUR", label: "欧元" },
    { id: "GBP", label: "英镑" },
    { id: "HKD", label: "港币" },
    { id: "JPY", label: "日元" },
    { id: "NZD", label: "纽币" },
    { id: "SGD", label: "新币" },
    { id: "USD", label: "美元" }
  ];
  source.sortByProperty("id", ["USD", "CNY"]);

  const ids = source.map((s) => s.id);
  expect(ids).toStrictEqual([
    "USD",
    "CNY",
    "AUD",
    "CAD",
    "EUR",
    "GBP",
    "HKD",
    "JPY",
    "NZD",
    "SGD"
  ]);
});

test("Tests for toggleItem", () => {
  const items = [1, 2, 3];
  items.toggleItem(2, false);
  expect(items).toStrictEqual([1, 3]);

  items.toggleItem(4, true);
  expect(items).toStrictEqual([1, 3, 4]);

  items.toggleItem(1, false);
  expect(items).toStrictEqual([3, 4]);

  items.toggleItem(3, true);
  expect(items).toStrictEqual([3, 4]);
});

test("Tests for toggleItem with object", () => {
  const items = [
    { id: 1, label: "a" },
    { id: 2, label: "b" }
  ];
  items.toggleItem({ id: 2, label: "b" }, false);
  expect(items).toStrictEqual([{ id: 1, label: "a" }]);

  items.toggleItem({ id: 3, label: "c" }, true, "id");
  expect(items).toStrictEqual([
    { id: 1, label: "a" },
    { id: 3, label: "c" }
  ]);

  items.toggleItem(1, false, "id");
  expect(items).toStrictEqual([{ id: 3, label: "c" }]);

  items.toggleItem({ id: 3, label: "c" }, true, "id");
  expect(items).toStrictEqual([{ id: 3, label: "c" }]);
});
