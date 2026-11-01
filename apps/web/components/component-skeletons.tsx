import type { ComponentType } from "react";
import {
  AgentationToolbarSkeleton,
  AnimatedTabsSkeleton,
  CollinsCarouselSkeleton,
  ExpandingGallerySkeleton,
  FlipCardsSkeleton,
  SidebarListSkeleton,
} from "@/components/component-skeletons-live";
import { Bar, Surface } from "@/components/skeleton-primitives";

// For components that don't have a bespoke skeleton yet.
function GenericSkeleton() {
  return (
    <Surface className="w-50 gap-2 p-4">
      <Bar className="w-1/2" />
      <Bar tone="soft" className="w-full" />
      <Bar tone="soft" className="w-3/5" />
    </Surface>
  );
}

const SKELETONS: Record<string, ComponentType> = {
  "agentation-toolbar": AgentationToolbarSkeleton,
  "animated-tabs": AnimatedTabsSkeleton,
  "collins-carousel": CollinsCarouselSkeleton,
  "expanding-gallery": ExpandingGallerySkeleton,
  "flip-cards": FlipCardsSkeleton,
  "sidebar-list": SidebarListSkeleton,
};

export function ComponentSkeleton({ name }: { name: string }) {
  const Skeleton = SKELETONS[name] ?? GenericSkeleton;
  return <Skeleton />;
}
