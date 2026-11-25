import {
  SiteHeaderClient,
  type SiteHeaderProps,
} from "@/components/site-header-client";

// npm's public downloads API. Cached for a day, so npm is asked at most once a day.
const DOWNLOADS_URL =
  "https://api.npmjs.org/downloads/point/last-month/use-gidl";

async function getMonthlyDownloads(): Promise<number | null> {
  try {
    const response = await fetch(DOWNLOADS_URL, {
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!response.ok) return null;
    const data: { downloads?: unknown } = await response.json();
    return typeof data.downloads === "number" ? data.downloads : null;
  } catch {
    // If npm is down, the header just leaves the count out.
    return null;
  }
}

export async function SiteHeader(props: SiteHeaderProps) {
  const monthlyDownloads = await getMonthlyDownloads();
  return <SiteHeaderClient {...props} monthlyDownloads={monthlyDownloads} />;
}
