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

## DataTypes
Data type definitions and type safe functions

|Name|Description|
|---:|---|
|DataType|Data type enum|
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
|HAlign|Horizontal align|
|HAlignEnum|Horizontal align enum|
|IdType|Number and string combination id type|
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
|getEnumKey|get enum string literal type value|
|getEnumKeys|Get Enum keys|
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
|forma|Format dates|
|jsonParser|JSON parser|
|parse|Parse string to date|

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
|saveCountry|Save country name|
|saveCulture|Save culture name|
|setFocus|Set HTML element focus by name|

## ExtendUtils
Extend current class/object functioning

|Name|Description|
|---:|---|
|applyMixins|Apply mixins to current class|
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
|getSessionData|Get session storage data|

## Utils
String and other related utilities

|Name|Description|
|---:|---|
|formatLowerLetter|Format word's first letter to lower case|
|formatUpperLetter|Format word's first letter to upper case|
|getDataChanges|Get data changed fields with input data updated|
|getTimeZone|Get time zone|
|joinItems|Join items as a string|
|mergeFormData|Merge form data to primary one|
|mergeClasses|Merge class names|
|newGUID|Create a GUID|
|objectEqual|Test two objects are equal or not|
|parseString|Parse string (JSON) to specific type|
|setLabels|Set source with new labels|
|snakeNameToWord|Snake name to works, 'snake_name' to 'Snake Name'|