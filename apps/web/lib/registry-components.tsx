import {
  AgentationToolbar,
  AnimatedTabs,
  CollinsCarousel,
  FlipCard,
  SidebarList,
} from "@gidl/ui";
import type { ComponentType } from "react";

export const registryComponents: Record<string, ComponentType> = {
  "animated-tabs": AnimatedTabs,
  "collins-carousel": CollinsCarousel,
  "flip-cards": FlipCard,
  "agentation-toolbar": AgentationToolbar,
  "sidebar-list": SidebarList,
};
