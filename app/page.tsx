"use client";

import { motion } from "framer-motion";
import {
  useWidgetProps,
  useMaxHeight,
  useDisplayMode,
  useRequestDisplayMode,
  useIsChatGptApp,
} from "./hooks";

type Notebook = {
  id: number;
  name: string;
  date: string;
};

export default function Home() {
  const toolOutput = useWidgetProps<{ structuredContent?: { notebooks?: Notebook[] } }>();

  const notebooks =
    toolOutput?.structuredContent?.notebooks ?? [
      { id: 1, name: "🧠 AI Research Notes", date: "Nov 3, 2025" },
      { id: 2, name: "🎨 UX Design Experiments", date: "Oct 25, 2025" },
      { id: 3, name: "📈 Product Strategy Draft", date: "Oct 14, 2025" },
      { id: 4, name: "🧾 Meeting Summary Logs", date: "Sep 30, 2025" },
    ];

  const maxHeight = useMaxHeight() ?? undefined;
  const displayMode = useDisplayMode();
  const requestDisplayMode = useRequestDisplayMode();
  const isChatGptApp = useIsChatGptApp();

  return (
    <div
      className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-6 sm:p-10"
      style={{
        maxHeight,
        height: displayMode === "fullscreen" ? maxHeight : undefined,
      }}
    >
      {displayMode !== "fullscreen" && (
        <button
          aria-label="Enter fullscreen"
          className="fixed top-4 right-4 z-50 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-lg ring-1 ring-slate-900/10 dark:ring-white/10 p-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          onClick={() => requestDisplayMode("fullscreen")}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
            />
          </svg>
        </button>
      )}

      <main className="flex flex-col gap-6 row-start-2 w-full max-w-4xl">
        <h1 className="text-2xl font-semibold text-slate-400 dark:text-slate-100">
          My Notebooks
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notebooks.map((notebook: Notebook, index: number) => (
            <motion.div
              key={notebook.id}
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-800"
            >
              <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
                {notebook.name}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Last updated: {notebook.date}
              </p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
