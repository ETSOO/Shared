# Shared

**TypeScript shared utilities and functions.**

## Installing

Using npm:

```bash
$ npm install @etsoo/shared
```

Using yarn:

```bash
$ yarn add @etsoo/shared
```

## ActionResult / IActionResult, IdActionResult, MsgActionResult, IdMsgActionResult, DynamicActionResult

|          Name | Description                |
| ------------: | -------------------------- |
| static create | Create a result from error |
|          data | Result data                |
|        detail | Details                    |
|        errors | Result errors              |
|         field | Related field              |
|            ok | Success or failure         |
|        status | Status code                |
|         title | Title                      |
|       traceId | Trace id                   |
|          type | Type                       |

## storage

Storage interface and browser storage implementation

## ContentDisposition

Content disposition of HTTP

|         Name | Description               |
| -----------: | ------------------------- |
| static parse | Parse header value        |
|      Methods |                           |
|       format | Format to standard output |

## DataError

Error with custom data

## EColor

Etsoo implmented Color

|              Name | Description                                 |
| ----------------: | ------------------------------------------- |
|  static getColors | Get HEX or RGB colors                       |
| static getEColors | Get EColors                                 |
|      static parse | Parse HTML color to EColor                  |
|           Methods |                                             |
|             clone | Clone color with adjustments                |
|  getContrastRatio | Get contrast ratio, a value between 0 and 1 |
|     getDeltaValue | Get Delta value (perceptible by human eyes) |
|      getLuminance | Get luminance                               |
|        toHEXColor | To HEX color string                         |
|        toLabValue | To Lab value                                |
|        toRGBColor | To RGB color string                         |

## EventClass

Etsoo implmented abstract Event Class

|      Name | Description                             |
| --------: | --------------------------------------- |
| hasEvents | Has specific type and callback events   |
|       off | Remove specific type and callback event |
|        on | Add event listener                      |
|   trigger | Trigger event                           |

## Keyboard

Keyboard keys and codes

|  Name | Description                  |
| ----: | ---------------------------- |
|  Keys | KeyboardEvent.key constants  |
| Codes | KeyboardEvent.code constants |

|isTypingContent|Is typing content or press command key|

## EHistory

ETSOO Extended abstract history class

|         Name | Description                               |
| -----------: | ----------------------------------------- |
|        index | Current index                             |
|       length | States length                             |
|        state | Current state                             |
|       states | States                                    |
|      Methods |                                           |
|         back | Back to the previous state                |
|        clear | Clear all states but keep event listeners |
|      forward | Forward to the next state                 |
|    getStatus | Get [undo, redo] status                   |
|           go | Go to the specific state                  |
|    pushState | Adds an entry to the history stack        |
| replaceState | Modifies the current history entry        |

## ArrayUtils

Array related utilities

|        Name | Description                                                  |
| ----------: | ------------------------------------------------------------ |
| differences | Array 1 items do not exist in Array 2 or reverse match       |
|         max | Get max number item or number item property                  |
|     maxItem | Get max field value item                                     |
| mergeArrays | Merge arrays, remove duplicates, and sort by the first array |
|         min | Get min number item or number item property                  |
|     minItem | Get min field value item                                     |
|      remove | Remove items by value or condition                           |
|         sum | Sum number items or number item properties                   |
|    toUnique | Make all items are unique                                    |

## DataTypes

Data type definitions and type safe functions. ListItemType, ListItemType1 and ListItemType2 are sugar types.

|                Name | Description                                                            |
| ------------------: | ---------------------------------------------------------------------- |
|            DataType | Data type enum                                                         |
|         addUrlParam | Add parameter to URL                                                   |
|        addUrlParams | Add parameters to URL                                                  |
|               Basic | Basic types, includes number, bigint, Date, boolean, string            |
|          BasicArray | Basic type name array                                                  |
|    BasicConditional | Conditional type based on BasicNames                                   |
|          BasicNames | Basic type and basic type array names array                            |
|       BasicTemplate | Basic type template                                                    |
|   BasicTemplateType | Basic template type                                                    |
|        CombinedEnum | Combined type enum                                                     |
|   CultureDefinition | Culture definition                                                     |
|                  DI | Dynamic interface with multiple properties                             |
|                 DIS | Dynamic interface with single property                                 |
|            EditType | Create edit type from adding type                                      |
|            EnumBase | Enum base type                                                         |
|           EnumValue | Enum value type                                                        |
|        ExtendedEnum | Extended type enum                                                     |
|             Func<R> | Function type, R is return type                                        |
|              HAlign | Horizontal align                                                       |
|          HAlignEnum | Horizontal align enum                                                  |
|       IdDefaultType | Id default type                                                        |
|              IdType | Number and string combination id type                                  |
|              IdItem | Item with id or id generator                                           |
|         IdLabelItem | Item with id and label                                                 |
|         IdLabelType | Item with id and label dynamic type                                    |
|          IdNameItem | Item with id and name                                                  |
|         IdTitleItem | Item with id and title                                                 |
|       KeyCollection | Key collection, like { key1: {}, key2: {} }                            |
|                Keys | Get specific type keys                                                 |
|    LabelDefaultType | Label default type                                                     |
|        MConstructor | Mixins constructor                                                     |
|             ObjType | Generic object type                                                    |
|            Optional | Make properties optional                                               |
|       PlacementEnum | Placement enum                                                         |
|           Placement | Placement type                                                         |
|   RequireAtLeastOne | Require at least one property of the keys                              |
|              Simple | Basic or basic array type                                              |
|          SimpleEnum | Simple type enum                                                       |
|         SimpleNames | Simple type names                                                      |
|        SimpleObject | Simple object, string key, simple type and null value Record           |
|    StringDictionary | String key, string value Record                                        |
|        StringRecord | String key, unknown value Record                                       |
|    TitleDefaultType | Title default type                                                     |
|        TristateEnum | Tristate enum                                                          |
|              VAlign | Vertical align                                                         |
|          VAlignEnum | Vertical align enum                                                    |
|             Methods |                                                                        |
|             convert | Convert value to target type                                           |
|       convertByType | Convert by type name like 'string'                                     |
|       convertSimple | Convert value to target enum type                                      |
|        getBasicName | Get basic type name from Enum type                                     |
| getBasicNameByValue | Get value's basic type name                                            |
|        getEnumByKey | Get enum item from key                                                 |
|      getEnumByValue | Get enum item from value                                               |
|          getEnumKey | Get enum string literal type value                                     |
|         getEnumKeys | Get Enum keys                                                          |
|    getListItemLabel | Get ListType2 item label                                               |
|          getIdValue | Get object id field value                                              |
|         getIdValue1 | Get object id field value 1                                            |
|  getObjectItemLabel | Get object item label                                                  |
|           getResult | Get input function or value result                                     |
|      getStringValue | Get object string field value                                          |
|            getValue | Get object field value                                                 |
|         isBasicName | Check the type is a basic type or not (type guard)                     |
|      isSimpleObject | Is the target a simple object, all values are simple type (Type guard) |
|        isSimpleType | Is the input value simple type, include null and undefined             |
|        jsonReplacer | JSON.stringify replacer with full path                                 |
|       jsonSerialize | JSON serialize with options                                            |

## DateUtils

Dates related utilities

|           Name | Description                                                                                     |
| -------------: | ----------------------------------------------------------------------------------------------- |
|      DayFormat | YYYY-MM-DD                                                                                      |
|   MinuteFormat | YYYY-MM-DD hh:mm                                                                                |
|   SecondFormat | YYYY-MM-DD hh:mm:ss                                                                             |
|        Methods |                                                                                                 |
|        getDays | Get month's days                                                                                |
|          forma | Format dates                                                                                    |
| formatForInput | Format to 'yyyy-MM-dd' or 'yyyy-MM-ddThh:mm:ss, especially used for date input min/max property |
|     jsonParser | JSON parser                                                                                     |
|          parse | Parse string to date                                                                            |
|        sameDay | Two dates are in the same day                                                                   |
|      sameMonth | Two dates are in the same month                                                                 |
|      substract | Date extended method, substract a date                                                          |

## DomUtils

DOM/window related utilities

|                 Name | Description                                                             |
| -------------------: | ----------------------------------------------------------------------- |
|        clearFormData | Clear form data                                                         |
|         CultureMatch | Culture match case Enum                                                 |
|               dataAs | Cast data as template format                                            |
|      detectedCountry | Current detected country                                                |
|      detectedCulture | Current detected culture                                                |
|       dimensionEqual | Check two rectangles equality                                           |
|         downloadFile | Download file from API fetch response body                              |
|                   en | Get English resources definition                                        |
|        fileToDataURL | File to data URL                                                        |
|     formDataToObject | Form data to object                                                     |
|           getCulture | Get the available culture definition                                    |
|       getDataChanges | Get data changed fields (ignored changedFields) with input data updated |
|        getInputValue | Get input value depending on its type                                   |
|       getLocationKey | Get an unique key combined with current URL                             |
|      headersToObject | Convert headers to object                                               |
|           isFormData | Is IFormData type guard                                                 |
|    isJSONContentType | Is JSON content type                                                    |
|       isWechatClient | Is Wechat client                                                        |
|        mergeFormData | Merge form data to primary one                                          |
| mergeURLSearchParams | Merge URL search parameters                                             |
|       parseUserAgent | parseUserAgent                                                          |
|             setFocus | Set HTML element focus by name                                          |
|         setupLogging | Setup frontend logging                                                  |
|     verifyPermission | Verify file system permission                                           |
|               zhHans | Get simplified Chinese resources definition                             |
|               zhHant | Get traditional Chinese resources definition                            |

## ExtendUtils

Extend current class/object functioning

|            Name | Description                                   |
| --------------: | --------------------------------------------- |
|     applyMixins | Apply mixins to current class                 |
| delayedExecutor | Create delayed executor                       |
|     intervalFor | Repeat interval for callback                  |
|  promiseHandler | Promise handler to catch error                |
|           sleep | Delay promise                                 |
|         waitFor | Wait for condition meets and execute callback |

## NumberUtils

Numbers related utilities

|              Name | Description                                           |
| ----------------: | ----------------------------------------------------- |
|            format | Format number                                         |
|    formatFileSize | Format file size                                      |
|       formatMoney | Format money number                                   |
| getCurrencySymbol | Get currency symbol or name from ISO code             |
|             parse | Parse to number, with or without default value        |
|           toExact | To the exact precision number avoiding precision lost |

## StorageUtils

Storage related utilities

|             Name | Description                     |
| ---------------: | ------------------------------- |
|     setLocalData | Set local storage data          |
|   setSessionData | Set session storage data        |
|     getLocalData | Get local storage data          |
|   getLocalObject | Get local storage object data   |
|   getSessionData | Get session storage data        |
| getSessionObject | Get session storage object data |

## Utils

String and other related utilities

|               Name | Description                                                         |
| -----------------: | ------------------------------------------------------------------- |
|       addBlankItem | Add blank item to collection                                        |
|      charsToNumber | Base64 chars to number                                              |
|     containChinese | Check the input string contains Chinese character or not            |
|       correctTypes | Correct object's property value type                                |
|             equals | Two values equal                                                    |
|            exclude | Exclude specific items                                              |
|       excludeAsync | Async exclude specific items                                        |
|      formatInitial | Format inital character to lower case or upper case                 |
|       formatString | Format string with parameters                                       |
|     getDataChanges | Get data changed fields with input data updated                     |
|     getNestedValue | Get nested value from object                                        |
|        getTimeZone | Get time zone                                                       |
|      hasHtmlEntity | Check the input string contains HTML entity or not                  |
|         hasHtmlTag | Check the input string contains HTML tag or not                     |
|           hideData | Hide data                                                           |
|          hideEmail | Hide email data                                                     |
|           isDigits | Is digits string                                                    |
|            isEmail | Is email string                                                     |
|          joinItems | Join items as a string                                              |
|      mergeFormData | Merge form data to primary one                                      |
|       mergeClasses | Merge class names                                                   |
|            newGUID | Create a GUID                                                       |
|      numberToChars | Number to base64 chars                                              |
|        objectEqual | Test two objects are equal or not                                   |
|         objectKeys | Get two object's unqiue properties                                  |
|      objectUpdated | Get the new object's updated fields contrast to the previous object |
|     parseJsonArray | Try to parse JSON input to array                                    |
|          parsePath | Parse path similar with node.js path.parse                          |
|        parseString | Parse string (JSON) to specific type                                |
|  removeEmptyValues | Remove empty values (null, undefined, '') from the input object     |
|   removeNonLetters | Remove non letters (0-9, a-z, A-Z)                                  |
| replaceNullOrEmpty | Replace null or empty with default value                            |
|          setLabels | Set source with new labels                                          |
|     setNestedValue | Set nested value to object                                          |
|    snakeNameToWord | Snake name to works, 'snake_name' to 'Snake Name'                   |
|        sortByFavor | Sort array by favored values                                        |
|   sortByFieldFavor | Sort array by favored field values                                  |
|               trim | Trim chars                                                          |
|            trimEnd | Trim end chars                                                      |
|          trimStart | Trim start chars                                                    |
