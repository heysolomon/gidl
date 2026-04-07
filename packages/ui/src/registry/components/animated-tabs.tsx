"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Tabs, TabsList } from "@/components/ui/tabs";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../lib/utils";
import { PlaceholderImage } from "next-image-placeholder/react";
import { getPlaceholderAction } from "@/actions/get-location-data";

const locations = [
    {
        id: "coastal",
        label: "Coastal",
        rank: "01",
        title: "Serene Waters",
        description: "Drift along tranquil coastal waters where wooden boats rest peacefully.",
        image: "https://images.unsplash.com/photo-1484402628941-0bb40fc029e7?w=800&auto=format&fit=crop&q=60",
    },
    {
        id: "alpine",
        label: "Alpine",
        rank: "02",
        title: "Mountain Majesty",
        description: "Towering peaks pierce the clouds in dramatic alpine landscapes.",
        image: "https://images.unsplash.com/photo-1682685797229-b2930538da47?w=900&auto=format&fit=crop&q=60",
    },
    {
        id: "valley",
        label: "Valley",
        rank: "03",
        title: "Hidden Valleys",
        description: "Discover lush valleys nestled between ancient mountains.",
        image: "https://images.unsplash.com/photo-1682687218608-5e2522b04673?w=900&auto=format&fit=crop&q=60",
    },
];

const variants = {
    initial: (direction: number) => {
        return { x: `${30 * direction}%`, opacity: 0, filter: "blur(2px)" };
    },
    active: { x: "0%", opacity: 1, filter: "blur(0px)" },
    exit: (direction: number) => {
        return { x: `${-10 * direction}%`, opacity: 0, filter: "blur(2px)" };
    },
};

export default function AnimatedTabs() {
    const [activeTab, setActiveTab] = useState("coastal");
    const [direction, setDirection] = useState(0);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
    const listRef = useRef<HTMLDivElement>(null);

    const handleTabChange = (newTabId: string) => {
        const oldIndex = locations.findIndex((l) => l.id === activeTab);
        const newIndex = locations.findIndex((l) => l.id === newTabId);
        setDirection(newIndex > oldIndex ? 1 : -1);
        setActiveTab(newTabId);
    };

    useEffect(() => {
        const activeElement = tabRefs.current.get(activeTab);
        const listElement = listRef.current;

        if (activeElement && listElement) {
            const listRect = listElement.getBoundingClientRect();
            const activeRect = activeElement.getBoundingClientRect();

            setIndicatorStyle({
                left: activeRect.left - listRect.left,
                width: activeRect.width,
            });
        }
    }, [activeTab]);

    const activeLocation = locations.find((l) => l.id === activeTab);

    return (
        <div className="flex w-full max-w-sm md:max-w-md lg:max-w-lg flex-col items-center gap-6 p-4 md:p-10">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col items-center gap-5 w-full">
                <TabsList ref={listRef} className="relative">
                    {indicatorStyle.width > 0 && (
                        <motion.span
                            className="absolute top-1.5 bottom-1.5 z-0 bg-white dark:bg-neutral-700 rounded-full shadow-skeuo-pill bg-gloss-gradient border border-white/50 dark:border-black/5"
                            style={{ borderRadius: 9999 }}
                            initial={false}
                            animate={{
                                left: indicatorStyle.left,
                                width: indicatorStyle.width,
                            }}
                            transition={{ duration: 0.5, type: "spring", bounce: 0.3, }}
                        />
                    )}

                    {locations.map((loc) => (
                        <TabsPrimitive.Trigger
                            key={loc.id}
                            ref={(el) => {
                                if (el) tabRefs.current.set(loc.id, el);
                            }}
                            value={loc.id}
                            className={cn(
                                "relative z-10 hover:cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-2 text-sm md:text-[15px] font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                                activeTab === loc.id ? "text-foreground" : "text-muted-foreground"
                            )}
                        >
                            {loc.label}
                        </TabsPrimitive.Trigger>
                    ))}
                </TabsList>
                <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                    {activeLocation && (
                        <motion.div
                            key={activeLocation.id}
                            custom={direction}
                            variants={variants}
                            initial="initial"
                            animate="active"
                            exit="exit"
                            transition={{ duration: 0.38, type: "spring", bounce: 0.2, }}
                            className="relative overflow-hidden w-full bg-plate-gradient shadow-skeuo-card ring-1 ring-black/5 rounded-4xl">

                            <div className="p-8 pb-4">
                                <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                                    Destination {activeLocation.rank}
                                </span>
                                <h3 className="mt-3 text-xl font-bold text-foreground">
                                    {activeLocation.title}
                                </h3>
                                <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                                    {activeLocation.description}
                                </p>
                            </div>

                            <div className="p-2">
                                <div className="relative h-40 md:h-48 w-full overflow-hidden rounded-3xl ring-1 ring-black/10">
                                    <PlaceholderImage
                                        src={activeLocation.image}
                                        action={getPlaceholderAction}
                                        alt={activeLocation.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Tabs>
        </div>
    );
}
