import { test } from './extended-test-fixtures'

export function Step(stepName?: string) {
  // eslint-disable-next-line ts/no-unsafe-function-type
  return function decorator(target: Function, context: ClassMethodDecoratorContext) {
    return async function replacementMethod(this: any, ...args: any) {
      const name = stepName
        ? replacePlaceholders(stepName, args)
        : parseFunctionName(context.name as string)

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
  return template.replace(/\{(\d+)\}/g, (match, index) => {
    const argIndex = Number.parseInt(index, 10) - 1
    return args[argIndex] !== undefined ? JSON.stringify(args[argIndex]) : match
  })
}
