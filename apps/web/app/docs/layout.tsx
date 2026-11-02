import type { CSSProperties } from "react";
import { SiteHeader } from "@/components/site-header";
import { DocsSidebar } from "@/components/docs-sidebar";
import { CommandMenu } from "@/components/command-menu";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getDocsNavItems } from "@/lib/registry-meta";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const items = getDocsNavItems();

  return (
    <SidebarProvider
      style={{ "--header-height": "4.25rem" } as CSSProperties}
      className="min-h-screen flex-col bg-background text-foreground"
    >
      <div className="sticky top-0 z-40">
        <div aria-hidden className="header-blur">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <SiteHeader
          containerClassName=""
          showWordmark={false}
          leading={<SidebarTrigger className="-ml-1.5 lg:hidden" />}
        >
          <CommandMenu items={items} />
        </SiteHeader>
      </div>
      <div className="flex min-h-[calc(100svh-var(--header-height))] w-full items-start">
        <DocsSidebar items={items} />
        <SidebarInset>
          <div className="max-w-7xl mx-auto w-full px-6 pt-6">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
