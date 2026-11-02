// The address the site is actually served from. gidl.dev redirects here, and
// crawlers such as X's can give up on a redirect, so links and images in page
// metadata should never point at the bare domain.
export const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://www.gidl.dev";
