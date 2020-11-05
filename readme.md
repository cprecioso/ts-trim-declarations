# ts-trim-declarations

Custom transformer for [TypeScript](https://www.typescriptlang.org/) that
removes type declarations with `/** @internal */` JSDoc comments (or whatever
other tags you specify!). Inspired by
[`@microsoft/api-extractor`](https://api-extractor.com/).

Custom transformers can't be (yet) used with plain typescript, you're encouraged
to use [`ttypescript`](https://github.com/cevek/ttypescript), or plugins to your
build tool of choice, especially
[`@wessberg/rollup-plugin-ts`](https://github.com/wessberg/rollup-plugin-ts).
For other build tools, refer to their documentation on how to use TypeScript
Custom Transformers.

## Effect

It will remove the declarions tagged with the specified JSDoc comments
(`/** @internal */` by default) from the `.d.ts` file output, so they will
**not** be documented. Users of your library trying to use these methods,
properties, exports, etc. will get a typechecking error, and automated
documentation generators like
[`@microsoft/api-documenter`](https://github.com/microsoft/rushstack/tree/master/apps/api-documenter)
will not export their typings.

For example, this `source.ts`:

```patch
 class MyClass {
+  /** @internal */
   protected _foo() {
     return "very internal string"
   }

   bar() {
     const publicString = this._foo().toUpperCase()
     // Now it's ready for public usage!
     return publicString
   }
 }
```

will output the following `source.d.ts`:

```patch
 declare class MyClass {
-  protected _foo(): string
   bar(): string
 }
```

## Installation

```sh
$ yarn add --dev ts-trim-declarations
```

or

```sh
$ npm install --save-dev ts-trim-declarations
```

then add the Custom Transformer to your build tool's configuration

### `ttypescript`

Add this field to your `tsconfig.json` (only works from Node.js 12.7 onwards):

```patch
 {
   // ..
   "compilerOptions": {
     "plugins": [
        // ...
+       { "transform": "ts-trim-declarations/raw", "type": "raw" }
     ]
   }
 }
```

### `rollup` and `@wessberg/rollup-plugin-ts`

Add this plugin to the object exported from `rollup.config.js`:

```patch
// ...
 import ts from "@wessberg/rollup-plugin-ts"
+import tsTrimDeclarations from "ts-trim-declarations"

 export default {
   // ...
   plugins: [
     // ...
     ts({
       // ...
       transpiler: "typescript",
       transformers: [
         // ...
+        tsTrimDeclarations(),
       ],
     }),
   ],
 }
```

### TypeScript API

Check out this
[TypeScript's issue](https://github.com/Microsoft/TypeScript/pull/13940) to
learn about their API.

### Other build tools

Please refer to your build tool's documentation for information on hwo to use
TypeScript Custom Transformers

## Options

Importing `ts-trim-declarations` will give you a function you can call with an
array of JSDoc tags to remove. The default is `["internal"]`-

```js
import tsTrimDeclarations from "ts-trim-declarations"
// ...
tsTrimDeclarations(isBeta ? ["internal"] : ["internal", "beta"])
// Will remove all declarations with `/** @internal */, but will only remove
// the `/** @beta */` declarations when `isBeta === true`.
```

The `ts-trim-declarations/raw` import will forgo the function call and give you
a straight Custom Transformer that removes only `/** @internal */` tags.
