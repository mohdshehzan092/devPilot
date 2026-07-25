import { Injectable } from '@nestjs/common';
import * as vm from 'node:vm';

@Injectable()
export class TestScriptService {
  async execute(
  script: string,
  response: any,
  variables: Record<string, string>,
) {
    if (!script) {
      return {
        passed: 0,
        failed: 0,
        results: [],
      };
    }

    const results: any[] = [];

    const sandbox = {
      response: {
        status: response.status,
        body: response.data,
        headers: response.headers,
      },

      expect: (actual: any) => ({
        toBe: (expected: any) => {
          results.push({
            status: actual === expected ? 'PASS' : 'FAIL',
            actual,
            expected,
            matcher: 'toBe',
          });
        },

        toEqual: (expected: any) => {
          const pass =
            JSON.stringify(actual) ===
            JSON.stringify(expected);

          results.push({
            status: pass ? 'PASS' : 'FAIL',
            actual,
            expected,
            matcher: 'toEqual',
          });
        },

        toBeDefined: () => {
          results.push({
            status:
              actual !== undefined
                ? 'PASS'
                : 'FAIL',
            actual,
            matcher: 'toBeDefined',
          });
        },

        toContain: (value: any) => {
          const pass =
            typeof actual === 'string'
              ? actual.includes(value)
              : Array.isArray(actual)
              ? actual.includes(value)
              : false;

          results.push({
            status: pass ? 'PASS' : 'FAIL',
            actual,
            expected: value,
            matcher: 'toContain',
          });
        },

        toBeGreaterThan: (value: number) => {
          results.push({
            status:
              actual > value ? 'PASS' : 'FAIL',
            actual,
            expected: value,
            matcher: 'toBeGreaterThan',
          });
        },

        toBeLessThan: (value: number) => {
          results.push({
            status:
              actual < value ? 'PASS' : 'FAIL',
            actual,
            expected: value,
            matcher: 'toBeLessThan',
          });
        },
      }),

      pm: {
        response: {
          code: response.status,

          json: () => response.data,

          text: () =>
            JSON.stringify(response.data),

          headers: response.headers,
        },
        environment: {
  get: (key: string) => {
    return variables[key];
  },

 set: (key: string, value: any) => {
  variables[key] = value;
},
},

        expect: (actual: any) => ({
          to: {
            eql: (expected: any) => {
              if (actual !== expected) {
                throw new Error(
                  `Expected ${expected} but got ${actual}`,
                );
              }
            },
          },
        }),

        test: (name: string, fn: Function) => {
          try {
            fn();

            results.push({
              name,
              status: 'PASS',
            });
          } catch (error: any) {
            results.push({
              name,
              status: 'FAIL',
              message: error.message,
            });
          }
        },
      },
    };

    try {
      vm.createContext(sandbox);
      vm.runInContext(script, sandbox);
    } catch (error: any) {
      results.push({
        status: 'ERROR',
        message: error.message,
      });
    }

    return {
      passed: results.filter(
        (x) => x.status === 'PASS',
      ).length,

      failed: results.filter(
        (x) => x.status !== 'PASS',
      ).length,

      results,
    };
  }
}