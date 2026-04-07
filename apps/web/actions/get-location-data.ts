"use server";

import { getPlaceholder } from "next-image-placeholder";

export type LocationData = {
    id: string;
    label: string;
    rank: string;
    title: string;
    description: string;
    image: string;
    blurDataURL?: string;
};

export async function getPlaceholderAction(url: string) {
    return getPlaceholder(url);
}
