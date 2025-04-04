/// <reference lib="dom" />
import { DataTypes } from "./DataTypes";
import { DateUtils } from "./DateUtils";
import { Utils } from "./Utils";
import { ErrorData, ErrorType } from "./types/ErrorData";
import { FormDataFieldValue, IFormData } from "./types/FormData";

if (typeof navigator === "undefined") {
  // Test mock only
  globalThis.navigator = { language: "en-US" } as any;
  globalThis.location = { href: "http://localhost/" } as any;
}

/**
 * User agent data, maybe replaced by navigator.userAgentData in future
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgentData
 */
export type UserAgentData = {
  /**
   * Browser brands
   */
  brands: {
    brand: string;
    version: string;
  }[];

  /**
   * Is mobile device
   */
  mobile: boolean;

  /**
   * Device brand (name)
   */
  device: string;

  /**
   * Platform (OS)
   */
  platform: string;

  /**
   * Platform version
   */
  platformVersion?: string;
};

/**
 * Dom Utilities
 * Not all methods support Node
 */
export namespace DomUtils {
  /**
   * Language cache parameter name
   */
  export const CultureField = "culture";

  /**
   * Country cache parameter name
   */
  export const CountryField = "country";

  /**
   * Clear form data
   * @param data Form data
   * @param source Source data to match
   * @param keepFields Fields need to be kept
   */
  export function clearFormData(
    data: IFormData,
    source?: object,
    keepFields?: string[]
  ) {
    // Unique keys, FormData may have same name keys
    const keys = new Set(data.keys());

    // Remove empty key
    const removeEmpty = (key: string) => {
      // Need to be kept
      if (keepFields != null && keepFields.includes(key)) return;

      // Get all values
      const formValues = data.getAll(key);
      if (formValues.length == 1 && formValues[0] === "") {
        // Remove empty field
        data.delete(key);
      }
    };

    if (source == null) {
      // Remove all empty strings
      for (const key of keys) {
        removeEmpty(key);
      }
    } else {
      const sourceKeys = Object.keys(source);
      for (const key of sourceKeys) {
        // Need to be kept
        if (keepFields != null && keepFields.includes(key)) continue;

        // Get all values
        const formValues = data.getAll(key);
        if (formValues.length > 0) {
          // Matched
          // Source value
          const sourceValue = Reflect.get(source, key);

          if (Array.isArray(sourceValue)) {
            // Array, types may differ
            if (formValues.join("`") === sourceValue.join("`")) {
              // Equal value, remove the key
              data.delete(key);
            }
          } else if (formValues.length == 1) {
            // Other
            if (formValues[0].toString() === `${sourceValue}`) {
              // Equal value, remove the key
              data.delete(key);
            }
          }
        }
      }

      // Left fields
      for (const key of keys) {
        // Already cleared
        if (sourceKeys.includes(key)) continue;

        // Remove empties
        removeEmpty(key);
      }
    }

    // Return
    return data;
  }

  function dataAsTraveller(
    source: IFormData | object,
    data: object,
    template: object,
    keepSource: boolean,
    isValue: boolean
  ) {
    // Properties
    const properties = Object.keys(template);

    // Entries
    const entries = Object.entries(
      isFormData(source) ? formDataToObject(source) : source
    );

    for (const [key, value] of entries) {
      // Is included or keepSource
      const property =
        properties.find(
          (p) => p.localeCompare(key, "en", { sensitivity: "base" }) === 0
        ) ?? (keepSource ? key : undefined);
      if (property == null) continue;

      // Template value
      const templateValue = Reflect.get(template, property);

      // Formatted value
      let propertyValue: any;

      if (templateValue == null) {
        // Just read the source value
        propertyValue = value;
      } else {
        if (isValue) {
          // With template value
          propertyValue = DataTypes.convert(value, templateValue);
        } else {
          // With template type
          propertyValue = DataTypes.convertByType(value, templateValue);
        }
      }

      // Set value
      // Object.assign(data, { [property]: propertyValue });
      // Object.defineProperty(data, property, { value: propertyValue });
      Reflect.set(data, property, propertyValue);
    }
  }

  /**
   * Cast data as template format
   * @param source Source data
   * @param template Format template
   * @param keepSource Keep other source properties
   * @returns Result
   */
  export function dataAs<T extends DataTypes.BasicTemplate>(
    source: unknown,
    template: T,
    keepSource: boolean = false
  ): DataTypes.BasicTemplateType<T> {
    // New data
    // Object.create(...)
    const data = <DataTypes.BasicTemplateType<T>>{};

    if (source != null && typeof source === "object") {
      // Travel all properties
      dataAsTraveller(source, data, template, keepSource, false);
    }

    // Return
    return data;
  }

  /**
   * Cast data to target type
   * @param source Source data
   * @param template Template for generation
   * @param keepSource Means even the template does not include the definition, still keep the item
   * @returns Result
   */
  export function dataValueAs<T extends object>(
    source: IFormData | object,
    templateValue: T,
    keepSource: boolean = false
  ): Partial<T> {
    // New data
    // Object.create(...)
    const data = <Partial<T>>{};

    // Travel all properties
    dataAsTraveller(source, data, templateValue, keepSource, true);

    // Return
    return data;
  }

  /**
   * Current detected country
   */
  export const detectedCountry = (() => {
    // URL first, then local storage
    let country: string | null;
    try {
      country =
        new URL(location.href).searchParams.get(CountryField) ??
        sessionStorage.getItem(CountryField) ??
        localStorage.getItem(CountryField);
    } catch {
      country = null;
    }

    // Return
    return country;
  })();

  /**
   * Current detected culture
   */
  export const detectedCulture = (() => {
    // URL first, then local storage
    let culture: string | null;
    try {
      culture =
        new URL(location.href).searchParams.get(CultureField) ??
        sessionStorage.getItem(CultureField) ??
        localStorage.getItem(CultureField);
    } catch {
      culture = null;
    }

    // Browser detected
    if (culture == null) {
      culture =
        (navigator.languages && navigator.languages[0]) || navigator.language;
    }

    // Return
    return culture;
  })();

  /**
   * Is two dimensions equal
   * @param d1 Dimension 1
   * @param d2 Dimension 2
   */
  export function dimensionEqual(d1?: DOMRect, d2?: DOMRect) {
    if (d1 == null && d2 == null) {
      return true;
    }

    if (d1 == null || d2 == null) {
      return false;
    }

    if (
      d1.left === d2.left &&
      d1.top === d2.top &&
      d1.right === d2.right &&
      d1.bottom === d2.bottom
    ) {
      return true;
    }

    return false;
  }

  /**
   * Download file from API fetch response body
   * @param data Data
   * @param suggestedName Suggested file name
   * @param autoDetect Auto detect, false will use link click way
   */
  export async function downloadFile(
    data: ReadableStream | Blob,
    suggestedName?: string,
    autoDetect: boolean = true
  ) {
    try {
      if (autoDetect && "showSaveFilePicker" in globalThis) {
        // AbortError - Use dismisses the window
        const handle = await (globalThis as any).showSaveFilePicker({
          suggestedName
        });

        if (!(await verifyPermission(handle, true))) return undefined;

        const stream = await handle.createWritable();

        if (data instanceof Blob) {
          data.stream().pipeTo(stream);
        } else {
          await data.pipeTo(stream);
        }

        return true;
      } else {
        const url = window.URL.createObjectURL(
          data instanceof Blob ? data : await new Response(data).blob()
        );

        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        if (suggestedName) a.download = suggestedName;

        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);

        return true;
      }
    } catch (e) {
      console.error("DomUtils.downloadFile with error", e);
    }

    return false;
  }

  /**
   * File to data URL
   * @param file File
   * @returns Data URL
   */
  export async function fileToDataURL(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const data = reader.result;
        if (data == null) {
          reject();
          return;
        }

        resolve(data as string);
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Form data to object
   * @param form Form data
   * @returns Object
   */
  export function formDataToObject(form: IFormData) {
    const dic: Record<string, FormDataFieldValue | FormDataFieldValue[]> = {};
    for (const key of new Set(form.keys())) {
      const values = form.getAll(key);
      dic[key] = values.length == 1 ? values[0] : values;
    }
    return dic;
  }

  /**
   * Is wechat client
   * @param data User agent data
   * @returns Result
   */
  export function isWechatClient(data?: UserAgentData | null) {
    data ??= parseUserAgent();
    if (!data) return false;

    return data.brands.some(
      (item) => item.brand.toLowerCase() === "micromessenger"
    );
  }

  /**
   * Culture match case Enum
   */
  export enum CultureMatch {
    Exact,
    Compatible,
    SamePart,
    Default
  }

  /**
   * Get English resources definition
   * @param resources Resources
   * @returns Result
   */
  export const en = <T extends DataTypes.StringRecord = DataTypes.StringRecord>(
    resources: T | (() => Promise<T>)
  ): DataTypes.CultureDefinition<T> => ({
    name: "en",
    label: "English",
    resources
  });

  /**
   * Get simplified Chinese resources definition
   * @param resources Resources
   * @returns Result
   */
  export const zhHans = <
    T extends DataTypes.StringRecord = DataTypes.StringRecord
  >(
    resources: T | (() => Promise<T>)
  ): DataTypes.CultureDefinition<T> => ({
    name: "zh-Hans",
    label: "简体中文",
    resources,
    compatibleNames: ["zh-CN", "zh-SG"]
  });

  /**
   * Get traditional Chinese resources definition
   * @param resources Resources
   * @returns Result
   */
  export const zhHant = <
    T extends DataTypes.StringRecord = DataTypes.StringRecord
  >(
    resources: T | (() => Promise<T>)
  ): DataTypes.CultureDefinition<T> => ({
    name: "zh-Hant",
    label: "繁體中文",
    resources,
    compatibleNames: ["zh-HK", "zh-TW", "zh-MO"]
  });

  /**
   * Get the available culture definition
   * @param items Available cultures
   * @param culture Detected culture
   */
  export const getCulture = <T extends DataTypes.StringRecord>(
    items: DataTypes.CultureDefinition<T>[],
    culture: string
  ): [DataTypes.CultureDefinition<T>, CultureMatch] => {
    if (items.length === 0) {
      throw new Error("Culture items cannot be empty");
    }

    // Exact match
    const exactMatch = items.find((item) => item.name === culture);
    if (exactMatch) return [exactMatch, CultureMatch.Exact];

    // Compatible match
    const compatibleMatch = items.find(
      (item) =>
        item.compatibleNames?.includes(culture) ||
        culture.startsWith(item + "-")
    );
    if (compatibleMatch) return [compatibleMatch, CultureMatch.Compatible];

    // Same part, like zh-CN and zh-HK
    const samePart = culture.split("-")[0];
    const samePartMatch = items.find((item) => item.name.startsWith(samePart));
    if (samePartMatch) return [samePartMatch, CultureMatch.SamePart];

    // Default
    return [items[0], CultureMatch.Default];
  };

  /**
   * Get input value depending on its type
   * @param input HTML input
   * @returns Result
   */
  export function getInputValue(input: HTMLInputElement) {
    const type = input.type;
    if (type === "number" || type === "range") {
      const num = input.valueAsNumber;
      if (isNaN(num)) return null;
      return num;
    } else if (type === "date" || type === "datetime-local")
      return input.valueAsDate ?? DateUtils.parse(input.value);
    return input.value;
  }

  /**
   * Get an unique key combined with current URL
   * @param key Key
   */
  export const getLocationKey = (key: string) => `${location.href}:${key}`;

  function isIterable<T>(
    headers: Record<string, string> | Iterable<T>
  ): headers is Iterable<T> {
    return Symbol.iterator in headers;
  }

  /**
   * Convert headers to object
   * @param headers Heaers
   */
  export function headersToObject(
    headers: HeadersInit | Iterable<[string, string]>
  ): Record<string, string> {
    if (Array.isArray(headers)) {
      return Object.fromEntries(headers);
    }

    if (typeof Headers === "undefined") {
      return Object.fromEntries(Object.entries(headers));
    }

    if (headers instanceof Headers) {
      return Object.fromEntries(headers.entries());
    }

    if (isIterable(headers)) {
      return Object.fromEntries(headers);
    }

    return headers;
  }

  /**
   * Is IFormData type guard
   * @param input Input object
   * @returns result
   */
  export function isFormData(input: unknown): input is IFormData {
    if (
      typeof input === "object" &&
      input != null &&
      "entries" in input &&
      "getAll" in input &&
      "keys" in input
    ) {
      return true;
    }
    return false;
  }

  /**
   * Is JSON content type
   * @param contentType Content type string
   */
  export function isJSONContentType(contentType: string) {
    if (
      contentType &&
      // application/problem+json
      // application/json
      (contentType.includes("json") ||
        contentType.startsWith("application/javascript"))
    )
      return true;
    return false;
  }

  /**
   * Merge form data to primary one
   * @param form Primary form data
   * @param forms Other form data
   * @returns Merged form data
   */
  export function mergeFormData(form: IFormData, ...forms: IFormData[]) {
    for (const newForm of forms) {
      for (const key of new Set(newForm.keys())) {
        form.delete(key);
        newForm.getAll(key).forEach((value) => form.append(key, value as any));
      }
    }

    return form;
  }

  /**
   * Merge URL search parameters
   * @param base URL search parameters
   * @param data New simple object data to merge
   */
  export function mergeURLSearchParams(
    base: URLSearchParams,
    data: DataTypes.SimpleObject
  ) {
    Object.entries(data).forEach(([key, value]) => {
      if (value == null) return;
      base.set(key, value.toString());
    });
    return base;
  }

  /**
   * Parse navigator's user agent string
   * Lightweight User-Agent string parser
   * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
   * @param ua User agent string
   * @returns User agent data
   */
  export function parseUserAgent(ua?: string): UserAgentData | null {
    ua ??= globalThis.navigator.userAgent;

    if (!ua) {
      return null;
    }

    const parts = ua.split(/(?!\(.*)\s+(?!\()(?![^(]*?\))/g);

    let mobile = false;
    let platform = "";
    let platformVersion: string | undefined;
    let device = "Desktop";
    const brands: UserAgentData["brands"] = [];

    // with the 'g' will causing failures for multiple calls
    const platformVersionReg =
      /^[a-zA-Z0-9-\s]+\s+(0|\d+)(\.(0|\d+)){0,3}(\(|$)/;
    const versionReg = /^[a-zA-Z0-9]+\/(0|\d+)(\.(0|\d+)){0,3}(\(|$)/;

    parts.forEach((part) => {
      const pl = part.toLowerCase();

      if (pl.startsWith("mozilla/")) {
        const data = /\((.*)\)$/.exec(part);
        if (data && data.length > 1) {
          const pfItems = data[1].split(/;\s*/);

          // Platform + Version
          const pfIndex = pfItems.findIndex((item) =>
            platformVersionReg.test(item)
          );

          if (pfIndex !== -1) {
            const pfParts = pfItems[pfIndex].split(/\s+/);
            platformVersion = pfParts.pop();
            platform = pfParts.join(" ");
          } else {
            const appleVersionReg =
              /((iPhone|Mac)\s+OS(\s+\w+)?)\s+((0|\d+)(_(0|\d+)){0,3})/i;

            for (let i = 0; i < pfItems.length; i++) {
              const match = appleVersionReg.exec(pfItems[i]);
              if (match && match.length > 4) {
                platform = match[1];
                platformVersion = match[4].replace(/_/g, ".");

                pfItems.splice(i, 1);
                break;
              }
            }
          }

          // Device
          const deviceIndex = pfItems.findIndex((item) =>
            item.includes(" Build/")
          );
          if (deviceIndex === -1) {
            const firstItem = pfItems[0];
            if (
              firstItem.toLowerCase() !== "linux" &&
              !firstItem.startsWith(platform)
            ) {
              device = firstItem;
              pfItems.shift();
            }
          } else {
            device = pfItems[deviceIndex].split(" Build/")[0];
            pfItems.splice(deviceIndex, 1);
          }
        }
        return;
      }

      if (pl === "mobile" || pl.startsWith("mobile/")) {
        mobile = true;
        return;
      }

      if (pl === "version" || pl.startsWith("version/")) {
        // No process
        return;
      }

      if (versionReg.test(part)) {
        let [brand, version] = part.split("/");
        const pindex = version.indexOf("(");
        if (pindex > 0) {
          version = version.substring(0, pindex);
        }
        brands.push({
          brand,
          version: Utils.trimEnd(version, ".0")
        });
        return;
      }
    });

    return { mobile, platform, platformVersion, brands, device };
  }

  /**
   * Set HTML element focus by name
   * @param name Element name or first collection item
   * @param container Container, limits the element range
   */
  export function setFocus(name: string | object, container?: HTMLElement) {
    const elementName = typeof name === "string" ? name : Object.keys(name)[0];

    container ??= document.body;

    const element = container.querySelector<HTMLElement>(
      `[name="${elementName}"]`
    );

    if (element != null) element.focus();
  }

  /**
   * Setup frontend logging
   * @param action Logging action
   * @param preventDefault Is prevent default action
   * @param window Window object
   */
  export function setupLogging(
    action: (data: ErrorData) => void | Promise<void>,
    preventDefault?: ((type: ErrorType) => boolean) | boolean,
    window: Window & typeof globalThis = globalThis.window
  ) {
    // Avoid multiple setup, if there is already a handler, please set "window.onunhandledrejection = null" first
    if (window.onunhandledrejection) return;

    const errorType: ErrorType = "error";
    const errorPD = Utils.getResult(preventDefault, errorType) ?? true;
    window.onerror = (message, source, lineNo, colNo, error) => {
      // Default source
      source ||= window.location.href;
      let data: ErrorData;
      if (typeof message === "string") {
        data = {
          type: errorType,
          message, // Share the same message with error
          source,
          lineNo,
          colNo,
          stack: error?.stack
        };
      } else {
        data = {
          type: errorType,
          subType: message.type,
          message: error?.message ?? `${message.currentTarget} event error`,
          source,
          lineNo,
          colNo,
          stack: error?.stack
        };
      }

      action(data);

      // Return true to suppress error alert
      return errorPD;
    };

    const rejectionType: ErrorType = "unhandledrejection";
    const rejectionPD = Utils.getResult(preventDefault, rejectionType) ?? true;
    window.onunhandledrejection = (event) => {
      if (rejectionPD) event.preventDefault();

      const reason = event.reason;
      const source = window.location.href;
      let data: ErrorData;

      if (reason instanceof Error) {
        const { name: subType, message, stack } = reason;
        data = {
          type: rejectionType,
          subType,
          message,
          stack,
          source
        };
      } else {
        data = {
          type: rejectionType,
          message: typeof reason === "string" ? reason : JSON.stringify(reason),
          source
        };
      }

      action(data);
    };

    const localConsole = (
      type: "consoleWarn" | "consoleError",
      orgin: (...args: any[]) => void
    ) => {
      const consolePD = Utils.getResult(preventDefault, type) ?? false;
      return (...args: any[]) => {
        // Keep original action
        if (!consolePD) orgin(...args);

        const [first, ...rest] = args;
        let message: string;
        if (typeof first === "string") {
          message = first;
        } else {
          message = JSON.stringify(first);
        }

        const stack =
          rest.length > 0
            ? rest.map((item) => JSON.stringify(item)).join(", ")
            : undefined;

        const data: ErrorData = {
          type,
          message,
          source: window.location.href,
          stack
        };

        action(data);
      };
    };

    window.console.warn = localConsole("consoleWarn", window.console.warn);

    window.console.error = localConsole("consoleError", window.console.error);
  }

  /**
   * Verify file system permission
   * https://developer.mozilla.org/en-US/docs/Web/API/FileSystemHandle/requestPermission
   * @param fileHandle FileSystemHandle
   * @param withWrite With write permission
   * @returns Result
   */
  export async function verifyPermission(
    fileHandle: any,
    withWrite: boolean = false
  ) {
    if (
      !("queryPermission" in fileHandle) ||
      !("requestPermission" in fileHandle)
    )
      return false;

    // FileSystemHandlePermissionDescriptor
    const opts = { mode: withWrite ? "readwrite" : "read" };

    // Check if we already have permission, if so, return true.
    if ((await fileHandle.queryPermission(opts)) === "granted") {
      return true;
    }

    // Request permission to the file, if the user grants permission, return true.
    if ((await fileHandle.requestPermission(opts)) === "granted") {
      return true;
    }

    // The user did not grant permission, return false.
    return false;
  }
}
