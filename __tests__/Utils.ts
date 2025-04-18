import { Utils } from "../src/Utils";

test("Tests for addBlankItem", () => {
  const options = [
    { id: 1, name: "a" },
    { id: 2, name: "b" }
  ];
  Utils.addBlankItem(options, "id", "name");
  expect(options.length).toBe(3);
  expect(options[0].id).toBe("");
  expect(options[0].name).toBe("---");
  Utils.addBlankItem(options, "id", "name");
  expect(options.length).toBe(3);
});

test("Tests for addUrlParam", () => {
  const url = "https://www.etsoo.com";
  const result = url.addUrlParam("a", "b");
  expect(result).toBe("https://www.etsoo.com/?a=b");
});

describe("Tests for addUrlParams", () => {
  const url = "https://www.etsoo.com";
  const data = {
    a: "a",
    b: false,
    c: 123,
    d: new Date(Date.UTC(2022, 0, 28, 10)),
    e: [1, 2],
    f: ["a", "b"],
    g: null
  };
  const result1 = url.addUrlParams(data);

  test("addUrlParams", () => {
    expect(result1).toBe(
      "https://www.etsoo.com/?a=a&b=false&c=123&d=2022-01-28T10%3A00%3A00.000Z&e=1&e=2&f=a&f=b&g="
    );
  });

  const result2 = url.addUrlParams(data, true);

  test("addUrlParams with array format", () => {
    expect(result2).toBe(
      "https://www.etsoo.com/?a=a&b=false&c=123&d=2022-01-28T10%3A00%3A00.000Z&e=1%2C2&f=a%2Cb&g="
    );
  });

  const result22 = "/".addUrlParams(data);
  test("addUrlParams with relative path", () => {
    expect(result22).toBe(
      "/?a=a&b=false&c=123&d=2022-01-28T10%3A00%3A00.000Z&e=1&e=2&f=a&f=b&g="
    );
  });

  global.URL = undefined as any;

  const result3 = url.addUrlParams(data);

  test("addUrlParams with traditional way", () => {
    expect(result3).toBe(result1);
  });

  const result4 = url.addUrlParams(data, true);

  test("addUrlParams with traditional way and array format", () => {
    expect(result4).toBe(result2);
  });
});

test("Tests for containChinese", () => {
  expect("123 abC".containChinese()).toBeFalsy();
  expect("亿速思维".containChinese()).toBeTruthy();
  expect("亿速Etsoo".containChinese()).toBeTruthy();
  expect("김 민수".containKorean()).toBeTruthy();
  expect("ぁ-ん".containJapanese()).toBeTruthy();
});

test("Tests for correctTypes", () => {
  const input = {
    id: "1",
    ignore: "2",
    price: "6.0",
    amount: "",
    date: "2022/01/28",
    enabled: "true",
    ids: ["1", "2"]
  };
  Utils.correctTypes(input, {
    id: "number",
    price: "number",
    amount: "number",
    date: "date",
    enabled: "boolean",
    ids: "number[]"
  });
  expect(typeof input.id).toBe("number");
  expect(typeof input.price).toBe("number");
  expect(input.amount).toBeUndefined();
  expect((input.date as any) instanceof Date ? true : false).toBeTruthy();
  expect(input.enabled).toBeTruthy();
  expect(input.ids).toStrictEqual([1, 2]);
});

test("Tests for getDataChanges", () => {
  const input = {
    id: 2,
    name: "Name",
    gender: "F",
    brand: "",
    price: "6.0",
    amount: "",
    enabled: true,
    value: undefined,
    date: new Date("2023/03/18"),
    ids: [1, 2],
    data: { d1: 1, d2: false, d3: 1.2, d4: "Hello" },
    changedFields: ["gender", "brand", "date"]
  };

  const initData = {
    id: 1,
    name: "Name",
    gender: "M",
    brand: "ETSOO",
    price: 6,
    amount: 0,
    date: "2023/03/18",
    enabled: true,
    ids: [1, 2],
    data: { d1: 1, d3: 1.2, d4: "Hello", d2: false }
  };

  const fields = Utils.getDataChanges(input, initData);
  expect(fields).toStrictEqual(["gender", "brand", "amount"]);
  expect(input.price).toBeUndefined();
  expect(input.amount).toBeUndefined();

  const input1 = {
    id: 2,
    name: "Name",
    gender: "F",
    brand: "",
    price: "6.0",
    amount: "",
    enabled: true,
    value: undefined,
    date: new Date("2023/03/18"),
    ids: [1, 2],
    changedFields: ["gender", "brand", "date"]
  };
  const fields1 = Utils.getDataChanges(input1, initData, ["brand", "date"]);
  expect(fields1).toStrictEqual(["id", "gender", "amount", "changedFields"]);
});

test("Tests for object array getDataChanges", () => {
  const input = {
    id: 1,
    ids: [1, 2],
    items: [
      { id: 1, label: "a" },
      { id: 2, label: "b" }
    ]
  };
  const initData = {
    id: 2,
    ids: [1],
    items: [
      { id: 1, label: "a" },
      { id: 2, label: "b" }
    ]
  };
  const fields = Utils.getDataChanges(input, initData);
  expect(fields).toStrictEqual(["ids"]);
  expect(input.items).toBeUndefined();
});

test("Tests for exclude", () => {
  const options = [
    { id1: 1, name: "a" },
    { id1: 2, name: "b" }
  ];
  const result = Utils.exclude(options, "id1", 1);
  expect(result.length).toBe(1);
  expect(result[0].id1).toBe(2);
});

test("Tests for formatInitial", () => {
  expect(Utils.formatInitial("HelloWorld")).toBe("helloWorld");
  expect("HelloWorld".formatInitial(false)).toBe("helloWorld");
  expect("hello".formatInitial(true)).toBe("Hello");
});

test("Tests for formatString", () => {
  const template = "{0} is first item, {1} is second item, {0} repeat";
  const result = "aa is first item, bb is second item, aa repeat";
  expect(Utils.formatString(template, "aa", "bb")).toBe(result);
  expect(template.format("aa", "bb")).toBe(result);
});

test("Tests for hasHtmlEntity", () => {
  expect(Utils.hasHtmlEntity("&nbsp")).toBeFalsy();
  expect(Utils.hasHtmlEntity("&nbsp;")).toBeTruthy();
  expect(Utils.hasHtmlEntity("&lt; &gt;")).toBeTruthy();
  expect(Utils.hasHtmlEntity("&180;")).toBeFalsy();
  expect(Utils.hasHtmlEntity("&160;")).toBeTruthy();
  expect(
    Utils.hasHtmlEntity(
      "&#x3C;p&#x3E;Hello, world! This is &#x3C;b&#x3E;BOLD&#x3C;/b&#x3E;.&#x3C;/p&#x3E;"
    )
  ).toBeTruthy();
});

test("Tests for hasHtmlTag", () => {
  expect(Utils.hasHtmlTag("<>")).toBeFalsy();
  expect(Utils.hasHtmlTag("<div>")).toBeTruthy();
  expect(Utils.hasHtmlTag("</h1>")).toBeTruthy();
  expect(Utils.hasHtmlTag("<br>")).toBeTruthy();
});

test("Tests for hideData", () => {
  expect("xz@etsoo.com".hideEmail()).toBe("x***@etsoo.com");
  expect("info@etsoo.com".hideEmail()).toBe("in***@etsoo.com");
  expect("info@etsoo.com".hideData("@")).toBe("in***@etsoo.com");
  expect("12345678".hideData()).toBe("123***678");
});

test("Tests for isDigits", () => {
  expect(Utils.isDigits("1")).toBeTruthy();
  expect(Utils.isDigits("12", 3)).toBeFalsy();
  expect(Utils.isDigits("123", 3)).toBeTruthy();
});

test("Tests for isEmail", () => {
  expect(Utils.isEmail("abc")).toBeFalsy();
  expect(Utils.isEmail("a@")).toBeFalsy();
  expect(Utils.isEmail("xz@etsoo.com")).toBeTruthy();
});

test("Tests for joinItems", () => {
  expect(Utils.joinItems(["a", undefined, " b", "", "c "], ",")).toBe("a,b,c");
});

test("Tests for newGUID", () => {
  // Arrange
  const id1 = Utils.newGUID();
  const id2 = Utils.newGUID();

  // Assert
  expect(id1).not.toEqual(id2);
  expect(id1.length).toBe(id2.length);
});

test("Tests for numberToChars and charsToNumber", () => {
  const num = 1638777042242;
  const chars = Utils.numberToChars(num);
  expect(chars).toEqual("QmpkdVgv");
  expect(Utils.charsToNumber(chars)).toEqual(num);
});

test("Tests for removeNonLetters", () => {
  const input = "1234-5678@abc.";
  const result = "12345678abc";
  expect(Utils.removeNonLetters(input)).toBe(result);
  expect(input.removeNonLetters()).toBe(result);
});

test("Tests for replaceNullOrEmpty", () => {
  expect(Utils.replaceNullOrEmpty("a", "s")).toBe("a");
  expect(Utils.replaceNullOrEmpty(null, "s")).toBe("s");
  expect(Utils.replaceNullOrEmpty(" ", "s")).toBe("s");
});

test("Tests for objectEqual", () => {
  const obj1 = { a: 1, b: "abc", c: true, d: null, f: [1, 2] };
  const obj2 = { a: "1", b: "abc", c: true, f: [1, 2] };
  expect(Utils.objectEqual(obj1, obj2)).toBeFalsy();
  expect(Utils.objectEqual(obj1, obj2, [], 0)).toBeTruthy();
  expect(Utils.objectEqual(obj1, obj2, ["a"])).toBeTruthy();
  expect(Utils.objectEqual(obj1, obj2, ["a"], 2)).toBeFalsy();
});

test("Tests for parseJsonArray", () => {
  expect(Utils.parseJsonArray('[1, 3, "a"]', 0)).toBeUndefined();
  expect(Utils.parseJsonArray('[1, 3, "a"]')).not.toBeUndefined();
  expect(Utils.parseJsonArray("1, 3, 9")).not.toBeUndefined();
});

test("Tests for objectUpdated", () => {
  const objPrev = { a: 1, b: "abc", c: true, d: null, f: [1, 2] };
  const objNew = { a: 2, b: "abc", d: new Date(), f: [1, 2, 3], g: true };
  const fields = Utils.objectUpdated(objNew, objPrev, ["d"]);
  expect(fields.sort()).toStrictEqual(["a", "c", "f", "g"]);
});

test("Tests for parseString", () => {
  expect(Utils.parseString<string>("test")).toBe("test");
  expect(Utils.parseString("test", "")).toBe("test");
  expect(Utils.parseString("true", false)).toBe(true);
  expect(Utils.parseString("", false)).toBeFalsy();
  expect(Utils.parseString<boolean>("")).toBeUndefined();
  expect(Utils.parseString<number>(undefined)).toBeUndefined();
  expect(Utils.parseString("3.14", 0)).toBe(3.14);
  expect(Utils.parseString(null, 0)).toBe(0);
  expect(Utils.parseString("2021/4/13", new Date())).toStrictEqual(
    new Date("2021/4/13")
  );
});

test("Test for setLabels", () => {
  // Arrange
  const source = { label: "Hello" };
  const newLabel = "world";

  // Act
  Utils.setLabels(source, { label1: newLabel }, { label: "label1" });

  // Assert
  expect(source.label).toBe(newLabel);
});

test("Test for snakeNameToWord", () => {
  expect(Utils.snakeNameToWord("snake_name")).toBe("Snake Name");
  expect(Utils.snakeNameToWord("snake_name", true)).toBe("Snake name");
});

test("Tests for mergeClasses", () => {
  expect(Utils.mergeClasses("a", "", "b ", undefined, "c")).toBe("a b c");
});

test("Tests for getNestedValue", () => {
  const obj = { jsonData: { photoSize: [200, 100], supportResizing: true } };
  expect(Utils.getNestedValue(obj, "jsonData.supportResizing")).toBeTruthy();
  expect(
    Array.isArray(Utils.getNestedValue(obj, "jsonData.photoSize"))
  ).toBeTruthy();
  expect(Utils.getNestedValue(obj, "jsonData.unknown")).toBeUndefined();
});

test("Tests for getResult", () => {
  // Arrange
  type test = ((visible: boolean) => number) | number;
  const input: test = (visible) => (visible ? 1 : 0);
  const inputNumber: test = 5;
  const inputAny: test = input as any;

  // Act & assert
  const result = Utils.getResult(input, true);
  expect(result).toBe(1);
  expect(Utils.getResult(input, false)).toBe(0);

  const result1 = Utils.getResult(inputAny, false);
  expect(result1).toBe(0);

  const valueResult = Utils.getResult(inputNumber);
  expect(valueResult).toBe(5);
});

test("Tests for parsePath, file only", () => {
  const result = Utils.parsePath("a.jpg");
  expect(result.root).toBe("");
  expect(result.dir).toBe("");
  expect(result.base).toBe("a.jpg");
  expect(result.ext).toBe(".jpg");
  expect(result.name).toBe("a");
});

test("Tests for parsePath, root file only", () => {
  const result = Utils.parsePath("/a.JPG");
  expect(result.root).toBe("/");
  expect(result.dir).toBe("/");
  expect(result.base).toBe("a.JPG");
  expect(result.ext).toBe(".JPG");
  expect(result.name).toBe("a");
});

test("Tests for parsePath, Linux path", () => {
  const result = Utils.parsePath("/home/user/dir/file.txt");
  expect(result.root).toBe("/");
  expect(result.dir).toBe("/home/user/dir");
  expect(result.base).toBe("file.txt");
  expect(result.ext).toBe(".txt");
  expect(result.name).toBe("file");
});

test("Tests for parsePath, Windows path", () => {
  const result = Utils.parsePath("C:\\path\\dir\\file.txt");
  expect(result.root).toBe("C:\\");
  expect(result.dir).toBe("C:\\path\\dir");
  expect(result.base).toBe("file.txt");
  expect(result.ext).toBe(".txt");
  expect(result.name).toBe("file");
});

test("Tests for removeEmptyValues", () => {
  const obj = { a: 1, b: "", c: null, d: undefined, e: "e" };
  Utils.removeEmptyValues(obj);
  expect(obj).toEqual({ a: 1, e: "e" });
});

test("Tests for setNestedValue", () => {
  const obj = { jsonData: { photoSize: [200, 100], supportResizing: true } };

  Utils.setNestedValue(obj, "jsonData.supportResizing", false);
  expect(obj.jsonData.supportResizing).toBeFalsy();

  Utils.setNestedValue(obj, "jsonData.newProperty.value", 125);
  expect(Reflect.get((obj.jsonData as any).newProperty, "value")).toBe(125);
});

test("Tests for setNestedValue removal", () => {
  const obj = { jsonData: { photoSize: [200, 100], supportResizing: true } };

  Utils.setNestedValue(obj, "jsonData.photoSize", undefined);
  expect(obj.jsonData.photoSize).toBeUndefined();

  Utils.setNestedValue(obj, "jsonData.supportResizing", undefined);
  expect(obj.jsonData.supportResizing).toBeUndefined();
});

test("Tests for sortByFavor", () => {
  const items = [1, 2, 3, 4, 5, 6, 7];
  expect(Utils.sortByFavor(items, [5, 1, 3])).toStrictEqual([
    5, 1, 3, 2, 4, 6, 7
  ]);
});

test("Tests for sortByFieldFavor", () => {
  const options = [
    { id: "a", name: "a1" },
    { id: "b", name: "b2" },
    { id: "c", name: "c3" },
    { id: "d", name: "d4" },
    { id: "e", name: "e5" },
    { id: "f", name: "f6" }
  ];
  expect(
    Utils.sortByFieldFavor(options, "id", ["e", "a", "c"]).map(
      (option) => option.name
    )
  ).toStrictEqual(["e5", "a1", "c3", "b2", "d4", "f6"]);
});

test("Tests for trim", () => {
  expect(Utils.trim("//a/", "/")).toBe("a");
  expect(Utils.trim("/*/a/", ...["/", "*"])).toBe("a");
  expect(Utils.trim("abc", ...["/", "*"])).toBe("abc");
});

test("Tests for trimStart", () => {
  expect(Utils.trimStart("//a/", "/")).toBe("a/");
  expect(Utils.trimStart("/*/a/", ...["/", "*"])).toBe("a/");
  expect(Utils.trimStart("abc", ...["/", "*"])).toBe("abc");
});

test("Tests for trimEnd", () => {
  expect(Utils.trimEnd("//a/", "/")).toBe("//a");
  expect(Utils.trimEnd("/*/a*/", ...["/", "*"])).toBe("/*/a");
  expect(Utils.trimEnd("abc", ...["/", "*"])).toBe("abc");
  expect(Utils.trimEnd("12.0.0.0", ".0")).toBe("12");
});
