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
|DisplayType|Frontend display type|
|DynamicData|String key, any value type dictionary|
|IdType|Number and string combination id type|
|ReadonlyData|Readonly DynamicData|
|BaseType|Base types|
|BaseCType|Base and collection types|
|SimpleBaseType|bigint, boolean, Date, number, string, symbol|
|SimpleType|SimpleBaseType, SimpleBaseType[], null, undefined|
|HAlign|left, center, right|
|HAlignEnum|Left=1, Center=2, Right=3|
|hAlignFromEnum|Enum align to string literal align|
|VAlign|top, center, bottom|
|VAlignEnum|Top=1, Center=2, Bottom=3|
|isBaseType|Check value is BaseCType|
|isSimpleType|Check value is SimpleType|
|SimpleObject|String key, SimpleType value dictionary|
|isSimpleObject|Check value is SimpleObject|
|StringDictionary|String key and value dictionary|
|ReadonlyStringDictionary|Readonly StringDictionary|
|Country|Country definition|
|CultureDefinition|Culture definition|

## DomUtils
DOM/window related utilities

|Name|Description|
|---:|---|
|detectedCountry|Current detected country|
|detectedCulture|Current detected culture|
|dimensionEqual|Check two rectangles equality|
|getCulture|Get the available culture definition|
|getCountry|Get the available country definition|
|getLocationKey|Get an unique key combined with current URL|
|formDataToObject|Convert FormData to object|
|headersToObject|Convert headers to object|
|isJSONContentType|Is JSON content type|
|mergeClasses|Merge class names|
|mergeURLSearchParams|Merge URL search parameters|
|saveCountry|Save country name|
|saveCulture|Save culture name|

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
|formatUpperLetter|Format word's first letter to upper case|
|joinItems|Join items as a string|
|newGUID|Create a GUID|
|parseString|Parse string (JSON) to specific type|
|snakeNameToWord|Snake name to works, 'snake_name' to 'Snake Name'|