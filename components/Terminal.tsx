"use client";

import { useEffect, useRef, useState } from "react";

type Block = {
  prompt: string;
  output: string;
};

export default function Terminal({ blocks }: { blocks: Block[] }) {
  const [blockIndex, setBlockIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion.current) {
      setDone(true);
      return;
    }
  }, []);

  useEffect(() => {
    if (reduceMotion.current || done) return;
    if (blockIndex >= blocks.length) {
      setDone(true);
      return;
    }

    const current = blocks[blockIndex];
    if (charIndex < current.output.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), 18);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setBlockIndex((b) => b + 1);
      setCharIndex(0);
    }, 380);
    return () => clearTimeout(t);
  }, [blockIndex, charIndex, done, blocks]);

  const renderedBlocks = done
    ? blocks
    : blocks.slice(0, blockIndex).concat(
        blockIndex < blocks.length
          ? [
              {
                prompt: blocks[blockIndex].prompt,
                output: blocks[blockIndex].output.slice(0, charIndex),
              },
            ]
          : []
      );

  return (
    <div className="border border-border bg-surface px-4 py-4 sm:px-6 sm:py-6">
      <div className="mb-4 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#4a4a4a]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#4a4a4a]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#4a4a4a]" />
      </div>
      <div className="space-y-3 text-sm leading-relaxed sm:text-base">
        {renderedBlocks.map((b, i) => (
          <div key={i}>
            <p>
              <span className="text-accent2">$</span>{" "}
              <span className="text-muted">{b.prompt}</span>
            </p>
            {b.output.length > 0 && (
              <p className="whitespace-pre-wrap text-fg">{b.output}</p>
            )}
          </div>
        ))}
        <p>
          <span className="text-accent2">$</span>{" "}
          <span className="inline-block h-[1em] w-[0.6ch] translate-y-[0.15em] animate-blink bg-accent align-middle" />
        </p>
      </div>
    </div>
  );
}
