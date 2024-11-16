declare global {
  interface Number {
    /**
     * To the exact precision number avoiding precision lost
     * @param precision Precision
     */
    toExact(precision?: number): number;
  }
}

Number.prototype.toExact = function (this: number, precision?: number) {
  if (precision == null || precision < 0) precision = 2;

  if (precision === 0) return Math.round(this);

  const p = Math.pow(10, precision);
  return Math.round(this * p) / p;
};

export namespace NumberUtils {
  /**
   * Format number
   * @param input Input
   * @param locale Locale
   * @param options Options
   * @returns Result
   */
  export function format(
    input: number | bigint,
    locale?: string | string[],
    options?: Intl.NumberFormatOptions
  ) {
    // Formatter
    const intl = new Intl.NumberFormat(locale, options);
    return intl.format(input);
  }

  /**
   * Format money
   * @param input Input
   * @param currency Currency, like USD for US dollar
   * @param locale Locale
   * @param isInteger Is integer value
   * @param options Options
   * @returns Result
   */
  export function formatMoney(
    input: number | bigint,
    currency?: string,
    locale?: string | string[],
    isInteger: boolean = false,
    options: Intl.NumberFormatOptions = {}
  ) {
    if (currency) {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
      options.style = "currency";
      options.currency = currency;
      options.currencyDisplay ??= "narrowSymbol";
    }

    if (isInteger) {
      options.minimumFractionDigits ??= 0;
      options.maximumFractionDigits ??= 0;
    } else options.minimumFractionDigits ??= 2;

    return format(input, locale, options);
  }

  /**
   * Format file size
   * @param size File size
   * @param fractionDigits Fraction digits
   * @returns Result
   */
  export function formatFileSize(size: number, fractionDigits: number = 2) {
    const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return (
      (size / Math.pow(1024, i)).toFixed(fractionDigits) +
      " " +
      ["B", "KB", "MB", "GB", "TB", "PB"][i]
    );
  }

  /**
   * Get currency symbol or name from ISO code
   * @param code ISO currency code, like USD / CNY
   * @param display Display format
   * @param locale Locale
   * @returns Result
   */
  export function getCurrencySymbol(
    code: string,
    display: "symbol" | "narrowSymbol" | "name" = "narrowSymbol",
    locale?: string
  ): string | undefined {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: code,
      currencyDisplay: display
    });

    const parts = formatter.formatToParts();
    const symbol = parts.find((part) => part.type === "currency")?.value;

    return symbol;
  }

  /**
   * Parse number
   * @param rawData Raw data
   */
  export function parse(rawData: unknown): number | undefined;

  /**
   * Parse number with default value
   * @param rawData Raw data
   * @param defaultValue Default value
   */
  export function parse(rawData: unknown, defaultValue: number): number;

  export function parse(
    rawData: unknown,
    defaultValue?: number
  ): number | undefined {
    if (rawData == null || rawData === "") {
      return defaultValue;
    }

    if (typeof rawData === "number") {
      if (isNaN(rawData)) return defaultValue;
      return rawData;
    }

    const p = parseFloat(rawData.toString());
    if (isNaN(p)) return defaultValue;
    return p;
  }

  /**
   * Parse float value and unit
   * @param input Input string
   * @returns Result, like [number, string]
   */
  export const parseWithUnit = (
    input: string
  ): [number, string] | undefined => {
    if (/^(\d+)(\D*)$/g.test(input)) {
      return [Number(RegExp.$1), RegExp.$2.trim()];
    }
    return undefined;
  };
}
