"use client";

import type { Language } from "@/types";
import { useCallback, useEffect, useState } from "react";

const DEFAULT_CODE: Record<Language, string> = {
  javascript: `const greet = (name) => \`Hello, \${name}!\`;

console.log(greet("World"));

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

const fibonacci = (n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

console.log("Fibonacci(10):", fibonacci(10));`,
  typescript: `interface User {
  name: string;
  age: number;
}

const createUser = (name: string, age: number): User => ({ name, age });

const user = createUser("TypeScript", 12);
console.log(\`\${user.name} is \${user.age} years old\`);

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

const ok = <T>(data: T): Result<T> => ({ ok: true, data });

console.log("Result:", ok({ id: 1 }));`,
};

function decodeCode(encoded: string): string {
  try {
    const binary = atob(encoded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    try {
      return decodeURIComponent(encoded);
    } catch {
      return encoded;
    }
  }
}

function parseUrlParams(): { lang?: Language; code?: string } | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const lang = params.get("lang");
  const code = params.get("code");
  if (!lang && !code) return null;
  return {
    lang: lang === "typescript" || lang === "javascript" ? lang : undefined,
    code: code ? decodeCode(code) : undefined,
  };
}

function loadFromStorage(): {
  lang: Language;
  codes: Record<Language, string>;
} {
  const defaultResult = { lang: "javascript" as Language, codes: DEFAULT_CODE };
  if (typeof window === "undefined") return defaultResult;

  try {
    const urlParams = parseUrlParams();
    if (urlParams && (urlParams.lang || urlParams.code)) {
      const lang = urlParams.lang || "javascript";
      const codes = { ...DEFAULT_CODE };
      if (urlParams.code) {
        codes[urlParams.lang || "javascript"] = urlParams.code;
      }
      window.history.replaceState({}, "", window.location.pathname);
      return { lang, codes };
    }

    const storedLang = localStorage.getItem("pg-lang") as Language | null;
    const storedCodes = localStorage.getItem("pg-codes");
    return {
      lang: storedLang || "javascript",
      codes: storedCodes
        ? { ...DEFAULT_CODE, ...JSON.parse(storedCodes) }
        : DEFAULT_CODE,
    };
  } catch {
    return defaultResult;
  }
}

export function usePersistedCode() {
  const [state, setState] = useState(() => loadFromStorage());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial sync with localStorage/URL
    setState(loadFromStorage());
  }, []);

  const updateLanguage = useCallback((lang: Language) => {
    setState((prev) => ({ ...prev, lang }));
    localStorage.setItem("pg-lang", lang);
  }, []);

  const updateCode = useCallback((lang: Language, code: string) => {
    setState((prev) => {
      const newCodes = { ...prev.codes, [lang]: code };
      localStorage.setItem("pg-codes", JSON.stringify(newCodes));
      return { ...prev, codes: newCodes };
    });
  }, []);

  return {
    language: state.lang,
    codes: state.codes,
    updateLanguage,
    updateCode,
    urlLoaded: true,
  };
}

