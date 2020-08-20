export namespace NumberUtils {
    /**
     * Parse float value
     * @param rawData Raw data
     */
    export const parse = (
        rawData: string | number | undefined | object
    ): number => {
        if (rawData == null) {
            return Number.NaN;
        }

        if (typeof rawData === 'number') {
            return rawData;
        }

        return parseFloat(rawData.toString());
    };
}
