import { SiteHeader } from "@/components/site-header";

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <SiteHeader />
      {children}
    </div>
  );
}
