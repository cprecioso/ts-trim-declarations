import ts from "typescript"

/**
 * Creates a TypeScript CustomTransformer that removes declarations with the given JSDoc tags.
 *
 * @param trimmedTags Declarations with these tags will be removed from the declaration files. The default is `["internal"]`.
 */
const tsTrimDeclarations = (
  trimmedTags = ["internal"] as readonly string[]
): ts.CustomTransformers => ({
  afterDeclarations: [
    (ctx) => {
      const visitor: ts.Visitor = (node) => {
        const jsDocContainer = ((node as any).jsDoc as ts.JSDoc[]) ?? []

        for (const jsDoc of jsDocContainer) {
          for (const tag of jsDoc.tags ?? []) {
            const id = tag.tagName.text
            if (trimmedTags.includes(id)) {
              return []
            }
          }
        }

        return ts.visitEachChild(node, visitor, ctx)
      }

      return (node) => ts.visitNode(node, visitor)
    },
  ],
})

export = tsTrimDeclarations
