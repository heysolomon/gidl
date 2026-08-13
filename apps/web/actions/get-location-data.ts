"use server";

import path from "node:path";
import { getPlaceholder } from "next-image-placeholder";

export async function getPlaceholderAction(url: string) {
    // Paths starting with "/" are local files served from public/ — resolve
    // them to a real filesystem path so next-image-placeholder reads the
    // file directly instead of treating "/carousel/foo.png" as an (invalid)
    // absolute OS path or trying to fetch it over the network.
    const input = url.startsWith("/")
        ? path.join(process.cwd(), "public", url)
        : url;

    return getPlaceholder(input);
}
