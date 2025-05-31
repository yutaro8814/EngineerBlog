// src/hooks/useHeadings.ts
import { useEffect, useState } from "react";

export interface Heading {
  id: string;
  text: string;
  level: number;
}

// src/hooks/useHeadings.ts
export const useHeadings = (dep: string | null) => {
    const [headings, setHeadings] = useState<Heading[]>([]);
  
    useEffect(() => {
      const els = Array.from(
        document.querySelectorAll("article h1, article h2, article h3, article h4, article h5, article h6")
      );
      setHeadings(
        els.map(el => ({
          id:    el.id,
          text:  el.textContent || "",
          level: Number(el.tagName.replace("H", "")), // 1〜6
        }))
      );
    }, [dep]);
  
    return headings;
  };
  