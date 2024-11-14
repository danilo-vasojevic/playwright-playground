import { test } from './extended-test-fixtures'

export function Step(stepName?: string) {
  // eslint-disable-next-line ts/no-unsafe-function-type
  return function decorator(target: Function, context: ClassMethodDecoratorContext) {
    return async function replacementMethod(this: any, ...args: any) {
      const name = stepName
        ? replacePlaceholders(stepName, args) // Replaces placeholders in stepName
        : parseFunctionName(context.name as string) // Turns function name into test step

      return test.step(name, async () => {
        return await target.call(this, ...args)
      })
    }
  }
}

function parseFunctionName(fnName: string): string {
  return fnName
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, str => str.toUpperCase())
}

function replacePlaceholders(template: string, args: any[]): string {
  return template.replace(/\{(\d+)(\.[\w.]+)?\}/g, (match, indexStr, propertyPath) => {
    const argIndex = Number.parseInt(indexStr, 10) // Get the argument index
    const properties = propertyPath ? propertyPath.slice(1).split('.') : [] // Remove leading dot and split path

    // Get the value by traversing the property path within the specified argument
    const value = getPropertyValue(args[argIndex], properties)
    return value !== undefined ? JSON.stringify(value) : match
  })
}

function getPropertyValue(obj: any, propertyPath: string[]): any {
  return propertyPath.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)
}
