/**
 * Generic object type
 * Narrow case, uses StringRecord
 * Before was wrong with {}, from 4.8 unknown = {} | null | undefined
 */

declare global {
  interface BigInt {
    toJSON(): String;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString() + "n";
};

/**
 * Interface data types
 */
export namespace DataTypes {
  /**
   * Basic types, includes number, bigint, Date, boolean, string
   */
  export type Basic = number | bigint | Date | boolean | string;

  /**
   * Basic type and basic type array names array
   */
  export const BasicArray = [
    "number",
    "number[]",
    "bigint",
    "bigint[]",
    "date",
    "date[]",
    "boolean",
    "boolean[]",
    "string",
    "string[]",
    "unknown[]"
  ] as const;

  /**
   * Basic type names
   */
  export type BasicNames = (typeof BasicArray)[number];

  /**
   * Basic type template
   */
  export type BasicTemplate = { [key: string]: BasicNames };

  /**
   * Basic template type
   */
  export type BasicTemplateType<T extends BasicTemplate> = {
    [P in keyof T]?: BasicConditional<T[P]>;
  };

  /**
   * Basic conditinal type
   */
  export type BasicConditional<T extends BasicNames> = T extends "string"
    ? string
    : T extends "string[]"
    ? string[]
    : T extends "date"
    ? Date
    : T extends "date[]"
    ? Date[]
    : T extends "boolean"
    ? boolean
    : T extends "boolean[]"
    ? boolean[]
    : T extends "number"
    ? number
    : T extends "number[]"
    ? number[]
    : T extends "bigint"
    ? bigint
    : T extends "bigint[]"
    ? bigint[]
    : unknown[];

  /**
   * Basic or basic array type
   */
  export type Simple = Basic | Array<Basic>;

  /**
   * Simple type enum
   */
  export enum SimpleEnum {
    Number = 1,
    Bigint = 2,
    Date = 3,
    Boolean = 4,
    String = 5,
    Array = 9
  }

  /**
   * Simple type names
   */
  export type SimpleNames = Lowercase<keyof typeof SimpleEnum>;

  /**
   * Extended type enum
   */
  export enum ExtendedEnum {
    Unkwown = 0,

    Int = 10,
    Money = 11,
    IntMoney = 12,
    DateTime = 13,

    Email = 21,
    Phone = 22,
    URL = 23,
    Logo = 24
  }

  /**
   * Combined type enum
   */
  export const CombinedEnum = {
    ...SimpleEnum,
    ...ExtendedEnum
  };
  export type CombinedEnum = SimpleEnum | ExtendedEnum;

  /**
   * Horizontal align enum
   */
  export enum HAlignEnum {
    Left = 1,
    Center = 2,
    Right = 3
  }

  /**
   * Horizontal align
   */
  export type HAlign = Lowercase<keyof typeof HAlignEnum>;

  /**
   * Vertical align enum
   */
  export enum VAlignEnum {
    Top = 1,
    Center = 2,
    Bottom = 3
  }

  /**
   * Vertical align
   */
  export type VAlign = Lowercase<keyof typeof VAlignEnum>;

  /**
   * Placement enum
   */
  export enum PlacementEnum {
    TopLeft,
    TopCenter,
    TopRight,

    MiddleLeft,
    Center,
    MiddleRight,

    BottomLeft,
    BottomCenter,
    BottomRight,

    Unknown // Reserved for modal, only one instance held at the same time
  }

  /**
   * Placement type
   */
  export type Placement = keyof typeof PlacementEnum;

  /**
   * Edit type from adding type
   */
  export type EditType<T, I extends IdType = number> = Partial<T> & {
    id: I;
    changedFields?: (keyof T & string)[];
  };

  /**
   * Key collection, like { key1: {}, key2: {} }
   */
  export type KeyCollection<K extends readonly string[], I extends object> = {
    [P in K[number]]: I;
  };

  /**
   * Enum value type
   */
  export type EnumValue = number | string;

  /**
   * Enum base type
   */
  export type EnumBase = Record<string, EnumValue>;

  /**
   * Function type
   */
  export type Func<R> = (...args: any[]) => R;

  /**
   * Mixins constructor
   */
  export type MConstructor<T = {}> = new (...args: any[]) => T;

  /**
   * Make properties optional
   */
  export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

  /**
   * String key, unknown value Record
   */
  export type StringRecord = Record<string, unknown>;

  /**
   * String key, string value Record
   */
  export type StringDictionary = Record<string, string>;

  /**
   * Simple object, string key, simple type and null value Record
   */
  export type SimpleObject = Record<string, Simple | null | undefined>;

  /**
   * Item with id property
   */
  export type IdItem<T extends IdType = number> = {
    /**
     * Id field
     */
    id: T;
  };

  /**
   * Item with id and label property
   */
  export type IdLabelItem<T extends IdType = number> = IdItem<T> & {
    /**
     * label field
     */
    label: string;
  };

  /**
   * Item with id and name property
   */
  export type IdNameItem<T extends IdType = number> = IdItem<T> & {
    /**
     * name field
     */
    name: string;
  };

  /**
   * Item with id and title property
   */
  export type IdTitleItem<T extends IdType = number> = IdItem<T> & {
    /**
     * title field
     */
    title: string;
  };

  /**
   * Item with id and label dynamic type
   */
  export type IdLabelType<
    I extends string,
    L extends string,
    D extends IdType = number
  > = DIS<I, D> & DIS<L, string>;

  /**
   * Get specific type keys
   */
  export type Keys<T extends object, R = IdType> = {
    [k in keyof T]: T[k] extends R ? k : never;
  }[keyof T];

  /**
   * Require at least one property of the keys
   */
  export type RequireAtLeastOne<T, Keys extends keyof T> = Pick<
    T,
    Exclude<keyof T, Keys>
  > &
    {
      [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
    }[Keys];

  /**
   * Culture definiton
   */
  export type CultureDefinition<T extends StringRecord = StringRecord> = {
    /**
     * Name, like zh-CN
     */
    readonly name: string;

    /**
     * Label for description, like Simplifined Chinese
     */
    label: string;

    /**
     * Resources
     */
    resources: T | (() => Promise<T>);

    /**
     * Compatible names
     */
    readonly compatibleNames?: string[];
  };

  /**
   * Dynamic interface with multiple properties
   */
  export type DI<K extends readonly string[], T> = { [P in K[number]]: T };

  /**
   * Dynamic interface with single property
   */
  export type DIS<K extends string, T> = { [P in K]: T };

  /**
   * Tristate enum
   * 三态枚举
   */
  export enum TristateEnum {
    /**
     * False
     * 假
     */
    False = 0,

    /**
     * True
     * 真
     */
    True = 1,

    /**
     * Unsure
     * 无法判断
     */
    Unsure = 9
  }

  /**
   * Convert value to target type
   * @param input Input value
   * @param target Target type
   * @returns Converted value
   */
  export function convert<T>(input: unknown, target: T): T | undefined {
    // null or undefined
    if (input == null) return undefined;

    // Array
    if (Array.isArray(target)) {
      // Element item
      const elementItem = target.length > 0 ? target[0] : input;
      const elementType = getBasicNameByValue(elementItem, true);

      if (elementType == null) return <T>input;
      return <any>convertByType(input, elementType);
    }

    // Target type
    const targetType = getBasicNameByValue(target, false);
    if (targetType == null) {
      if (typeof input === typeof target) return <T>input;
      return undefined;
    }
    return <T>convertByType(input, targetType);
  }

  /**
   * Convert by type name like 'string'
   * @param input Input value
   * @param targetType Target type
   * @returns Converted value
   */
  export function convertByType<T extends BasicNames>(
    input: unknown,
    targetType: T
  ): BasicConditional<T> | undefined {
    // null or undefined
    // And avoid empty string to mass up in different type
    if (input == null || (typeof input === "string" && input.trim() === ""))
      return undefined;

    // Return type
    type returnType = BasicConditional<T>;

    // Array
    if (targetType.endsWith("[]")) {
      // Input array
      const inputArray = Array.isArray(input)
        ? input
        : typeof input === "string"
        ? input.split(/,\s*/g) // Support comma separated array
        : [input];

      // Element type
      const elementType = <BasicNames>(
        targetType.slice(0, targetType.length - 2)
      );

      // Convert type
      return <returnType>(
        inputArray
          .map((item) => convertByType(item, elementType))
          .filter((item) => item != null) // Remove undefined item
      );
    }

    // Same type
    if (typeof input === targetType) return <returnType>input;

    // Date
    if (targetType === "date") {
      if (input instanceof Date) return <returnType>input;
      if (typeof input === "string" || typeof input === "number") {
        const date = new Date(input);
        return date == null ? undefined : <returnType>date;
      }
      return undefined;
    }

    // Bigint
    if (targetType === "bigint") {
      if (
        typeof input === "string" ||
        typeof input === "number" ||
        typeof input === "boolean"
      )
        return <returnType>BigInt(input);
      return undefined;
    }

    // Boolean
    if (targetType === "boolean") {
      if (typeof input === "string" || typeof input === "number") {
        // Here are different with official definition
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
        if (input === "0" || input === "false") return <returnType>false;
        return <returnType>Boolean(input);
      }
      return undefined;
    }

    // Number
    if (targetType === "number") {
      const number = Number(input);
      return isNaN(number) ? undefined : <returnType>number;
    }

    // String
    if (targetType === "string") {
      return <returnType>String(input);
    }

    // Default
    return undefined;
  }

  /**
   * Convert value to target enum type
   * @param input Input value
   * @param enumType  Target enum type
   * @returns Converted type
   */
  export function convertSimple(
    input: unknown,
    enumType: CombinedEnum
  ): Simple | unknown[] | undefined {
    const type = getBasicName(enumType);
    const value = convertByType(input, type);
    if (value == null) return undefined;

    if (typeof value === "number") {
      if (enumType === CombinedEnum.Int || enumType === CombinedEnum.IntMoney)
        return Math.round(value);

      if (enumType === CombinedEnum.Money)
        return Math.round(10000 * value) / 10000;
    }

    return value;
  }

  /**
   * Get basic type name from Enum type
   * @param enumType Enum type
   * @returns Basic type name result
   */
  export function getBasicName(enumType: CombinedEnum): BasicNames {
    switch (enumType) {
      case CombinedEnum.Array:
        return "unknown[]";
      case CombinedEnum.Bigint:
        return "bigint";
      case CombinedEnum.Boolean:
        return "boolean";
      case CombinedEnum.Date:
      case CombinedEnum.DateTime:
        return "date";
      case CombinedEnum.Number:
      case CombinedEnum.Int:
      case CombinedEnum.IntMoney:
      case CombinedEnum.Money:
        return "number";
      default:
        return "string";
    }
  }

  /**
   * Get value's basic type name
   * @param value Input value
   * @param isArray Is array
   * @returns Value's basic type name
   */
  export function getBasicNameByValue(
    value: unknown,
    isArray: boolean = false
  ): BasicNames | undefined {
    // null or undefined
    if (value == null) return undefined;

    // Date
    if (value instanceof Date) {
      return isArray ? "date[]" : "date";
    }

    // No array

    // Other cases
    const valueType = typeof value;
    const typeName = isArray ? valueType + "[]" : valueType;
    if (!isBasicName(typeName)) return undefined;

    return typeName;
  }

  /* 
    enum Gender {
      Male = "M",
      Female = "F"
    }
  */

  /**
   * Get enum item from key
   * getEnumByKey(Gender, "Male") === Gender.Male
   * @param enumItem Enum
   * @param key Key
   * @returns Enum item
   */
  export function getEnumByKey<T extends EnumBase, K extends keyof T>(
    enumItem: T,
    key: string
  ): T[K] | undefined {
    if (key in enumItem) return <T[K]>enumItem[key];
    return undefined;
  }

  /**
   * Get enum item from value
   * getEnumByKey(Gender, "M") === Gender.Male
   * @param enumItem Enum
   * @param value Key
   * @returns Enum item or undefined
   */
  export function getEnumByValue<T extends EnumBase, K extends keyof T>(
    enumItem: T,
    value: EnumValue
  ): T[K] | undefined {
    if (typeof value === "number") {
      if (value in enumItem) return <T[K]>value;
    } else {
      const keys = Object.keys(enumItem) as (keyof T)[];
      for (const key of keys) {
        const kv = enumItem[key];
        if (kv === value) return <T[K]>kv;
      }
    }

    return undefined;
  }

  /**
   * Get enum string literal type value
   * getEnumKey(Gender, "F") === "Female"
   * @param enumItem Enum item
   * @param value Value
   * @returns Result
   */
  export function getEnumKey<T extends EnumBase>(
    enumItem: T,
    value: EnumValue
  ) {
    if (typeof value === "number") {
      if (value in enumItem) return enumItem[value].toString();
    } else {
      const keys = Object.keys(enumItem);
      for (const key of keys) {
        if (enumItem[key] === value) return key;
      }
    }

    return undefined;
  }

  /**
   * Get Enum keys
   * @param input Input Enum
   * @returns Keys
   */
  export function getEnumKeys<T extends EnumBase, K extends keyof T & string>(
    input: T
  ): K[] {
    return Object.keys(input)
      .filter((key) => !/^\d+$/.test(key))
      .map((item) => <K>item);
  }

  /**
   * Get ListType2 item label
   * @param item Item
   * @returns Result
   */
  export function getListItemLabel<D extends ListType2>(item: D) {
    return "label" in item
      ? item.label
      : "name" in item
      ? item.name
      : item.title;
  }

  /**
   * Get object item label
   * @param item Item
   * @returns Result
   */
  export function getObjectItemLabel(item: object): string {
    return "label" in item
      ? `${item.label}`
      : "name" in item
      ? `${item.name}`
      : "title" in item
      ? `${item.title}`
      : `${item}`;
  }

  /**
   * Get object field value
   * @param data Data
   * @param key Property name
   * @returns Value
   */
  export function getValue<T extends object, K extends keyof T | string>(
    data: T | undefined | null,
    key: K
  ): K extends keyof T ? T[K] : undefined {
    if (data != null && typeof key === "string" && key in data) {
      return Reflect.get(data, key);
    }
    return undefined as any;
  }

  /**
   * Get object id field value
   * @param data Data
   * @param key Property name
   * @returns Id value
   */
  export function getIdValue<T extends object, K extends Keys<T, IdType>>(
    data: T,
    key: K
  ): T[K] {
    return data[key];
  }

  /**
   * Get object id field value 1
   * @param data Data
   * @param key Property name
   * @returns Id value
   */
  export function getIdValue1<T extends object, K extends keyof T | string>(
    data: T | undefined | null,
    key: K
  ): K extends keyof T ? (T[K] extends number ? number : string) : undefined {
    const value = getValue(data, key);
    if (value == null) return undefined as any;
    if (typeof value === "number") return value as any;
    return `${value}` as any;
  }

  /**
   * Get object string field value
   * @param data Data
   * @param key Property name
   * @returns String value
   */
  export function getStringValue<T extends object>(
    data: T | undefined | null,
    key: keyof T | string
  ): string | undefined {
    const value = getValue(data, key);
    if (value == null) return undefined;
    if (typeof value === "string") return value;
    return `${value}`;
  }

  /**
   * Check the type is a basic type or not (type guard)
   * @param name Type name
   * @returns Is basic type
   */
  export function isBasicName(name: string): name is BasicNames {
    return BasicArray.includes(<BasicNames>name);
  }

  /**
   * Is the target a simple object (Type guard)
   * @param input Test data
   * @param includeArray Include array as simple type
   * @returns Result
   */
  export function isSimpleObject(
    input: unknown,
    includeArray: boolean = true
  ): input is SimpleObject {
    return (
      typeof input === "object" &&
      input != null &&
      Object.values(input).every((value) => isSimpleType(value, includeArray))
    );
  }

  /**
   * Is the input value simple type, include null and undefined
   * @param input Input value
   * @param includeArray Is array included, first non null element shoud also be basic type
   */
  export function isSimpleType(
    input: unknown,
    includeArray: boolean = true
  ): boolean {
    // null & undefined
    if (input == null) return true;

    // Date
    if (input instanceof Date) return true;

    // Array
    if (Array.isArray(input)) {
      if (includeArray) {
        return isSimpleType(input.find((item) => item != null));
      } else {
        // No array needed
        return false;
      }
    }

    // Other cases
    const type = typeof input;
    if (type === "function" || type === "object" || type === "symbol")
      return false;

    return true;
  }

  /**
   * JSON.stringify replacer with full path
   * https://stackoverflow.com/questions/61681176/json-stringify-replacer-how-to-get-full-path
   */
  export function jsonReplacer(
    replacer: (this: any, key: string, value: any, path: string) => any
  ) {
    const m = new Map();

    return function (this: any, key: any, value: any) {
      const path = m.get(this) + (Array.isArray(this) ? `[${key}]` : "." + key);
      if (value === Object(value)) m.set(value, path);

      return replacer.call(
        this,
        key,
        value,
        path.replace(/undefined\.\.?/, "")
      );
    };
  }

  /**
   * JSON.stringify receiver for bigint
   * @param args Keys or paths to convert to bigint
   * @returns JSON receiver function
   */
  export function jsonBigintReceiver(...args: string[]) {
    return jsonReplacer(function (key, value, path) {
      if (
        (args.includes(key) || args.includes(path)) &&
        typeof value === "string"
      ) {
        if (value.endsWith("n")) return BigInt(value.slice(0, -1));
        else return BigInt(value);
      }

      return value;
    });
  }

  /**
   * JSON serialize with options
   * @param obj Object to serialize
   * @param options Options to ignore null or empty values
   * @returns Result
   */
  export function jsonSerialize(
    obj: unknown,
    options?: { ignoreNull?: boolean; ignoreEmpty?: boolean }
  ) {
    const { ignoreNull = true, ignoreEmpty = false } = options ?? {};

    return JSON.stringify(obj, (_key, value) => {
      if (ignoreNull && value == null) return undefined;
      if (ignoreEmpty && value === "") return undefined;
      return value;
    });
  }
}

/**
 * Number and string combination id type
 */
export type IdType = number | string;

/**
 * List item with number id type
 */
export type ListType = DataTypes.IdLabelItem<number>;

/**
 * List item with string id type
 */
export type ListType1 = DataTypes.IdLabelItem<string>;

/**
 * List item with compatible id and name / label / title
 */
export type ListType2 = {
  id: IdType;
} & ({ label: string } | { name: string } | { title: string });

/**
 * Id default type
 */
export type IdDefaultType<
  T extends object,
  I extends IdType = IdType
> = T extends { id: I } ? DataTypes.Keys<T, I> & "id" : DataTypes.Keys<T, I>;

/**
 * Label default type
 */
export type LabelDefaultType<T extends object> = T extends { label: string }
  ? DataTypes.Keys<T, string> & "label"
  : DataTypes.Keys<T, string>;

/**
 * Title default type
 */
export type TitleDefaultType<T extends object> = T extends { title: string }
  ? DataTypes.Keys<T, string> & "title"
  : DataTypes.Keys<T, string>;
