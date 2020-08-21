/**
 * Interface data types
 */
export namespace DataTypes {
    /**
     * Display type enum
     */
    export enum DisplayType {
        Unkwown = 0,
        Default = 1,
        Number = 2,
        Money = 3,
        Bool = 4,
        Date = 5,
        URL = 8,
        Logo = 9
    }

    /**
     * Dynamic data
     * Indexable type
     */
    export type DynamicData = Record<string, any>;

    /**
     * Readonly data
     * Indexable type
     */
    export type ReadonlyData = Readonly<DynamicData>;

    /**
     * Simple base types
     */
    export type SimpleBaseType =
        | bigint
        | boolean
        | Date
        | number
        | string
        | symbol;

    /**
     * Simple types
     */
    export type SimpleType =
        | SimpleBaseType
        | SimpleBaseType[]
        | null
        | undefined;

    /**
     * Is the target a simple type (Type guard)
     * @param target Test target
     * @param includeArray Include array as simple type
     */
    export function isSimpleType(
        target: any,
        includeArray: boolean = true
    ): target is SimpleType {
        return (
            target instanceof Date ||
            (includeArray &&
                Array.isArray(target) &&
                (target.length === 0 || isSimpleType(target[0], false))) ||
            target !== Object(target)
        );
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
     * String dictionary type
     */
    export type StringDictionary = Record<string, string>;

    /**
     * Readonly string dictionary type
     */
    export type ReadonlyStringDictionary = Readonly<StringDictionary>;

    /**
     * Language definiton
     */
    export type LanguageDefinition = Readonly<{
        /**
         * Name, like zh-CN
         */
        name: string;

        /**
         * Label for description, like Simplifined Chinese
         */
        label: string;

        /**
         * Labels
         */
        labels: ReadonlyStringDictionary;
    }>;
}
