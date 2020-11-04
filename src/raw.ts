import tsTrimDeclarations from "./index"

/**
 * A TypeScript CustomTransformer that removes declarations with the `@internal` JSDoc tags.
 */
const defaultTsTrimDeclarations = tsTrimDeclarations()

export = defaultTsTrimDeclarations
