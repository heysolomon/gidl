// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "components/animated-tabs.mdx": () => import("../content/docs/components/animated-tabs.mdx?collection=docs"), "components/collins-carousel.mdx": () => import("../content/docs/components/collins-carousel.mdx?collection=docs"), "components/flip-cards.mdx": () => import("../content/docs/components/flip-cards.mdx?collection=docs"), }),
};
export default browserCollections;