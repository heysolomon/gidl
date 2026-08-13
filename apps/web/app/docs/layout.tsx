import type { CSSProperties } from "react";
import { SiteHeader } from "@/components/site-header";
import { DocsSidebar } from "@/components/docs-sidebar";
import { CommandMenu } from "@/components/command-menu";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { getAllRegistryItems } from "@/lib/registry";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const items = getAllRegistryItems()
    .map((item) => ({ name: item.name, title: item.title }))
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div
      style={{ "--header-height": "4.25rem" } as CSSProperties}
      className="min-h-screen bg-background text-foreground"
    >
      <div className="sticky top-0 z-40">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-background/90 backdrop-blur header-fade-mask"
        />
        <SiteHeader containerClassName="" showWordmark={false}>
          <CommandMenu items={items} />
        </SiteHeader>
      </div>
      <SidebarProvider className="min-h-[calc(100svh-var(--header-height))] items-start">
        <DocsSidebar items={items} />
        <SidebarInset>
          <div className="flex items-center gap-2 px-6 py-3 lg:hidden">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <span className="text-[12.5px] text-muted-foreground">Menu</span>
          </div>
          <div className="max-w-7xl mx-auto w-full px-6 pt-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
