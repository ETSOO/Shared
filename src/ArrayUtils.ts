import isEqual from 'lodash.isequal';
import { DataTypes } from './DataTypes';

declare global {
    interface Array<T> {
        /**
         * Items do not exist in target array or reverse match
         * @param target Target array
         * @param round A round for both matches
         */
        different(target: Array<T>, round?: boolean): Array<T>;

        /**
         * Get max number item or number item property
         * @param field Object field to calculate
         */
        max(
            ...field: T extends number
                ? [undefined?]
                : T extends object
                ? [DataTypes.Keys<T, number>]
                : [never]
        ): number;

        /**
         * Get max field value item
         * @param field Object field to calculate
         */
        maxItem(
            field: T extends object ? DataTypes.Keys<T, number> : never
        ): T | undefined;

        /**
         * Get min number item or number item property
         * @param field Object field to calculate
         */
        min(
            ...field: T extends number
                ? [undefined?]
                : T extends object
                ? [DataTypes.Keys<T, number>]
                : [never]
        ): number;

        /**
         * Get min field value item
         * @param field Object field to calculate
         */
        minItem(
            field: T extends object ? DataTypes.Keys<T, number> : never
        ): T | undefined;

        /**
         * Sort by property
         * @param property Property
         * @param values Property values
         */
        sortByProperty<P extends keyof T>(property: P, values: T[P][]): T[];

        /**
         * Sum number items or number item properties
         * @param field Object field to calculate
         */
        sum(
            ...field: T extends number
                ? [undefined?]
                : T extends object
                ? [DataTypes.Keys<T, number>]
                : [never]
        ): number;

        /**
         * Make all items are unique
         * @param this Input array
         */
        toUnique(): Array<T>;
    }
}

Array.prototype.different = function <T>(
    this: Array<T>,
    target: Array<T>,
    round?: boolean
) {
    return ArrayUtils.differences(this, target, round);
};

Array.prototype.toUnique = function <T>(this: Array<T>) {
    if (this.length === 0 || typeof this[0] !== 'object')
        return Array.from(new Set(this));

    const newArray: T[] = [];
    this.forEach((item) => {
        if (newArray.some((newItem) => isEqual(item, newItem))) return;
        newArray.push(item);
    });
    return newArray;
};

Array.prototype.max = function <T>(
    this: Array<T>,
    field: T extends object ? DataTypes.Keys<T, number> : undefined
) {
    if (field == null) {
        return Math.max(...(this as Array<number>));
    }

    return Math.max(...this.map((item) => item[field] as number));
};

Array.prototype.maxItem = function <T>(
    this: Array<T>,
    field: T extends object ? DataTypes.Keys<T, number> : never
) {
    if (this.length === 0) return undefined;

    return this.reduce((prev, curr) =>
        prev[field] > curr[field] ? prev : curr
    );
};

Array.prototype.min = function <T>(
    this: Array<T>,
    field: T extends object ? DataTypes.Keys<T, number> : undefined
) {
    if (field == null) {
        return Math.min(...(this as Array<number>));
    }

    return Math.min(...this.map((item) => item[field] as number));
};

Array.prototype.minItem = function <T>(
    this: Array<T>,
    field: T extends object ? DataTypes.Keys<T, number> : never
) {
    if (this.length === 0) return undefined;

    return this.reduce((prev, curr) =>
        prev[field] < curr[field] ? prev : curr
    );
};

Array.prototype.sortByProperty = function <T, P extends keyof T>(
    this: Array<T>,
    property: P,
    values: T[P][]
) {
    return this.sort((a, b) => {
        const ai = values.indexOf(a[property]);
        const bi = values.indexOf(b[property]);

        if (ai === bi) return 0;
        if (ai < 0 || bi < 0) return bi === 0 ? 1 : bi;
        return ai - bi;
    });
};

Array.prototype.sum = function <T>(
    this: Array<T>,
    field: T extends object ? DataTypes.Keys<T, number> : undefined
) {
    if (field == null) {
        return this.reduce((total, num) => total + (num as number), 0);
    }

    return this.reduce((total, item) => total + (item[field] as number), 0);
};

/**
 * Array Utilities
 */
export namespace ArrayUtils {
    /**
     * Array 1 items do not exist in Array 2 or reverse match
     * @param a1 Array 1
     * @param a2 Array 2
     * @param round A round for both matches
     */
    export function differences<T>(a1: T[], a2: T[], round?: boolean) {
        const diff = a1.filter((x) => !a2.includes(x));
        if (round) return [...diff, ...a2.filter((x) => !a1.includes(x))];
        return diff;
    }
}
