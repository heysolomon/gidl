"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  Search,
  type LucideIcon,
  Layers,
  Smile,
  Frown,
  Annoyed,
  Meh,
  Laugh,
  Angry,
  Ghost,
  Glasses,
  Skull,
  Bot,
  Baby,
  Cat,
  Dog,
  Bird,
  Fish,
  Rabbit,
  Squirrel,
  Turtle,
  Bug,
  Heart,
  HeartPulse,
  Cross,
  Pill,
  Syringe,
  Stethoscope,
  Activity,
  Brain,
  Hand,
  ThumbsUp,
  Flame,
  Droplet,
  Snowflake,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudLightning,
  Umbrella,
  Wind,
  Leaf,
  TreePine,
  Flower,
  Sprout,
  Mountain,
  Waves,
  Star,
  Sparkles,
  Zap,
  Rocket,
  Plane,
  Car,
  Bike,
  Bus,
  TrainFront,
  Ship,
  Anchor,
  Compass,
  Map,
  MapPin,
  Globe,
  Earth,
  Flag,
  Trophy,
  Medal,
  Crown,
  Gem,
  Gift,
  PartyPopper,
  Cake,
  Pizza,
  Coffee,
  Wine,
  Beer,
  Apple,
  Cherry,
  Carrot,
  Egg,
  Sandwich,
  IceCream,
  Utensils,
  ChefHat,
  Home,
  Building,
  Building2,
  Castle,
  Tent,
  Warehouse,
  Store,
  School,
  Landmark,
  Factory,
  Hammer,
  Wrench,
  Drill,
  Paintbrush,
  Palette,
  Brush,
  Scissors,
  Ruler,
  PenTool,
  Pencil,
  Eraser,
  Book,
  BookOpen,
  Bookmark,
  Library,
  Newspaper,
  FileText,
  Folder,
  Archive,
  Package,
  Box,
  Briefcase,
  Wallet,
  CreditCard,
  Coins,
  PiggyBank,
  Receipt,
  ShoppingCart,
  ShoppingBag,
  Tag,
  Ticket,
  Calendar,
  Clock,
  AlarmClock,
  Hourglass,
  Timer,
  Bell,
  Mail,
  Inbox,
  Send,
  MessageCircle,
  Phone,
  Camera,
  Video,
  Music,
  Headphones,
  Mic,
  Radio,
  Tv,
  Monitor,
  Laptop,
  Smartphone,
  Watch,
  Keyboard,
  Mouse,
  Gamepad2,
  Puzzle,
  Dice5,
  Target,
  Lightbulb,
  Lamp,
  Key,
} from "lucide-react";
import { cn } from "@/lib/utils";

type IconOption = { name: string; Icon: LucideIcon };

const ICONS: IconOption[] = [
  { name: "layers", Icon: Layers },
  { name: "smile", Icon: Smile },
  { name: "frown", Icon: Frown },
  { name: "annoyed", Icon: Annoyed },
  { name: "meh", Icon: Meh },
  { name: "laugh", Icon: Laugh },
  { name: "angry", Icon: Angry },
  { name: "ghost", Icon: Ghost },
  { name: "glasses", Icon: Glasses },
  { name: "skull", Icon: Skull },
  { name: "bot", Icon: Bot },
  { name: "baby", Icon: Baby },
  { name: "cat", Icon: Cat },
  { name: "dog", Icon: Dog },
  { name: "bird", Icon: Bird },
  { name: "fish", Icon: Fish },
  { name: "rabbit", Icon: Rabbit },
  { name: "squirrel", Icon: Squirrel },
  { name: "turtle", Icon: Turtle },
  { name: "bug", Icon: Bug },
  { name: "heart", Icon: Heart },
  { name: "heart pulse", Icon: HeartPulse },
  { name: "cross", Icon: Cross },
  { name: "pill", Icon: Pill },
  { name: "syringe", Icon: Syringe },
  { name: "stethoscope", Icon: Stethoscope },
  { name: "activity", Icon: Activity },
  { name: "brain", Icon: Brain },
  { name: "hand", Icon: Hand },
  { name: "thumbs up", Icon: ThumbsUp },
  { name: "flame", Icon: Flame },
  { name: "droplet", Icon: Droplet },
  { name: "snowflake", Icon: Snowflake },
  { name: "sun", Icon: Sun },
  { name: "moon", Icon: Moon },
  { name: "cloud", Icon: Cloud },
  { name: "cloud rain", Icon: CloudRain },
  { name: "cloud lightning", Icon: CloudLightning },
  { name: "umbrella", Icon: Umbrella },
  { name: "wind", Icon: Wind },
  { name: "leaf", Icon: Leaf },
  { name: "tree pine", Icon: TreePine },
  { name: "flower", Icon: Flower },
  { name: "sprout", Icon: Sprout },
  { name: "mountain", Icon: Mountain },
  { name: "waves", Icon: Waves },
  { name: "star", Icon: Star },
  { name: "sparkles", Icon: Sparkles },
  { name: "zap", Icon: Zap },
  { name: "rocket", Icon: Rocket },
  { name: "plane", Icon: Plane },
  { name: "car", Icon: Car },
  { name: "bike", Icon: Bike },
  { name: "bus", Icon: Bus },
  { name: "train front", Icon: TrainFront },
  { name: "ship", Icon: Ship },
  { name: "anchor", Icon: Anchor },
  { name: "compass", Icon: Compass },
  { name: "map", Icon: Map },
  { name: "map pin", Icon: MapPin },
  { name: "globe", Icon: Globe },
  { name: "earth", Icon: Earth },
  { name: "flag", Icon: Flag },
  { name: "trophy", Icon: Trophy },
  { name: "medal", Icon: Medal },
  { name: "crown", Icon: Crown },
  { name: "gem", Icon: Gem },
  { name: "gift", Icon: Gift },
  { name: "party popper", Icon: PartyPopper },
  { name: "cake", Icon: Cake },
  { name: "pizza", Icon: Pizza },
  { name: "coffee", Icon: Coffee },
  { name: "wine", Icon: Wine },
  { name: "beer", Icon: Beer },
  { name: "apple", Icon: Apple },
  { name: "cherry", Icon: Cherry },
  { name: "carrot", Icon: Carrot },
  { name: "egg", Icon: Egg },
  { name: "sandwich", Icon: Sandwich },
  { name: "ice cream", Icon: IceCream },
  { name: "utensils", Icon: Utensils },
  { name: "chef hat", Icon: ChefHat },
  { name: "home", Icon: Home },
  { name: "building", Icon: Building },
  { name: "building 2", Icon: Building2 },
  { name: "castle", Icon: Castle },
  { name: "tent", Icon: Tent },
  { name: "warehouse", Icon: Warehouse },
  { name: "store", Icon: Store },
  { name: "school", Icon: School },
  { name: "landmark", Icon: Landmark },
  { name: "factory", Icon: Factory },
  { name: "hammer", Icon: Hammer },
  { name: "wrench", Icon: Wrench },
  { name: "drill", Icon: Drill },
  { name: "paintbrush", Icon: Paintbrush },
  { name: "palette", Icon: Palette },
  { name: "brush", Icon: Brush },
  { name: "scissors", Icon: Scissors },
  { name: "ruler", Icon: Ruler },
  { name: "pen tool", Icon: PenTool },
  { name: "pencil", Icon: Pencil },
  { name: "eraser", Icon: Eraser },
  { name: "book", Icon: Book },
  { name: "book open", Icon: BookOpen },
  { name: "bookmark", Icon: Bookmark },
  { name: "library", Icon: Library },
  { name: "newspaper", Icon: Newspaper },
  { name: "file text", Icon: FileText },
  { name: "folder", Icon: Folder },
  { name: "archive", Icon: Archive },
  { name: "package", Icon: Package },
  { name: "box", Icon: Box },
  { name: "briefcase", Icon: Briefcase },
  { name: "wallet", Icon: Wallet },
  { name: "credit card", Icon: CreditCard },
  { name: "coins", Icon: Coins },
  { name: "piggy bank", Icon: PiggyBank },
  { name: "receipt", Icon: Receipt },
  { name: "shopping cart", Icon: ShoppingCart },
  { name: "shopping bag", Icon: ShoppingBag },
  { name: "tag", Icon: Tag },
  { name: "ticket", Icon: Ticket },
  { name: "calendar", Icon: Calendar },
  { name: "clock", Icon: Clock },
  { name: "alarm clock", Icon: AlarmClock },
  { name: "hourglass", Icon: Hourglass },
  { name: "timer", Icon: Timer },
  { name: "bell", Icon: Bell },
  { name: "mail", Icon: Mail },
  { name: "inbox", Icon: Inbox },
  { name: "send", Icon: Send },
  { name: "message circle", Icon: MessageCircle },
  { name: "phone", Icon: Phone },
  { name: "camera", Icon: Camera },
  { name: "video", Icon: Video },
  { name: "music", Icon: Music },
  { name: "headphones", Icon: Headphones },
  { name: "mic", Icon: Mic },
  { name: "radio", Icon: Radio },
  { name: "tv", Icon: Tv },
  { name: "monitor", Icon: Monitor },
  { name: "laptop", Icon: Laptop },
  { name: "smartphone", Icon: Smartphone },
  { name: "watch", Icon: Watch },
  { name: "keyboard", Icon: Keyboard },
  { name: "mouse", Icon: Mouse },
  { name: "gamepad 2", Icon: Gamepad2 },
  { name: "puzzle", Icon: Puzzle },
  { name: "dice 5", Icon: Dice5 },
  { name: "target", Icon: Target },
  { name: "lightbulb", Icon: Lightbulb },
  { name: "lamp", Icon: Lamp },
  { name: "key", Icon: Key },
];

const EMOJIS =
  "😀 😃 😄 😁 😆 😅 😂 🙂 😉 😊 😇 🥰 😍 🤩 😘 😋 😛 😜 🤪 😎 🤓 🧐 🤔 🤗 🤭 😴 🥳 😺 🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵 🐔 🐧 🐦 🦉 🐝 🦋 🐢 🐙 🐠 🐬 🐳 🌵 🌲 🌴 🌱 🍀 🌸 🌻 🌙 ⭐ ☀️ 🌈 ☁️ ❄️ 🔥 💧 🌊 🍎 🍊 🍋 🍉 🍇 🍓 🍒 🥑 🥕 🌽 🍞 🧀 🍕 🍔 🌮 🍜 🍣 🍩 🍪 🎂 ☕ 🍵 ⚽ 🏀 🏈 🎾 🎯 🎮 🎲 🎨 🎬 🎧 🎸 🎹 🚀 ✈️ 🚗 🚲 ⛵ 🏠 🏰 ⛺ 🗺️ 🧭 💡 🔑 🔒 🛠️ 📦 📚 📌 📎 ✏️ 📝 📅 ⏰ 💬 📣 🔔 💎 🏆 🎁 🎉".split(
    " "
  );

// Linear's palette, as it appears in the reference.
// Linear's palette, with its second gray and pale pink swapped for colours
// that stand apart from their neighbours, so every change shows the wipe.
const COLORS = [
  { name: "Gray", value: "#b5babf" },
  { name: "Indigo", value: "#545fcb" },
  { name: "Teal", value: "#20acc7" },
  { name: "Green", value: "#43af76" },
  { name: "Yellow", value: "#efb700" },
  { name: "Orange", value: "#ef8e42" },
  { name: "Red", value: "#e84c4e" },
  { name: "Pink", value: "#e86ca5" },
  { name: "Purple", value: "#9b5de5" },
];

const COLUMNS = 14;
const ROWS = Math.ceil(ICONS.length / COLUMNS);
// The reference wipes mostly top to bottom (about 21ms a row, 5.5ms a column,
// each icon over about 105ms). Copied exactly, each row finished before the
// next got going and the wipe broke into bands. Longer fades with closer rows
// overlap more, so the colour flows down the grid instead.
const FADE_MS = 280;
const ROW_STEP_MS = 16;
const COLUMN_STEP_MS = 4;
// A gentle ease-in-out: no hard leading edge on each icon, so rows blend.
const WIPE_EASE = "cubic-bezier(0.45, 0, 0.25, 1)";

export function IconPicker({
  defaultName = "Launch plan",
  className,
}: {
  defaultName?: string;
  className?: string;
}) {
  const [tab, setTab] = useState<"icons" | "emojis">("icons");
  const [color, setColor] = useState(COLORS[1]!.value);
  const [icon, setIcon] = useState<IconOption>(ICONS[0]!);
  const [emoji, setEmoji] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  // The stagger only runs during a recolour. Outside one, hover stays instant.
  const [sweeping, setSweeping] = useState(false);
  const sweepTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const customRef = useRef<HTMLInputElement>(null);

  const isCustom = !COLORS.some((option) => option.value === color);

  const pick = (next: string) => {
    if (next === color) return;
    setColor(next);
    setSweeping(true);
    clearTimeout(sweepTimer.current);
    sweepTimer.current = setTimeout(
      () => setSweeping(false),
      FADE_MS + ROW_STEP_MS * (ROWS - 1) + COLUMN_STEP_MS * (COLUMNS - 1) + 50
    );
  };
  useEffect(() => () => clearTimeout(sweepTimer.current), []);

  const icons = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term ? ICONS.filter((option) => option.name.includes(term)) : ICONS;
  }, [query]);
  const emojis = query.trim() ? [] : EMOJIS;

  const Preview = icon.Icon;

  return (
    <div
      className={cn(
        "w-[340px] max-w-full overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-2 px-3 pt-2.5">
        {/* In the reference the header changes with the grid's first icon,
            with the same fade. */}
        <span
          className="flex size-6 shrink-0 items-center justify-center rounded-md transition-[background-color] ease-out motion-reduce:transition-none"
          style={{
            backgroundColor: `color-mix(in oklab, ${color} 18%, transparent)`,
            transitionDuration: `${FADE_MS}ms`,
            transitionTimingFunction: WIPE_EASE,
          }}
        >
          {emoji ? (
            <span className="text-[13px] leading-none">{emoji}</span>
          ) : (
            <Preview
              className="size-3.5 transition-colors ease-out motion-reduce:transition-none"
              style={{
                color,
                transitionDuration: `${FADE_MS}ms`,
                transitionTimingFunction: WIPE_EASE,
              }}
              aria-hidden
            />
          )}
        </span>
        <input
          defaultValue={defaultName}
          aria-label="Name"
          className="min-w-0 flex-1 bg-transparent text-[13px] font-medium shadow-none! outline-none"
        />
      </div>

      <div className="mt-2 flex gap-1 px-3" role="tablist" aria-label="Kind">
        {(["icons", "emojis"] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            onClick={() => setTab(value)}
            className={cn(
              "cursor-pointer rounded-full px-2 py-0.5 text-[11px] font-medium capitalize transition-colors",
              tab === value
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
            )}
          >
            {value}
          </button>
        ))}
      </div>

      {tab === "icons" && (
        <div className="isolate mt-2 flex items-center justify-between px-3">
          {COLORS.map((option) => (
            <Swatch
              key={option.value}
              label={option.name}
              color={option.value}
              selected={color === option.value}
              onClick={() => pick(option.value)}
            />
          ))}
          <span className="h-4 w-px bg-border" aria-hidden />
          <Swatch
            label="Custom colour"
            color={isCustom ? color : undefined}
            selected={isCustom}
            onClick={() => customRef.current?.click()}
          />
          <input
            ref={customRef}
            type="color"
            tabIndex={-1}
            aria-hidden
            className="sr-only"
            value={isCustom ? color : "#888888"}
            onChange={(event) => pick(event.target.value)}
          />
        </div>
      )}

      <label className="mt-2 flex items-center gap-1.5 border-y border-border px-3 py-1">
        <Search className="size-3 text-muted-foreground" aria-hidden />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={tab === "icons" ? "Search icons…" : "Search emojis…"}
          className="min-w-0 flex-1 bg-transparent text-[13px] shadow-none! outline-none placeholder:text-muted-foreground"
        />
      </label>

      <div className="h-[204px] overflow-y-auto px-3 py-2 [scrollbar-width:thin]">
        {tab === "icons" ? (
          icons.length ? (
            <div
              className="grid grid-cols-[repeat(14,22px)] justify-between gap-y-0.5"
              style={{ "--icon-color": color } as CSSProperties}
            >
              {icons.map((option, index) => {
                const row = Math.floor(index / COLUMNS);
                const column = index % COLUMNS;
                const selected = !emoji && option === icon;
                return (
                  <button
                    key={option.name}
                    type="button"
                    aria-label={option.name}
                    aria-pressed={selected}
                    onClick={() => {
                      setIcon(option);
                      setEmoji(null);
                    }}
                    // The long, staggered fade is only for a recolour. Hover is
                    // quick and immediate.
                    style={{
                      transitionDuration: sweeping ? `${FADE_MS}ms` : "120ms",
                      transitionTimingFunction: sweeping
                        ? WIPE_EASE
                        : undefined,
                      transitionDelay: sweeping
                        ? `${row * ROW_STEP_MS + column * COLUMN_STEP_MS}ms`
                        : "0ms",
                    }}
                    className={cn(
                      "flex size-[22px] cursor-pointer items-center justify-center rounded-[5px] text-(--icon-color) transition-colors ease-out motion-reduce:transition-none",
                      // Hover stays in the picked colour, on a soft tint of it.
                      "hover:bg-[color-mix(in_oklab,var(--icon-color)_16%,transparent)] focus-visible:outline-2 focus-visible:outline-(--icon-color)",
                      selected &&
                        "bg-[color-mix(in_oklab,var(--icon-color)_16%,transparent)]"
                    )}
                  >
                    <option.Icon className="size-3.5" aria-hidden />
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="py-8 text-center text-xs text-muted-foreground">
              No icons match.
            </p>
          )
        ) : emojis.length ? (
          <div className="grid grid-cols-[repeat(14,22px)] justify-between gap-y-0.5">
            {emojis.map((value) => (
              <button
                key={value}
                type="button"
                aria-label={value}
                aria-pressed={emoji === value}
                onClick={() => setEmoji(value)}
                className={cn(
                  "flex size-[22px] cursor-pointer items-center justify-center rounded-[5px] text-[13px] leading-none hover:bg-foreground/10",
                  emoji === value && "bg-foreground/10"
                )}
              >
                {value}
              </button>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-xs text-muted-foreground">
            No emojis match.
          </p>
        )}
      </div>
    </div>
  );
}

function Swatch({
  label,
  color,
  selected,
  onClick,
}: {
  label: string;
  /** Leave out for the custom swatch before a custom colour is picked. */
  color?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      onClick={onClick}
      style={
        {
          "--swatch":
            color ??
            "conic-gradient(#e84c4e, #efb700, #43af76, #20acc7, #545fcb, #c86481, #e84c4e)",
        } as CSSProperties
      }
      // Selected is two circles in the swatch's colour, as in Agentation's
      // marker colours: the front one shrinks to open a thin gap in the
      // panel's colour, and a larger one behind it fades in as a halo.
      className={cn(
        "relative size-[18px] shrink-0 cursor-pointer rounded-full bg-popover outline-none",
        "before:absolute before:inset-0 before:rounded-full before:[background:var(--swatch)] before:transition-[scale,opacity] before:duration-200",
        "after:absolute after:inset-0 after:-z-1 after:scale-120 after:rounded-full after:[background:var(--swatch)] after:opacity-0 after:transition-[scale,opacity] after:duration-200",
        "focus-visible:after:opacity-60 motion-reduce:before:transition-none motion-reduce:after:transition-none",
        selected && "before:scale-80 after:opacity-100"
      )}
    />
  );
}
