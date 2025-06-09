import { DataTypes, IdDefaultType, LabelDefaultType } from "../src/DataTypes";

enum GenderEnum {
  Male = "M",
  Female = "F"
}

test("Tests for DI", () => {
  const item: DataTypes.DIS<"id", number> & DataTypes.DIS<"label", string> = {
    id: 1,
    label: "Etsoo"
  };
  expect(item.id).toBe(1);
});

test("Tests for IdLabelType", () => {
  const item: DataTypes.IdLabelItem = {
    id: 1,
    label: "Etsoo"
  };
  const itemCopy: DataTypes.IdLabelType<"id", "label"> = { ...item };
  expect(item).toEqual(itemCopy);
});

test("Tests for Bigint Type", () => {
  type BigintType = {
    id: bigint;
    label: string;
  };

  const item: BigintType = {
    id: 9007199254740999n,
    label: "Etsoo"
  };

  const json = JSON.stringify(item);
  expect(json).toBe('{"id":"9007199254740999n","label":"Etsoo"}');

  const itemBack = JSON.parse(
    json,
    DataTypes.jsonBigintReceiver("id")
  ) as BigintType;
  expect(itemBack.id).toBe(9007199254740999n);
});

test("Tests for convert", () => {
  expect(DataTypes.convert("5", 0)).toStrictEqual(5);
  expect(DataTypes.convert("2021/10/13", new Date())?.getDate()).toStrictEqual(
    13
  );
  expect(DataTypes.convert("a", [])?.length).toStrictEqual(1);
  expect(DataTypes.convert("1", [0])).toStrictEqual([1]);
  expect(DataTypes.convert("", 0)).toBeUndefined();
  expect(DataTypes.convert("false", true)).toBeFalsy();
  expect(DataTypes.convert("1", true)).toBeTruthy();
  expect(DataTypes.convert(true, true)).toBeTruthy();
});

test("Tests for convertByType", () => {
  expect(DataTypes.convertByType("", "number")).toBeUndefined();
  expect(DataTypes.convertByType("", "string")).toBeUndefined();
  expect(DataTypes.convertByType("", "boolean")).toBeUndefined();
  expect(DataTypes.convertByType(["5", 8], "number[]")).toStrictEqual([5, 8]);
  expect(DataTypes.convertByType(["5", 8], "string[]")).toStrictEqual([
    "5",
    "8"
  ]);
  expect(
    DataTypes.convertByType("2021/10/13", "date")?.getDate()
  ).toStrictEqual(13);
});

test("Tests for convertSimple", () => {
  expect(
    DataTypes.convertSimple(5.8, DataTypes.CombinedEnum.Int)
  ).toStrictEqual(6);
  expect(
    DataTypes.convertSimple(5.88293, DataTypes.CombinedEnum.Money)
  ).toStrictEqual(5.8829);
});

test("Tests for getBasicName", () => {
  expect(DataTypes.getBasicName(DataTypes.CombinedEnum.DateTime)).toStrictEqual(
    "date"
  );
});

test("Tests for getEnumByKey", () => {
  expect(DataTypes.getEnumByKey(DataTypes.HAlignEnum, "Center")).toStrictEqual(
    DataTypes.HAlignEnum.Center
  );

  expect(
    DataTypes.getEnumByKey(DataTypes.HAlignEnum, "Unknown")
  ).toBeUndefined();
});

test("Tests for getEnumByValue", () => {
  expect(DataTypes.getEnumByValue(DataTypes.HAlignEnum, 2)).toStrictEqual(
    DataTypes.HAlignEnum.Center
  );

  expect(DataTypes.getEnumByValue(DataTypes.HAlignEnum, 4)).toBeUndefined();
});

test("Tests for getEnumByValue of string value enum", () => {
  expect(DataTypes.getEnumByValue(GenderEnum, "M")).toStrictEqual(
    GenderEnum.Male
  );
  expect(DataTypes.getEnumByValue(GenderEnum, "F")).toStrictEqual(
    GenderEnum.Female
  );
});

test("Tests for getEnumKey", () => {
  expect(
    DataTypes.getEnumKey(DataTypes.HAlignEnum, DataTypes.HAlignEnum.Center)
  ).toBe("Center");
});

test("Tests for getEnumKey of string value enum", () => {
  expect(DataTypes.getEnumKey(GenderEnum, GenderEnum.Female)).toBe("Female");
  expect(DataTypes.getEnumKey(GenderEnum, "None")).toBeUndefined();
});

test("Tests for getEnumKeys", () => {
  enum ProductUnit {
    KILOGRAM = 32,
    GRAM = "GRAM33"
  }
  expect(DataTypes.getEnumKeys(ProductUnit)).toContainEqual("GRAM");

  const keys = DataTypes.getEnumKeys(DataTypes.CombinedEnum);
  expect(keys).toContainEqual("Unkwown");
});

test("Tests for IdLabelItem", () => {
  // Arrange
  const items: DataTypes.IdLabelItem[] = [
    { id: 1, label: "Item 1" },
    { id: 2, label: "Item 2" }
  ];

  // Assert
  expect(items[0].id).toBe(1);
  expect(items[1].label).toBe("Item 2");
});

test("Tests for getValue", () => {
  const data = { id: 1, flag: true };
  expect(DataTypes.getValue(data, "id")).toBe(1);
  expect(DataTypes.getValue(data, "flag")).toBeTruthy();
  expect(DataTypes.getValue(data, "unknown")).toBeUndefined();
});

test("Tests for getIdValue", () => {
  const data = { id: 1, flag: true, field: "string" };
  expect(DataTypes.getIdValue(data, "id")).toBe(1);
  expect(DataTypes.getIdValue(data, "field")).toBe("string");
});

test("Tests for getStringValue", () => {
  const data = { id: 1, flag: true };
  expect(DataTypes.getStringValue(data, "id")).toBe("1");
  expect(DataTypes.getStringValue(data, "flag")).toBe("true");
});

test("Tests for isSimpleType", () => {
  expect(DataTypes.isSimpleType(1)).toBeTruthy();
  expect(DataTypes.isSimpleType(new Date())).toBeTruthy();
  expect(DataTypes.isSimpleType(Symbol())).toBeFalsy();
  expect(DataTypes.isSimpleType(["a", "b", "c"])).toBeTruthy();
  expect(DataTypes.isSimpleType({})).toBeFalsy();
});

test("Tests for IdDefaultType", () => {
  const test = <T extends object, F extends keyof T = IdDefaultType<T>>(
    obj: T,
    field?: F
  ) => {
    const f = field ?? ("id" as F);
    return obj[f];
  };

  type D = { label: string; name: string; id: number };
  const data: D = {
    label: "label",
    name: "name",
    id: 1
  };
  const v = test<D>(data);
  expect(typeof v).toBe("number");

  const v1 = test<D, LabelDefaultType<D>>(data, "label");
  expect(v1).toBe("label");
});

test("Tests for jsonReplacer", () => {
  const obj = { a: 1, b: "hello", c: { c1: "C1", c2: false, c3: 128 } };

  const json1 = JSON.stringify(
    obj,
    DataTypes.jsonReplacer(function (key, value, path) {
      if (["", "a"].includes(key)) {
        return value;
      }
      return undefined;
    })
  );
  expect(json1).toBe('{"a":1}');

  const json2 = JSON.stringify(
    obj,
    DataTypes.jsonReplacer(function (key, value, path) {
      if (["", "c"].includes(key) || path === "c.c2") {
        return value;
      }
      return undefined;
    })
  );
  expect(json2).toBe('{"c":{"c2":false}}');
});

test("Tests for jsonSerialize", () => {
  const obj = { a: 1, b: null, c: { c1: undefined, c2: false, c3: 128 } };
  const json = DataTypes.jsonSerialize(obj);
  expect(json).toBe('{"a":1,"c":{"c2":false,"c3":128}}');
});

test("Tests for jsonSerialize with removing empty values", () => {
  const obj = {
    a: 1,
    b: null,
    c: { c1: undefined, c2: false, c3: 128, c4: "" },
    d: ""
  };
  const json = DataTypes.jsonSerialize(obj, {
    ignoreEmpty: true,
    ignoreNull: false
  });
  expect(json).toBe('{"a":1,"b":null,"c":{"c2":false,"c3":128}}');
});

test("Tests for EditType", () => {
  type AddEntity = {
    name: string;
    age?: number;
  };

  type EditType = DataTypes.EditType<AddEntity>;

  const data1: EditType = { id: 1, name: "hello", changedFields: ["name"] };
  const data2: EditType = { id: 1, name: "hello", age: 1 };

  expect(data1.name).toBe(data2.name);
});

test("Tests for BasicTemplate", () => {
  const template: DataTypes.BasicTemplate = {
    id: "number",
    name: "string",
    birthday: "date"
  };

  const data: { currentPage?: number } & DataTypes.BasicTemplateType<
    typeof template
  > = {
    id: 1,
    name: "Etsoo",
    birthday: new Date()
  };

  expect(data.id).toBe(1);
});
