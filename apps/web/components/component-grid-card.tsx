import Link from "next/link";
import { Pill } from "@/components/pill";
import { ComponentSkeleton } from "@/components/component-skeletons";

interface ComponentGridCardProps {
  name: string;
  title: string;
  description?: string;
  isNew?: boolean;
  isDraft?: boolean;
}

// Registry descriptions carry markdown credit links; the whole card is already
// a link, so show just the link text here.
function stripMarkdownLinks(text: string) {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

// An outer frame holding the header, a faint second ring outside it, and an inner panel
// that bleeds over the frame's border (-m-px) and is clipped 1px in on the
// sides/bottom so the frame's own border shows there instead. The ring's outer
// edge is 4px out from the frame's, so its radius is the frame's plus 4px, which
// keeps the corners concentric. Must sit inside an `isolate` container so the
// outer ring's -z-1 stays above the page background.
export function ComponentGridCard({
  name,
  title,
  description,
  isNew,
  isDraft,
}: ComponentGridCardProps) {
  return (
    <div
      data-slot="card-frame"
      className="group/card relative flex w-full flex-col rounded-2xl border border-border bg-neutral-50 after:pointer-events-none after:absolute after:-inset-[5px] after:-z-1 after:rounded-[calc(var(--radius-2xl)+4px)] after:border after:border-border/60 dark:bg-neutral-900"
    >
      <div className="relative grid auto-rows-min grid-rows-[auto_1fr] items-start gap-1 px-6 py-4">
        <h2 className="flex items-center gap-2 self-center text-[15px] font-bold">
          <Link
            href={`/docs/components/${name}`}
            className="before:absolute before:inset-0 before:z-10 before:rounded-2xl"
          >
            {title}
          </Link>
          {isNew && <Pill variant="new">New</Pill>}
          {isDraft && <Pill variant="draft">Draft</Pill>}
        </h2>
        <p className="line-clamp-2 self-center text-[13px] text-muted-foreground sm:h-[2lh]">
          {description ? stripMarkdownLinks(description) : null}
        </p>
      </div>
      <div className="pointer-events-none relative -m-px flex min-h-55 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-background bg-clip-padding [clip-path:inset(-1rem_1px_1px_1px_round_calc(var(--radius-2xl)-1px))]">
        <div className="flex flex-1 items-center justify-center p-6 px-8">
          <div className="flex w-full justify-center">
            <ComponentSkeleton name={name} />
          </div>
        </div>
      </div>
    </div>
  );
}
