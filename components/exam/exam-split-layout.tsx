import type { ReactNode } from "react";

interface ExamSplitLayoutProps {
  left: ReactNode;
  right: ReactNode;
  footer?: ReactNode;
}

/** Official CBT split screen: source document on the left, question on the right. */
export function ExamSplitLayout({ left, right, footer }: ExamSplitLayoutProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid min-h-0 flex-1 grid-cols-1 divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        <section aria-label="Document" className="min-h-0 overflow-y-auto bg-slate-100/90 dark:bg-muted/20 p-6">
          {left}
        </section>
        <section aria-label="Question" className="min-h-0 overflow-y-auto p-6">
          {right}
        </section>
      </div>
      {footer}
    </div>
  );
}
