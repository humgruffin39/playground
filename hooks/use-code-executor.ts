"use client";

import type { ExecutionResult, Language } from "@/types";
import { useCallback, useRef, useEffect } from "react";
import { transform } from "sucrase";

const EXECUTION_TIMEOUT = 2000;
const MAX_OUTPUT_LINES = 500;

let globalWorker: Worker | null = null;
let workerBlobUrl: string | null = null;

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

function detectDangerousPatterns(code: string): string | null {
  const commentRemoved = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
  const normalized = commentRemoved.replace(/\s+/g, " ");

  const infiniteLoopPatterns = [
    /\bwhile\s*\(\s*true\s*\)/i,
    /\bwhile\s*\(\s*1\s*\)/i,
    /\bwhile\s*\(\s*!0\s*\)/i,
    /\bwhile\s*\(\s*!false\s*\)/i,
    /\bfor\s*\(\s*;\s*;\s*\)/i,
    /\bfor\s*\(\s*[^;]*;\s*;\s*[^)]*\)/i,
  ];

  for (const pattern of infiniteLoopPatterns) {
    if (pattern.test(normalized)) {
      return "Infinite loop detected: Dangerous loop pattern is not allowed";
    }
  }

  const largeArrayPatterns = [
    /\bnew\s+Array\s*\(\s*\d{6,}/i,
    /\bnew\s+Array\s*\(\s*1e\d+/i,
    /\bArray\s*\(\s*\d{6,}/i,
    /\bArray\s*\(\s*1e\d+/i,
    /\[\s*\d{6,}\s*\]/,
  ];

  for (const pattern of largeArrayPatterns) {
    if (pattern.test(normalized)) {
      return "Large array allocation detected: Arrays larger than 100,000 elements are not allowed";
    }
  }

  if (/\bsetInterval\s*\(/gi.test(normalized)) {
    return "setInterval is not allowed";
  }

  if (/\beval\s*\(/gi.test(normalized)) {
    return "eval() is not allowed";
  }

  return null;
}

function createWorker(): Worker | null {
  if (typeof Worker === "undefined") {
    return null;
  }

  if (globalWorker) {
    return globalWorker;
  }

  try {
    const T = EXECUTION_TIMEOUT;
    const M = MAX_OUTPUT_LINES;
    const workerCode = `
const T=${T},M=${M};
function f(v){
  if(v===null)return"null";
  if(v===undefined)return"undefined";
  if(typeof v==="string")return v;
  if(typeof v==="function")return\`[Function:\${v.name||"anonymous"}]\`;
  if(Array.isArray(v)){
    if(v.length>100)return\`[Array(\${v.length})]\`;
    try{return JSON.stringify(v)}catch{return\`[Array(\${v.length})]\`}
  }
  if(typeof v==="object"){
    try{
      const s=JSON.stringify(v,null,2);
      return s.length>5000?"[Object(too large)]":s
    }catch{return String(v)}
  }
  return String(v)
}
self.onmessage=function(e){
  const{code:c,id:i}=e.data;
  const o=[];
  let n=0,t=null;
  const x=()=>{if(t){clearTimeout(t);t=null}};
  const C={
    log:(...a)=>{if(n<M){try{o.push(a.map(f).join(" "));n++;if(n>=M)o.push(\`[Output limit:\${M}lines]\`)}catch{}}},
    error:(...a)=>{if(n<M){try{o.push(\`[Error]\${a.map(f).join(" ")}\`);n++;if(n>=M)o.push(\`[Output limit:\${M}lines]\`)}catch{}}},
    warn:(...a)=>{if(n<M){try{o.push(\`[Warn]\${a.map(f).join(" ")}\`);n++;if(n>=M)o.push(\`[Output limit:\${M}lines]\`)}catch{}}},
    info:(...a)=>{if(n<M){try{o.push(\`[Info]\${a.map(f).join(" ")}\`);n++;if(n>=M)o.push(\`[Output limit:\${M}lines]\`)}catch{}}}
  };
  t=setTimeout(()=>{x();self.postMessage({id:i,result:{output:o,error:\`Execution timeout:exceeded \${T}ms\`}})},T);
  try{
    const fn=new Function("console",c);
    fn(C);
    x();
    self.postMessage({id:i,result:{output:o}})
  }catch(e){
    x();
    self.postMessage({id:i,result:{output:o,error:e instanceof Error?e.message:String(e)}})
  }
};`;

    const blob = new Blob([workerCode], { type: "application/javascript" });
    workerBlobUrl = URL.createObjectURL(blob);
    globalWorker = new Worker(workerBlobUrl);
    return globalWorker;
  } catch (error) {
    return null;
  }
}

export function useCodeExecutor() {
  const pendingRef = useRef<Map<number, (result: ExecutionResult) => void>>(new Map());
  const idCounterRef = useRef(0);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = createWorker();
    const worker = workerRef.current;

    if (!worker) return;

    worker.onmessage = (e) => {
      const { id, result } = e.data;
      const callback = pendingRef.current.get(id);
      if (callback) {
        callback(result);
        pendingRef.current.delete(id);
      }
    };

    worker.onerror = () => {
      const pendingIds = Array.from(pendingRef.current.keys());
      pendingIds.forEach((id) => {
        const callback = pendingRef.current.get(id);
        if (callback) {
          callback({ output: [], error: "Worker execution error" });
        }
      });
      pendingRef.current.clear();
    };

    return () => {
      pendingRef.current.clear();
    };
  }, []);

  const execute = useCallback(
    (code: string, language: Language): Promise<ExecutionResult> => {
      return new Promise((resolve) => {
        try {
          let executableCode = code;

          if (language === "typescript") {
            try {
              executableCode = transpileTypeScript(code);
            } catch (error) {
              resolve({
                output: [],
                error: error instanceof Error ? error.message : String(error),
              });
              return;
            }
          }

          const dangerCheck = detectDangerousPatterns(executableCode);
          if (dangerCheck) {
            resolve({
              output: [],
              error: dangerCheck,
            });
            return;
          }

          if (!workerRef.current) {
            resolve({
              output: [],
              error: "Web Workers are not supported",
            });
            return;
          }

          const id = idCounterRef.current++;
          const timeout = setTimeout(() => {
            if (pendingRef.current.has(id)) {
              pendingRef.current.delete(id);
              resolve({
                output: [],
                error: `Execution timeout: No response within ${EXECUTION_TIMEOUT + 500}ms`,
              });
            }
          }, EXECUTION_TIMEOUT + 500);

          const wrappedResolve = (result: ExecutionResult) => {
            clearTimeout(timeout);
            resolve(result);
          };

          pendingRef.current.set(id, wrappedResolve);

          try {
            workerRef.current.postMessage({ code: executableCode, id });
          } catch (error) {
            pendingRef.current.delete(id);
            clearTimeout(timeout);
            resolve({
              output: [],
              error: `Failed to send message: ${error instanceof Error ? error.message : String(error)}`,
            });
          }
        } catch (error) {
          resolve({
            output: [],
            error: error instanceof Error ? error.message : String(error),
          });
        }
      });
    },
    []
  );

  return { execute };
}
