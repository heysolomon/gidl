import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { GidlLogo } from "@/components/logo";
import { DocsThemeSwitch } from "@/components/docs-theme-switch";

import { Icon } from "@iconify/react";

export const baseOptions: BaseLayoutProps = {
  slots: {
    themeSwitch: DocsThemeSwitch,
  },
  nav: {
    title: (
      <div className="flex items-center gap-2">
        <GidlLogo size={18} />
        <span className="text-base font-semibold tracking-tight">gidl</span>
      </div>
    ),
  },
  links: [
    {
      type: "icon",
      text: "X / Twitter",
      label: "X / Twitter",
      icon: <Icon icon="ri:twitter-x-line" className="w-[18px] h-[18px]" />,
      url: "https://x.com",
      external: true,
    },
    {
      type: "icon",
      text: "GitHub",
      label: "GitHub",
      icon: <Icon icon="iconoir:github" className="w-[18px] h-[18px]" />,
      url: "https://github.com/heysolomon/gidl",
      external: true,
    },
  ],
};
