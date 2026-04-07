// @ts-nocheck
import { default as __fd_glob_5 } from "../content/docs/components/meta.json?collection=meta"
import { default as __fd_glob_4 } from "../content/docs/meta.json?collection=meta"
import * as __fd_glob_3 from "../content/docs/components/flip-cards.mdx?collection=docs"
import * as __fd_glob_2 from "../content/docs/components/collins-carousel.mdx?collection=docs"
import * as __fd_glob_1 from "../content/docs/components/animated-tabs.mdx?collection=docs"
import * as __fd_glob_0 from "../content/docs/index.mdx?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.doc("docs", "content/docs", {"index.mdx": __fd_glob_0, "components/animated-tabs.mdx": __fd_glob_1, "components/collins-carousel.mdx": __fd_glob_2, "components/flip-cards.mdx": __fd_glob_3, });

export const meta = await create.meta("meta", "content/docs", {"meta.json": __fd_glob_4, "components/meta.json": __fd_glob_5, });