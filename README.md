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

## storage
Storage interface and browser storage implementation

## EColor
Etsoo implmented Color

|Name|Description|
|---:|---|
|static getColors|Get HEX or RGB colors|
|static getEColors|Get EColors|
|static parse|Parse HTML color to EColor|
|clone|Clone color with adjustments|
|getContrastRatio|Get contrast ratio, a value between 0 and 1|
|getDeltaValue|Get Delta value (perceptible by human eyes)|
|getLuminance|Get luminance|
|toHEXColor|To HEX color string|
|toLabValue|To Lab value|
|toRGBColor|To RGB color string|

## Keyboard
Keyboard keys and codes

|Name|Description|
|---:|---|
|Keys|KeyboardEvent.key constants|
|Codes|KeyboardEvent.code constants|

|isTypingContent|Is typing content or press command key|

## DataTypes
Data type definitions and type safe functions

|Name|Description|
|---:|---|
|DataType|Data type enum|
|AddOrEditType|Add or edit conditional type for same data model|
|Basic|Basic types, includes number, bigint, Date, boolean, string|
|BasicArray|Basic type name array|
|BasicConditional|Conditional type based on BasicNames|
|BasicNames|Basic type and basic type array names array|
|BasicTemplate|Basic type template|
|BasicTemplateType|Basic template type|
|CombinedEnum|Combined type enum|
|CultureDefinition|Culture definition|
|EnumBase|Enum base type|
|EnumValue|Enum value type|
|ExtendedEnum|Extended type enum|
|Func<R>|Function type, R is return type|
|HAlign|Horizontal align|
|HAlignEnum|Horizontal align enum|
|IdType|Number and string combination id type|
|IdItem|Item with id or id generator|
|IdLabelItem|Item with id and label|
|Simple|Basic or basic array type|
|SimpleEnum|Simple type enum|
|SimpleNames|Simple type names|
|SimpleObject|Simple object, string key, simple type and null value Record|
|StringDictionary|String key, string value Record|
|StringRecord|String key, unknown value Record|
|VAlign|Vertical align|
|VAlignEnum|Vertical align enum|

|convert|Convert value to target type|
|convertByType|Convert by type name like 'string'|
|convertSimple|Convert value to target enum type|
|getBasicName|Get basic type name from Enum type|
|getBasicNameByValue|Get value's basic type name|
|getEnumByKey|Get enum item from key|
|getEnumByValue|Get enum item from value|
|getEnumKey|Get enum string literal type value|
|getEnumKeys|Get Enum keys|
|getIdValue|Get object id field value|
|getItemId|Get item id|
|getItemLabel|Get item label|
|getResult|Get input function or value result|
|getStringValue|Get object string field value|
|isBasicName|Check the type is a basic type or not (type guard)|
|isSimpleObject|Is the target a simple object, all values are simple type (Type guard)|
|isSimpleType|Is the input value simple type, include null and undefined|


## DateUtils
Dates related utilities

|Name|Description|
|---:|---|
|DayFormat|YYYY-MM-DD|
|MinuteFormat|YYYY-MM-DD hh:mm|
|SecondFormat|YYYY-MM-DD hh:mm:ss|

|getDays|Get month's days|
|forma|Format dates|
|jsonParser|JSON parser|
|parse|Parse string to date|
|substract|Date extended method, substract a date|

## DomUtils
DOM/window related utilities

|Name|Description|
|---:|---|
|clearFormData|Clear form data|
|dataAs|Cast data to target type|
|detectedCountry|Current detected country|
|detectedCulture|Current detected culture|
|dimensionEqual|Check two rectangles equality|
|formDataToObject|Form data to object|
|getCulture|Get the available culture definition|
|getDataChanges|Get data changed fields with input data updated|
|getLocationKey|Get an unique key combined with current URL|
|headersToObject|Convert headers to object|
|isFormData|Is IFormData type guard|
|isJSONContentType|Is JSON content type|
|mergeFormData|Merge form data to primary one|
|mergeURLSearchParams|Merge URL search parameters|
|setFocus|Set HTML element focus by name|

## ExtendUtils
Extend current class/object functioning

|Name|Description|
|---:|---|
|applyMixins|Apply mixins to current class|
|delayedExecutor|Create delayed executor|
|promiseHandler|Promise handler to catch error|
|sleep|Delay promise|

## NumberUtils
Numbers related utilities

|Name|Description|
|---:|---|
|format|Format number|
|formatMoney|Format money number|
|parse|Parse float value|

## StorageUtils
Storage related utilities

|Name|Description|
|---:|---|
|setLocalData|Set local storage data|
|setSessionData|Set session storage data|
|getLocalData|Get local storage data|
|getLocalObject|Get local storage object data|
|getSessionData|Get session storage data|
|getSessionObject|Get session storage object data|

## Utils
String and other related utilities

|Name|Description|
|---:|---|
|addBlankItem|Add blank item to collection|
|charsToNumber|Base64 chars to number|
|correctTypes|Correct object's property value type|
|equals|Two values equal|
|formatInitial|Format inital character to lower case or upper case|
|formatString|Format string with parameters|
|getDataChanges|Get data changed fields with input data updated|
|getTimeZone|Get time zone|
|hideData|Hide data|
|hideEmail|Hide email data|
|isDigits|Is digits string|
|isEmail|Is email string|
|joinItems|Join items as a string|
|mergeFormData|Merge form data to primary one|
|mergeClasses|Merge class names|
|newGUID|Create a GUID|
|numberToChars|Number to base64 chars|
|objectEqual|Test two objects are equal or not|
|objectKeys|Get two object's unqiue properties|
|objectUpdated|Get the new object's updated fields contrast to the previous object|
|parseString|Parse string (JSON) to specific type|
|removeNonLetters|Remove non letters (0-9, a-z, A-Z)|
|replaceNullOrEmpty|Replace null or empty with default value|
|setLabels|Set source with new labels|
|snakeNameToWord|Snake name to works, 'snake_name' to 'Snake Name'|