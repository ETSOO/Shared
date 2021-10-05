/**
 * Interface data types
 */
export namespace DataTypes {
    /**
     * Data type enum
     */
    export enum DataType {
        Unkwown = 0,
        Int = 1,
        Money = 2,
        IntMoney = 3,
        Number = 4,
        Date = 5,
        DateTime = 6,
        Boolean = 7,
        String = 10,
        Email = 11,
        Phone = 12,
        URL = 13,
        Logo = 14
    }

    /**
     * Dynamic data
     * Indexable type
     */
    export type DynamicData = Record<string, any>;

    /**
     * Number and string combination id type
     */
    export type IdType = number | string;

    /**
     * Readonly data
     * Indexable type
     */
    export type ReadonlyData = Readonly<DynamicData>;

    /**
     * Base types
     */
    export type BaseType = boolean | Date | number | string;

    /**
     * Nullable base types
     */
    export type NullableBaseType = BaseType | null | undefined;

    /**
     * Base and collection types
     */
    export type BaseCType = NullableBaseType | NullableBaseType[];

    /**
     * Simple base types
     */
    export type SimpleBaseType = BaseType | bigint | symbol;

    /**
     * Simple types
     */
    export type SimpleType = SimpleBaseType | SimpleBaseType[];

    /**
     * Change type
     * @param input Input
     * @param targetType Target type
     */
    export function changeType(
        input: NullableBaseType | NullableBaseType[],
        targetType: DataType
    ) {
        // Null or empty return
        if (input == null || input === '') return null;

        // Aarray
        if (Array.isArray(input)) {
            input.forEach((value, index, array) => {
                const itemValue = changeType(value, targetType);
                if (!Array.isArray(itemValue)) array[index] = itemValue;
            });
            return input;
        }

        // Boolean
        if (targetType === DataType.Boolean) {
            if (typeof input === 'boolean') return input;
            else return Boolean(input);
        }

        // Date
        if (targetType === DataType.Date || targetType === DataType.DateTime) {
            if (input instanceof Date) return input;
            else if (typeof input === 'number' || typeof input === 'string')
                return new Date(input);
            else return null;
        }

        // Number
        if (
            targetType === DataType.Int ||
            targetType === DataType.Money ||
            targetType === DataType.Number
        ) {
            const numValue = typeof input === 'number' ? input : Number(input);
            if (isNaN(numValue)) return null;
            if (targetType === DataType.Int) return Math.round(numValue);
            if (targetType === DataType.Money)
                return Math.round(10000 * numValue) / 10000;
            return numValue;
        }

        // String
        return String(input);
    }

    /**
     * Is the target a base collection type (Type guard)
     * @param target Test target
     * @param includeArray Include array as base type
     */
    export function isBaseType(
        target: any,
        includeArray: boolean = true
    ): target is BaseCType {
        if (target == null) return true;
        return (
            target instanceof Date ||
            (includeArray &&
                Array.isArray(target) &&
                (target.length === 0 || isSimpleType(target[0], false))) ||
            target !== Object(target)
        );
    }

    /**
     * Is the target a simple type (Type guard)
     * @param target Test target
     * @param includeArray Include array as simple type
     */
    export function isSimpleType(
        target: any,
        includeArray: boolean = true
    ): target is SimpleType {
        if (target == null) return true;
        return (
            target instanceof Date ||
            (includeArray &&
                Array.isArray(target) &&
                (target.length === 0 || isSimpleType(target[0], false))) ||
            target !== Object(target)
        );
    }

    /**
     * Parse input data's type
     * @param input Input data
     * @returns Data type
     */
    export function parseType(input: NullableBaseType): DataType {
        if (input instanceof Date) return DataType.DateTime;

        const type = typeof input;
        if (type === 'boolean') return DataType.Boolean;
        if (type === 'number') return DataType.Number;

        return DataType.String;
    }

    /**
     * Simple object
     */
    export type SimpleObject = Record<string, SimpleType>;

    /**
     * Is the target a simple object (Type guard)
     * @param data Test target
     * @param includeArray Include array as simple type
     */
    export function isSimpleObject(
        target: any,
        includeArray: boolean = true
    ): target is SimpleObject {
        return (
            target &&
            target.constructor === Object &&
            Object.values(target).findIndex(
                (value) => !isSimpleType(value, includeArray)
            ) === -1
        );
    }

    /**
     * Readonly simple object
     */
    export type ReadonlySimpleObject = Readonly<SimpleObject>;

    /**
     * String dictionary type
     */
    export type StringDictionary = Record<string, string>;

    /**
     * Readonly string dictionary type
     */
    export type ReadonlyStringDictionary = Readonly<StringDictionary>;

    /**
     * Horizontal align
     */
    export type HAlign = 'left' | 'center' | 'right';

    /**
     * Horizontal align enum
     */
    export enum HAlignEnum {
        Left = 1,
        Center = 2,
        Right = 3
    }

    /**
     * Enum align to string literal align
     * @param align Enum align
     */
    export function hAlignFromEnum(align?: HAlignEnum): HAlign | undefined {
        if (align == null) return undefined;
        return <HAlign>HAlignEnum[align].toLowerCase();
    }

    /**
     * Vertical align
     */
    export type VAlign = 'top' | 'center' | 'bottom';

    /**
     * Vertical align enum
     */
    export enum VAlignEnum {
        Top = 1,
        Center = 2,
        Bottom = 3
    }

    /**
     * Culture definiton
     */
    export type CultureDefinition = Readonly<{
        /**
         * Name, like zh-CN
         */
        name: string;

        /**
         * Label for description, like Simplifined Chinese
         */
        label: string;

        /**
         * Resources
         */
        resources: ReadonlySimpleObject;
    }>;
}
