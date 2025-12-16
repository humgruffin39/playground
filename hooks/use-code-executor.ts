"use client";

import type { ExecutionResult, Language } from "@/types";
import { useCallback } from "react";
import { transform } from "sucrase";

function transpileTypeScript(code: string): string {
  try {
    const result = transform(code, {
      transforms: ["typescript"],
      disableESTransforms: true,
    });
    return result.code;
  } catch (error) {
    throw new Error(
      `TypeScript Error: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export function useCodeExecutor() {
  const execute = useCallback(
    (code: string, language: Language): ExecutionResult => {
      const output: string[] = [];

      const customConsole = {
        log: (...args: unknown[]) => {
          output.push(args.map((arg) => formatValue(arg)).join(" "));
        },
        error: (...args: unknown[]) => {
          output.push(
            `[Error] ${args.map((arg) => formatValue(arg)).join(" ")}`
          );
        },
        warn: (...args: unknown[]) => {
          output.push(
            `[Warn] ${args.map((arg) => formatValue(arg)).join(" ")}`
          );
        },
        info: (...args: unknown[]) => {
          output.push(
            `[Info] ${args.map((arg) => formatValue(arg)).join(" ")}`
          );
        },
      };

      try {
        let executableCode = code;

        if (language === "typescript") {
          executableCode = transpileTypeScript(code);
        }

        const fn = new Function("console", executableCode);
        fn(customConsole);
        return { output };
      } catch (error) {
        return {
          output,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    },
    []
  );

  return { execute };
}

function formatValue(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return value;
  if (typeof value === "function")
    return `[Function: ${value.name || "anonymous"}]`;
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}
