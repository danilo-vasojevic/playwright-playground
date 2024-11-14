/* eslint-disable ts/no-unsafe-function-type */
import { test } from './extended-test-fixtures'

export function Step(stepName?: string) {
  return function decorator(target: Function, context: ClassMethodDecoratorContext) {
    return async function replacementMethod(this: any, ...args: any) {
      const name = stepName
        ? replacePlaceholders(stepName, mapPositionalArgs(target, args))
        : parseFunctionName(context.name as string)

      return test.step(name, async () => {
        return await target.call(this, ...args)
      })
    }
  }
}

function mapPositionalArgs(func: Function, args: any[]): Record<string, any> {
  const paramNames = getParamNames(func)
  const argsObject: Record<string, any> = {}
  paramNames.forEach((name, index) => {
    argsObject[name] = args[index]
  })
  return argsObject
}

function getParamNames(func: Function): string[] {
  const funcStr = func.toString()
  const paramList = funcStr.slice(funcStr.indexOf('(') + 1, funcStr.indexOf(')'))
  return paramList
    .split(',')
    .map(param => param.trim())
    .filter(param => param)
}

function parseFunctionName(fnName: string): string {
  return fnName
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, str => str.toUpperCase())
}

function replacePlaceholders(template: string, argsObject: Record<string, any>): string {
  return template.replace(/\{(\w+(\.\w+)*)\}/g, (match, path) => {
    const properties = path.split('.')
    const value = getPropertyValue(argsObject, properties)
    return value !== undefined ? JSON.stringify(value) : match
  })
}

function getPropertyValue(obj: any, propertyPath: string[]): any {
  return propertyPath.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)
}
