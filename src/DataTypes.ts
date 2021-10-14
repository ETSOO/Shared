/**
 * Interface data types
 */
export namespace DataTypes {
    /**
     * Basic types, includes number, bigint, Date, boolean, string
     */
    export type Basic = number | bigint | Date | boolean | string;

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
     * Number and string combination id type
     */
    export type IdType = number | string;

    /**
     * Enum value type
     */
    export type EnumValue = number | string;

    /**
     * Enum base type
     */
    export type EnumBase = Record<string, EnumValue>;

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
     * Culture definiton
     */
    export type CultureDefinition = Readonly<{
        /**
         * Name, like zh-CN
         */
        readonly name: string;

        /**
         * Label for description, like Simplifined Chinese
         */
        readonly label: string;

        /**
         * Resources
         */
        readonly resources: Readonly<StringRecord>;

        /**
         * Compatible names
         */
        readonly compatibleName?: string[];
    }>;

    /**
     * Convert value to target type
     * @param input Input value
     * @param target Target type
     * @returns Converted value
     */
    export function convert<T>(input: unknown, target: T): T | undefined {
        // null or undefined
        if (input == null) return undefined;

        // Date
        if (target instanceof Date) {
            if (input instanceof Date) return <any>input;
            if (typeof input === 'string' || typeof input === 'number') {
                const date = new Date(input);
                return date == null ? undefined : <any>date;
            }
            return undefined;
        }

        // Array
        if (Array.isArray(target)) {
            const array = convertArray(input, target);
            if (array == null) return undefined;
            return <any>array;
        }

        // Target type
        const targetType = typeof target;

        // Same type
        if (targetType === typeof input) return <T>input;

        // Bigint
        if (targetType === 'bigint') {
            if (
                typeof input === 'string' ||
                typeof input === 'number' ||
                typeof input === 'boolean'
            )
                return <any>BigInt(input);
            return undefined;
        }

        // Boolean
        if (targetType === 'boolean') {
            if (typeof input === 'string' || typeof input === 'number') {
                // Here are different with official definition
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
                if (input === '0' || input === 'false') return <any>false;
                return <any>Boolean(input);
            }
            return undefined;
        }

        // Number
        if (targetType === 'number') {
            // Avoid empty string converted to zero
            if (input === '') return undefined;
            const number = Number(input);
            return isNaN(number) ? undefined : <any>number;
        }

        // String
        if (targetType === 'string') {
            return <any>String(input);
        }

        return undefined;
    }

    /**
     * Convert array to target type
     * @param input Input value
     * @param target Target array
     * @returns Converted array
     */
    export function convertArray<T>(
        input: unknown,
        target: T[]
    ): T[] | undefined {
        // Input array
        const inputArray = Array.isArray(input)
            ? input
            : typeof input === 'string'
            ? input.split(/,\s*/g)
            : [input];
        if (inputArray.length === 0) return [];

        // Element item
        const elementItem = Array.isArray(target)
            ? target.length > 0
                ? target[0]
                : inputArray[0]
            : target;

        // Convert type
        return inputArray.map((item) => convert(item, elementItem));
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
    ): Simple | undefined {
        const type = getSimple(enumType);
        const value = convert(input, type);
        if (value == null) return undefined;

        if (typeof value === 'number') {
            if (
                enumType === CombinedEnum.Int ||
                enumType === CombinedEnum.IntMoney
            )
                return Math.round(value);

            if (enumType === CombinedEnum.Money)
                return Math.round(10000 * value) / 10000;
        }

        return value;
    }

    /**
     * Get simple type from Enum type
     * @param enumType Enum type
     * @returns Simple type result
     */
    export function getSimple(enumType: CombinedEnum): Simple {
        switch (enumType) {
            case CombinedEnum.Array:
                return [];
            case CombinedEnum.Bigint:
                return BigInt(0);
            case CombinedEnum.Boolean:
                return false;
            case CombinedEnum.Date:
            case CombinedEnum.DateTime:
                return new Date();
            case CombinedEnum.Number:
            case CombinedEnum.Int:
            case CombinedEnum.IntMoney:
            case CombinedEnum.Money:
                return 0;
            default:
                return '';
        }
    }

    /**
     * Get enum string literal type value
     * @param enumItem Enum item
     * @param value Value
     * @returns Result
     */
    export function getEnumKey<T extends string>(
        enumItem: EnumBase,
        value: EnumValue
    ) {
        return <T>enumItem[value].toString().toLowerCase();
    }

    /**
     * Get Enum keys
     * @param input Input Enum
     * @returns Keys
     */
    export function getEnumKeys<T extends EnumBase>(input: T): string[] {
        return Object.keys(input).filter((key) => !/^\d+$/.test(key));
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
            typeof input === 'object' &&
            input != null &&
            Object.values(input).every((value) =>
                isSimpleType(value, includeArray)
            )
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
        if (type === 'function' || type === 'object' || type === 'symbol')
            return false;

        return true;
    }
}
