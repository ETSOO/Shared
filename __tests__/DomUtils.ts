import { DomUtils } from "../src/DomUtils";
import { DataTypes } from "../src/DataTypes";
import { DateUtils } from "../src/DateUtils";
import { MockDOMRect } from "../src/test/MockDOMRect";
import { ErrorData } from "../src/types/ErrorData";

describe("Tests for clearFormData", () => {
  // Applies only to tests in this describe block
  // Arrange
  let form: FormData;
  beforeEach(() => {
    form = new FormData();
    form.append("id", "1");
    form.append("item", "a");
    form.append("item", "b");
    form.append("item", "c");
    form.append("job", "good");
    form.append("empty", "");
  });

  test("Remove empties only", () => {
    const result = DomUtils.clearFormData(form);
    expect(Array.from(result.keys()).includes("empty")).toBeFalsy();
  });

  test("Clear with source", () => {
    const result = DomUtils.clearFormData(form, { id: 1, job: "good" });
    const keys = Array.from(result.keys());
    expect(expect.arrayContaining(keys)).not.toContainEqual(
      expect.arrayContaining(["id", "job", "empty"])
    );
  });

  test("Clear with source and hold fields", () => {
    const result = DomUtils.clearFormData(form, {}, ["id"]);
    const keys = Array.from(result.keys());
    expect(keys.includes("id")).toBeTruthy();
  });
});

test("Tests for formDataToObject", () => {
  // Arrange
  const form1 = new FormData();
  form1.append("item", "a");
  form1.append("item", "b");
  form1.append("item", "c");
  form1.append("job", "good");

  // Act
  const result = DomUtils.formDataToObject(form1);

  // Assert
  expect(Array.isArray(result["item"])).toBeTruthy();
});

test("Tests for mergeFormData", () => {
  // Arrange
  const form1 = new FormData();
  form1.append("item", "a");
  form1.append("item", "b");
  form1.append("item", "c");
  form1.append("job", "good");
  form1.append("job", "bad");

  const form2 = new FormData();
  form2.append("job", "x");
  form2.append("job", "y");

  // Act
  const result = DomUtils.mergeFormData(form1, form2);
  const values = result.getAll("job");

  // Assert
  expect(values.includes("x")).toBeTruthy();
});

test("Tests for dimensionEqual", () => {
  const rect1: DOMRect = new MockDOMRect(200, 300);
  const rect2: DOMRect = new MockDOMRect(100, 200);
  expect(DomUtils.dimensionEqual(undefined, undefined)).toBeTruthy();
  expect(DomUtils.dimensionEqual(rect1, undefined)).toBeFalsy();
  expect(DomUtils.dimensionEqual(rect1, rect2)).toBeFalsy();
});

test("Tests for formDataToObject", () => {
  const formData = new FormData();
  formData.append("id", "1234");
  formData.append("name", "test");

  expect(DomUtils.formDataToObject(formData)).toEqual({
    id: "1234",
    name: "test"
  });
});

test("Tests for dataAs", () => {
  const formData = new FormData();
  formData.append("id", "1234");
  formData.append("name", "test");
  formData.append("price", "34.25");
  formData.append("options", "1,2,3,4");
  formData.append("memo", "Memo");
  formData.append("email", "a@b");
  formData.append("email", "c@d");
  formData.append("code", "123");
  formData.append("code", "456");

  const data = DomUtils.dataAs(formData, {
    id: "number",
    name: "string",
    price: "number",
    options: "number[]",
    email: "string[]",
    code: "number[]"
  });

  expect(data.id).toStrictEqual(1234);
  expect(data.options?.length).toStrictEqual(4);
  expect(data.options![0]).toStrictEqual(1);

  expect(data.email).toEqual(["a@b", "c@d"]);
  expect(data.code?.length).toStrictEqual(2);
  expect(data.code).toEqual([123, 456]);
  expect(data).not.toHaveProperty("memo", "Memo");

  const keepSourceData = DomUtils.dataAs(
    formData,
    {
      id: "number",
      name: "string",
      price: "number",
      options: "number[]"
    },
    true
  );
  expect(keepSourceData).toHaveProperty("memo", "Memo");
});

test("Tests for dataValueAs", () => {
  const formData = new FormData();
  formData.append("id", "1234");
  formData.append("name", "test");
  formData.append("price", "34.25");
  formData.append("options", "1,2,3,4");
  formData.append("memo", "Memo");

  const templateValue = {
    id: 0,
    name: "",
    price: 0,
    options: [0]
  };

  const data = DomUtils.dataValueAs(formData, templateValue);

  expect(data.id).toStrictEqual(1234);
  expect(data.options?.length).toStrictEqual(4);
  expect(data.options![0]).toStrictEqual(1);
  expect(data).not.toHaveProperty("memo", "Memo");

  const keepSourceData = DomUtils.dataValueAs(formData, templateValue, true);
  expect(keepSourceData).toHaveProperty("memo", "Memo");
});

test("Tests for dataValueAs", () => {
  const formData = new FormData();
  formData.append("id", "1234");
  formData.append("name", "test");
  formData.append("price", "34.25");
  formData.append("options", "1,2,3,4");

  const data = DomUtils.dataValueAs(formData, {
    id: 0,
    name: "",
    price: 0,
    options: [0]
  });

  expect(data.id).toStrictEqual(1234);
  expect(data.options?.length).toStrictEqual(4);
  expect(data.options![0]).toStrictEqual(1);
});

test("Tests for detectedCulture", () => {
  expect(DomUtils.detectedCulture).toBe("en-US");
});

test("Tests for getCulture", () => {
  const cultures: DataTypes.CultureDefinition[] = [
    {
      name: "zh-Hans",
      label: "简体中文",
      resources: {},
      compatibleNames: ["zh-CN", "zh-SG"]
    },
    { name: "en", label: "English", resources: {} }
  ];

  const [culture1, match1] = DomUtils.getCulture(cultures, "zh-CN");
  expect(culture1.name).toBe("zh-Hans");
  expect(match1).toBe(DomUtils.CultureMatch.Compatible);

  const [culture2] = DomUtils.getCulture(cultures, "zh-Hans-CN");
  expect(culture2.name).toBe("zh-Hans");

  const [culture3] = DomUtils.getCulture(cultures, "zh-Hans-HK");
  expect(culture3.name).toBe("zh-Hans");

  const [culture4] = DomUtils.getCulture(cultures, "zh-SG");
  expect(culture4.name).toBe("zh-Hans");

  const [culture5] = DomUtils.getCulture(cultures, "en-GB");
  expect(culture5.name).toBe("en");

  const [culture6, match6] = DomUtils.getCulture(cultures, "fr-CA");
  expect(culture6.name).toBe("zh-Hans");
  expect(match6).toBe(DomUtils.CultureMatch.Default);
});

test("Tests for getLocationKey", () => {
  expect(DomUtils.getLocationKey("test")).toBe("http://localhost:3000/:test");
});

test("Tests for headersToObject", () => {
  expect(DomUtils.headersToObject({ t1: "a", t2: "b" })).toHaveProperty(
    "t2",
    "b"
  );
});

test("Tests for isFormData", () => {
  const formData = new FormData();
  expect(DomUtils.isFormData(formData)).toBeTruthy();
  expect(DomUtils.isFormData({})).toBeFalsy();
});

test("Tests for isJSONContentType", () => {
  expect(DomUtils.isJSONContentType("application/problem+json")).toBeTruthy();
  expect(DomUtils.isJSONContentType("application/javascript")).toBeTruthy();
});

test("Tests for mergeURLSearchParams", () => {
  // Arrange
  const params = new URLSearchParams();
  params.set("id", "123");

  const data: DataTypes.SimpleObject = {
    name: "test",
    favor: ["pear", "apple"]
  };

  // Assert
  expect(DomUtils.mergeURLSearchParams(params, data).get("favor")).toBe(
    "pear,apple"
  );
});

test("Tests for setFocus", () => {
  // Arrange
  const focus = vi.fn();

  const root = document.body;
  const container = document.createElement("div");
  root.append(container);
  const input = document.createElement("input");
  input.name = "test";
  input.onfocus = focus;
  container.append(input);

  DomUtils.setFocus("test");
  expect(focus).toHaveBeenCalledTimes(1);

  input.blur();

  DomUtils.setFocus({ test: "No content" }, container);
  expect(focus).toHaveBeenCalledTimes(2);
});

test("Tests for getInputValue", () => {
  // Arrange
  const input = document.createElement("input");
  input.type = "datetime-local";
  input.value = DateUtils.formatForInput("2023-09-21T23:08", false) ?? "";

  // Act
  const result = DomUtils.getInputValue(input);

  // Assert
  expect(result).not.toBeUndefined();
  expect(result instanceof Date).toBeTruthy();
  if (result instanceof Date) {
    expect(result.getDate()).toBe(21);
  }
});

test("Tests for getUserAgentData 1", () => {
  const data = DomUtils.parseUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
  );
  expect(data?.device).toBe("Desktop");
  expect(data?.platform).toBe("Windows NT");
  expect(data?.platformVersion).toBe("10.0");
  expect(data?.brands.find((b) => b.brand === "Chrome")?.version).toBe("124");
});

test("Tests for getUserAgentData 2", () => {
  const data = DomUtils.parseUserAgent(
    "Mozilla/5.0 (Linux; U; Android 2.3.6; zh-cn; GT-S5660 Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1 MicroMessenger/4.5.255"
  );
  expect(data?.device).toBe("GT-S5660");
  expect(data?.platform).toBe("Android");
  expect(data?.platformVersion).toBe("2.3.6");
  expect(data?.mobile).toBeTruthy();
  expect(DomUtils.isWechatClient(data)).toBeTruthy();
});

test("Tests for getUserAgentData 3", () => {
  const data = DomUtils.parseUserAgent(
    "Mozilla/5.0 (Linux; Android 7.1.1;MEIZU E3 Build/NGI77B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/9.6 TBS/044428 Mobile Safari/537.36 MicroMessenger/6.6.7.1321(0x26060739) NetType/WIFI Language/zh_CN"
  );

  expect(data?.device).toBe("MEIZU E3");
  expect(data?.platform).toBe("Android");
  expect(data?.platformVersion).toBe("7.1.1");
  expect(data?.mobile).toBeTruthy();
  expect(DomUtils.isWechatClient(data)).toBeTruthy();
});

test("Tests for getUserAgentData 4", () => {
  const data = DomUtils.parseUserAgent(
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1"
  );

  expect(data?.device).toBe("iPhone");
  expect(data?.platform).toBe("iPhone OS");
  expect(data?.platformVersion).toBe("17.5.1");
  expect(data?.mobile).toBeTruthy();
  expect(DomUtils.isWechatClient(data)).toBeFalsy();
});

test("Tests for getUserAgentData 5", () => {
  const data = DomUtils.parseUserAgent(
    "Mozilla/5.0 (SMART-TV; Linux; Tizen 2.3) AppleWebkit/538.1 (KHTML, like Gecko) SamsungBrowser/1.0 TV Safari/538.1"
  );

  expect(data?.device).toBe("SMART-TV");
  expect(data?.platform).toBe("Tizen");
  expect(data?.platformVersion).toBe("2.3");
  expect(data?.mobile).toBeFalsy();
});

test("Tests for getUserAgentData 6", () => {
  const data = DomUtils.parseUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15"
  );

  expect(data?.device).toBe("Macintosh");
  expect(data?.platform).toBe("Mac OS X");
  expect(data?.platformVersion).toBe("10.15");
  expect(data?.mobile).toBeFalsy();
});

test("Tests for getUserAgentData 7", () => {
  const data = DomUtils.parseUserAgent(
    "Mozilla/5.0 (Linux; Android 8.1; LEO-DLXXE Build/HONORLRA-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.111 HuaweiBrowser/9.1.1.308 Mobile Safari/537.36"
  );

  expect(data?.device).toBe("LEO-DLXXE");
  expect(data?.platform).toBe("Android");
  expect(data?.platformVersion).toBe("8.1");
  expect(data?.mobile).toBeTruthy();
});

test("Tests for getUserAgentData 8", () => {
  const data = DomUtils.parseUserAgent(
    "Mozilla/5.0 (Linux; Android 9; SM-R825F Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.119 Mobile Safari/537.36"
  );

  expect(data?.device).toBe("SM-R825F");
  expect(data?.platform).toBe("Android");
  expect(data?.platformVersion).toBe("9");
  expect(data?.mobile).toBeTruthy();
});

test("Tests for setupLogging", async () => {
  // Arrange
  const action = vi.fn((data: ErrorData) => {
    expect(data.message).toBe("Test");
  });
  DomUtils.setupLogging(action, true, globalThis.self);

  // Act
  console.error("Test");

  // Assert
  expect(action).toHaveBeenCalledTimes(1);
});
