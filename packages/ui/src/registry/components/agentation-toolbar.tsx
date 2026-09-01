"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  Settings,
  Copy,
  Check,
  PanelLeft,
  Trash2,
  Eye,
  EyeOff,
  Pause,
  Play,
  X,
  Sun,
  Moon,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import styles from "./agentation-toolbar.module.css";

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// A standalone palette, not tied to gidl's own design-system tokens.
const ACCENTS = [
  { name: "Indigo", value: "#6155F5" },
  { name: "Blue", value: "#0088FF" },
  { name: "Cyan", value: "#00C3D0" },
  { name: "Green", value: "#34C759" },
  { name: "Yellow", value: "#FFCC00" },
  { name: "Orange", value: "#FF8D28" },
  { name: "Red", value: "#FF383C" },
];

const DETAIL_LEVELS = ["Compact", "Standard", "Detailed", "Forensic"];

function IconCross({
  active,
  from,
  to,
  sending,
}: {
  active: boolean;
  from: ReactNode;
  to: ReactNode;
  sending?: boolean;
}) {
  return (
    <span className={styles.iconCross}>
      <span
        className={cx(
          styles.iconCrossLayer,
          !active ? styles.crossVisible : styles.crossHidden,
          sending && styles.sending
        )}
      >
        {from}
      </span>
      <span
        className={cx(
          styles.iconCrossLayer,
          active ? styles.crossVisible : styles.crossHidden
        )}
      >
        {to}
      </span>
    </span>
  );
}

function ControlButton({
  label,
  onClick,
  active,
  danger,
  muted,
  sessionActive,
  children,
}: {
  label: string;
  onClick?: (e: React.MouseEvent) => void;
  active?: boolean;
  danger?: boolean;
  // Dimmed by default, full brightness on hover — the resting look for
  // controls that need an active annotation session to do anything (we have
  // no session to represent, so they stay muted always).
  muted?: boolean;
  sessionActive: boolean;
  children: ReactNode;
}) {
  return (
    <span className={cx(styles.controlButtonWrap, sessionActive && styles.tooltipsInSession)}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={cx(
          styles.controlButton,
          active && styles.controlButtonActive,
          danger && styles.controlButtonDanger,
          muted && styles.controlButtonMuted
        )}
      >
        {children}
      </button>
      <span className={styles.buttonTooltip}>{label}</span>
    </span>
  );
}

function SettingsSwitch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className={styles.settingsRow}>
      <span className={styles.settingsLabel}>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={cx(styles.switchTrack, checked && styles.switchTrackOn)}
        onClick={onChange}
      >
        <span className={cx(styles.switchThumb, checked && styles.switchThumbOn)} />
      </button>
    </div>
  );
}

// A checkbox rather than a switch — deliberately distinct from
// React Components/Hide Until Restart, which use SettingsSwitch.
function SettingsCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className={styles.checkboxRow}>
      <span className={styles.settingsLabel}>{label}</span>
      <span
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        className={cx(styles.checkboxBox, checked && styles.checkboxBoxChecked)}
        onClick={onChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onChange();
          }
        }}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8.5L6.5 12L13 4.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </label>
  );
}

/**
 * A floating, draggable toolbar that morphs between a collapsed trigger and
 * a full control row, with a settings panel and MCP/Webhooks sub-page.
 * Every control uses local state only — nothing here talks to a server.
 */
export const AgentationToolbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [eyeOpen, setEyeOpen] = useState(true);
  const [paused, setPaused] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [detailIndex, setDetailIndex] = useState(1);
  // DEFAULT_SETTINGS.annotationColorId is "blue" (index 1), not the first swatch.
  const [accentIndex, setAccentIndex] = useState(1);
  const [sessionActive, setSessionActive] = useState(false);
  const [reactComponents, setReactComponents] = useState(true);
  const [clearOnCopySend, setClearOnCopySend] = useState(false);
  const [blockPageInteractions, setBlockPageInteractions] = useState(true);
  const [settingsPage, setSettingsPage] = useState<"main" | "automations">("main");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhooksEnabled, setWebhooksEnabled] = useState(true);
  // The preview area is this component's whole "viewport" — the panel
  // normally opens upward, but if there isn't enough room above the button
  // within that viewport (e.g. it's been dragged near the top), it opens
  // downward instead.
  const [panelDirection, setPanelDirection] = useState<"up" | "down">("up");
  const panelRef = useRef<HTMLDivElement>(null);

  // Draggable toolbar: capture the mouse position *and* the toolbar's
  // current offset at mousedown, then apply the same delta to both on
  // every move.
  const [toolbarOffset, setToolbarOffset] = useState<{ x: number; y: number } | null>(null);
  const [isDraggingToolbar, setIsDraggingToolbar] = useState(false);
  const dragStartRef = useRef<{
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
    // Snapshot of how far the mouse can move in each direction before the
    // button would leave its preview container — measured once at
    // mousedown, not re-measured every frame.
    minDx: number;
    maxDx: number;
    minDy: number;
    maxDy: number;
  } | null>(null);
  // A drag-release fires a click right after mouseup — this suppresses just
  // that one click so releasing a drag doesn't also toggle the toolbar open.
  const justFinishedDragRef = useRef(false);
  const DRAG_THRESHOLD = 4;
  const wrapperRef = useRef<HTMLDivElement>(null);

  const sessionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (sessionTimeout.current) clearTimeout(sessionTimeout.current);
      if (copyTimeout.current) clearTimeout(copyTimeout.current);
    };
  }, []);

  function handleRowMouseEnter() {
    if (sessionTimeout.current) clearTimeout(sessionTimeout.current);
    setSessionActive(true);
  }

  function handleRowMouseLeave() {
    sessionTimeout.current = setTimeout(() => setSessionActive(false), 1000);
  }

  function handleCopy() {
    setCopied(true);
    if (copyTimeout.current) clearTimeout(copyTimeout.current);
    copyTimeout.current = setTimeout(() => setCopied(false), 1500);
  }

  function handleToggleSettings() {
    setSettingsOpen((wasOpen) => {
      const opening = !wasOpen;
      if (opening) {
        const previewBox = wrapperRef.current?.offsetParent as HTMLElement | null;
        const button = wrapperRef.current?.firstElementChild as HTMLElement | null;
        const panel = panelRef.current;
        if (previewBox && button && panel) {
          const previewRect = previewBox.getBoundingClientRect();
          const buttonRect = button.getBoundingClientRect();
          const panelHeight = panel.getBoundingClientRect().height;
          const gap = 8; // matches "calc(100% + 0.5rem)"
          const spaceAbove = buttonRect.top - previewRect.top;
          setPanelDirection(spaceAbove < panelHeight + gap ? "down" : "up");
        }
      }
      return opening;
    });
  }

  function handleClose(e: React.MouseEvent) {
    e.stopPropagation();
    setIsExpanded(false);
    setSettingsOpen(false);
  }

  function handleDragMouseDown(e: React.MouseEvent) {
    if (e.button !== 0) return;

    // offsetParent of an absolutely-positioned element is its nearest
    // positioned ancestor — here, the preview box this component is
    // rendered into. That's the "viewport" the button must stay inside.
    const wrapper = wrapperRef.current;
    const bounds = wrapper?.offsetParent as HTMLElement | null;
    const button = wrapper?.firstElementChild as HTMLElement | null;
    let minDx = -Infinity;
    let maxDx = Infinity;
    let minDy = -Infinity;
    let maxDy = Infinity;
    if (bounds && button) {
      const boundsRect = bounds.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      minDx = boundsRect.left - buttonRect.left;
      maxDx = boundsRect.right - buttonRect.right;
      minDy = boundsRect.top - buttonRect.top;
      maxDy = boundsRect.bottom - buttonRect.bottom;
    }

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      offsetX: toolbarOffset?.x ?? 0,
      offsetY: toolbarOffset?.y ?? 0,
      minDx,
      maxDx,
      minDy,
      maxDy,
    };
  }

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const start = dragStartRef.current;
      if (!start) return;
      let dx = e.clientX - start.x;
      let dy = e.clientY - start.y;

      if (!isDraggingToolbar && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;

      if (!isDraggingToolbar) setIsDraggingToolbar(true);

      dx = Math.min(Math.max(dx, start.minDx), start.maxDx);
      dy = Math.min(Math.max(dy, start.minDy), start.maxDy);

      setToolbarOffset({ x: start.offsetX + dx, y: start.offsetY + dy });
    }

    function handleMouseUp() {
      if (dragStartRef.current && isDraggingToolbar) {
        justFinishedDragRef.current = true;
        // The capture-phase handler normally consumes this flag the moment
        // a click lands back on the toolbar. But if the mouse comes up
        // somewhere else on the page entirely, no such click ever reaches
        // it — this timeout is the fallback that clears it regardless, so
        // a real drag doesn't leave the toolbar unclickable afterward.
        setTimeout(() => {
          justFinishedDragRef.current = false;
        }, 0);
      }
      dragStartRef.current = null;
      setIsDraggingToolbar(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingToolbar]);

  // Capture phase runs top-down, before the click reaches whatever was
  // actually clicked — so this swallows the click before a nested control
  // button's own onClick (Pause, Copy, etc.) ever sees it. Without this,
  // dragging starting from on top of a button both moves the toolbar and
  // fires that button's action.
  function handleContainerClickCapture(e: React.MouseEvent) {
    if (justFinishedDragRef.current) {
      justFinishedDragRef.current = false;
      e.stopPropagation();
      e.preventDefault();
    }
  }

  function handleContainerClick() {
    if (!isExpanded) setIsExpanded(true);
  }

  const accent = ACCENTS[accentIndex] ?? ACCENTS[0]!;

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      style={
        toolbarOffset
          ? ({
              "--toolbar-drag-x": `${toolbarOffset.x}px`,
              "--toolbar-drag-y": `${toolbarOffset.y}px`,
            } as CSSProperties)
          : undefined
      }
    >
      <div
        className={cx(
          styles.container,
          styles.entrance,
          isExpanded ? styles.expanded : styles.collapsed,
          isDraggingToolbar && styles.dragging,
          !isDark && styles.containerLight
        )}
        role="button"
        aria-label={isExpanded ? "Toolbar" : "Open toolbar"}
        aria-expanded={isExpanded}
        tabIndex={0}
        onMouseDown={handleDragMouseDown}
        onClickCapture={handleContainerClickCapture}
        onClick={handleContainerClick}
        onKeyDown={(e) => {
          if (!isExpanded && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setIsExpanded(true);
          }
        }}
        style={{ "--toolbar-accent": accent.value } as CSSProperties}
      >
        {/* icon + controls layers, clipped to the container's current
            (animated) bounds so the always-laid-out controls row can't be
            hit-tested outside it while collapsed */}
        <div className={cx(styles.contentClip, !isExpanded && styles.clipCollapsed)}>
        <div className={cx(styles.iconLayer, !isExpanded ? styles.visible : styles.hidden)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M11.5 12L5.5 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18.5 6.75L5.5 6.75"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.25 17.25L5.5 17.25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 12.75L16.5179 13.9677C16.8078 14.6494 17.3506 15.1922 18.0323 15.4821L19.25 16L18.0323 16.5179C17.3506 16.8078 16.8078 17.3506 16.5179 18.0323L16 19.25L15.4821 18.0323C15.1922 17.3506 14.6494 16.8078 13.9677 16.5179L12.75 16L13.9677 15.4821C14.6494 15.1922 15.1922 14.6494 15.4821 13.9677L16 12.75Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* expanded control row */}
        <div
          className={cx(styles.controlsLayer, isExpanded ? styles.visible : styles.hidden)}
          onMouseEnter={handleRowMouseEnter}
          onMouseLeave={handleRowMouseLeave}
        >
          {/* Pause and Close are always available; the rest are muted since
              they'd need an annotation session to act on. */}
          <div className={styles.controlsRow} onClick={(e) => e.stopPropagation()}>
            <ControlButton
              label={paused ? "Resume" : "Pause"}
              onClick={() => setPaused((v) => !v)}
              active={paused}
              sessionActive={sessionActive}
            >
              <IconCross active={paused} from={<Pause size={16} />} to={<Play size={16} />} />
            </ControlButton>

            <ControlButton
              label="Layout"
              muted
              sessionActive={sessionActive}
            >
              <PanelLeft size={16} />
            </ControlButton>

            <ControlButton
              label={eyeOpen ? "Hide markers" : "Show markers"}
              onClick={() => setEyeOpen((v) => !v)}
              muted
              sessionActive={sessionActive}
            >
              <IconCross active={!eyeOpen} from={<Eye size={16} />} to={<EyeOff size={16} />} />
            </ControlButton>

            <ControlButton
              label={copied ? "Copied" : "Copy"}
              onClick={handleCopy}
              muted
              sessionActive={sessionActive}
            >
              <IconCross
                active={copied}
                from={<Copy size={16} />}
                to={<Check size={16} className={styles.iconSuccess} />}
              />
            </ControlButton>

            <ControlButton
              label="Clear"
              danger
              muted
              sessionActive={sessionActive}
            >
              <Trash2 size={16} />
            </ControlButton>

            <ControlButton
              label="Settings"
              onClick={handleToggleSettings}
              active={settingsOpen}
              muted={!settingsOpen}
              sessionActive={sessionActive}
            >
              <Settings size={16} />
            </ControlButton>

            <span className={styles.divider} />

            <ControlButton
              label="Close"
              onClick={handleClose}
              sessionActive={sessionActive}
            >
              <X size={16} />
            </ControlButton>
          </div>
        </div>
        </div>

        {/* settings panel — always mounted so the exit transition can play */}
        <div
          ref={panelRef}
          className={cx(styles.settingsPanel, !isDark && styles.settingsPanelLight, settingsOpen ? styles.panelEnter : styles.panelExit)}
          style={panelDirection === "down" ? { bottom: "auto", top: "calc(100% + 0.5rem)" } : undefined}
          onClick={(e) => e.stopPropagation()}
        >
        <div className={styles.settingsPanelContainer}>
        <div className={cx(styles.settingsPageMain, settingsPage === "automations" && styles.slideLeft)}>
          <div className={styles.settingsHeader}>
            {/* Static wordmark — not a link. */}
            <span className={styles.settingsBrand}>
              <svg width="72" height="16" viewBox="0 0 676 151" fill="none">
                <path
                  d="M79.6666 100.561L104.863 15.5213C107.828 4.03448 99.1201 -3.00582 88.7449 1.25541L3.52015 39.6065C1.48217 40.5329 0 42.7562 0 45.1647C0 48.6848 2.77907 51.4639 6.29922 51.4639C7.22558 51.4639 8.15193 51.2786 9.07829 50.9081L93.7472 12.7422C97.2674 11.0748 93.7472 8.29572 92.6356 12.1864L67.624 97.2259C66.5123 100.931 69.4767 105.193 73.7379 105.193C76.517 105.193 79.1108 103.155 79.6666 100.561ZM663.641 100.005C665.679 107.231 677.537 104.081 675.499 96.8553L666.05 66.2856C663.456 57.7631 655.489 55.7251 648.82 61.098L618.991 86.6654C617.324 87.9623 621.029 89.815 621.214 88.1476L625.846 61.6538C626.958 55.3546 624.179 50.5375 615.841 50.5375L579.158 51.0934C576.008 51.0934 578.417 53.8724 578.417 57.022C578.417 60.1716 580.825 61.6538 583.975 61.6538L616.212 60.9127C616.397 60.9127 614.544 59.6158 614.544 59.8011L609.727 88.7034C607.875 99.6344 617.694 102.784 626.031 95.7437L655.86 70.1763L654.192 69.6205L663.641 100.005ZM571.191 89.0739C555.443 88.7034 562.298 61.4685 578.787 61.8391C594.72 62.0243 587.124 89.2592 571.191 89.0739ZM571.006 100.375C601.575 100.931 611.024 51.6492 579.158 51.0934C547.847 50.5375 540.065 99.8197 571.006 100.375ZM521.909 46.4616C525.985 46.4616 529.505 42.9414 529.505 38.6802C529.505 34.4189 525.985 31.0841 521.909 31.0841C517.833 31.0841 514.127 34.6042 514.127 38.6802C514.127 42.7562 517.648 46.4616 521.909 46.4616ZM472.256 103.525C493.192 103.71 515.98 73.3259 519.13 62.3949L509.866 60.9127C505.234 73.3259 497.638 101.672 519.871 102.043C536.545 102.228 552.479 85.3685 563.595 70.1763C564.151 69.2499 564.706 68.1383 564.706 66.8414C564.706 63.6918 563.965 61.098 560.816 61.098C558.963 61.098 557.296 62.0243 556.184 63.5065C546.365 77.0313 530.802 90.9266 522.094 90.7414C511.904 90.5561 517.462 71.4732 519.871 64.9887C523.391 55.7251 512.831 53.5019 509.681 60.9127C506.531 68.6941 488.19 92.4088 475.035 92.2235C467.439 92.0383 464.29 83.8863 472.441 59.9864L486.707 17.7445C487.634 14.4097 485.41 10.519 481.334 10.519C478.741 10.519 476.517 12.1864 475.962 14.4097L461.696 56.4662C451.506 86.4801 455.211 103.155 472.256 103.525ZM447.43 42.5709L496.527 41.4593C499.306 41.4593 501.529 39.0507 501.529 36.2717C501.529 33.3073 499.306 31.0841 496.341 31.0841L447.245 32.1957C444.466 32.1957 442.242 34.4189 442.242 37.3833C442.242 40.1624 444.466 42.5709 447.43 42.5709ZM422.974 106.304C435.387 106.489 457.249 94.8173 472.441 53.8724C473.553 50.7228 472.071 48.3143 468.365 48.3143C466.142 48.3143 464.29 49.6112 463.548 51.6492C450.394 87.2212 431.682 96.1142 424.456 95.929C419.454 95.929 417.972 93.3352 418.713 85.5538C419.454 78.1429 410.376 74.9933 406.114 81.1073C401.297 87.777 394.442 94.2615 385.549 94.0763C370.172 93.891 376.471 67.0267 399.815 67.3972C408.338 67.5825 414.452 71.4732 417.045 76.6608C417.786 78.3282 419.454 79.6251 421.492 79.6251C424.271 79.6251 426.679 77.2166 426.679 74.4375C426.679 73.6964 426.494 72.9553 426.124 72.2143C421.862 63.6918 412.414 57.3926 400 57.2073C363.502 56.6515 353.497 104.451 383.326 104.822C397.036 105.193 410.005 94.0763 413.34 85.9243C412.599 86.8507 408.338 86.6654 408.523 84.4422C407.411 97.4111 410.931 106.119 422.974 106.304ZM335.897 104.266C335.897 115.012 347.569 117.606 347.569 103.34C347.569 89.0739 358.5 54.4282 361.464 45.1647L396.666 43.6825C405.929 43.1267 404.262 33.1221 397.036 33.3073L364.984 34.4189L368.875 22.7469C369.801 20.1531 370.542 17.9298 370.542 16.2624C370.542 13.4833 368.504 11.8159 365.911 11.8159C362.946 11.8159 360.352 12.7422 357.573 21.0794L352.942 35.16L330.153 36.0864C326.263 36.4569 323.483 38.1244 323.483 41.6445C323.483 45.5352 326.448 47.0174 330.709 46.8321L349.421 45.9058C345.901 56.6515 335.897 90.7414 335.897 104.266ZM186.939 78.6988C193.979 56.4662 212.877 54.984 212.877 62.9507C212.877 68.3236 203.984 77.0313 186.939 78.6988ZM113.942 150.955C142.844 152.437 159.704 111.492 160.63 80.5515C161.556 73.3259 153.96 70.3616 148.773 75.7344C141.918 83.1453 129.505 93.1499 119.685 93.1499C103.011 93.1499 116.165 59.8011 143.956 59.8011C149.514 59.8011 153.59 61.6538 156.184 64.0623C160.815 68.3236 170.82 62.0243 165.818 56.0957C161.927 51.4639 155.072 48.129 144.882 48.129C102.455 48.129 83.7426 105.007 116.721 105.007C134.692 105.007 151.367 88.3329 155.257 82.7747C154.516 83.5158 149.329 81.2925 149.699 79.4398L149.143 83.5158C148.958 107.045 134.322 141.506 116.536 139.838C113.386 139.468 112.089 137.43 112.089 134.836C112.089 128.907 122.094 119.273 145.067 113.53C159.518 109.824 152.293 101.487 143.4 104.081C111.163 113.53 99.6759 127.425 99.6759 137.8C99.6759 145.026 105.605 150.584 113.942 150.955ZM194.72 109.454C214.359 109.454 239 95.3732 251.228 77.9577C250.301 82.96 246.596 96.8553 246.596 101.487C246.596 110.01 254.748 109.454 261.232 102.784L288.097 75.5491L290.32 85.7391C293.284 99.4491 299.213 104.822 308.847 104.822C326.263 104.822 342.196 85.7391 349.421 74.8081L344.049 63.6918C339.787 74.8081 321.631 92.5941 311.626 92.5941C306.994 92.5941 304.771 89.815 303.289 83.7011L300.325 71.2879C297.916 60.7275 289.023 58.3189 279.018 68.1383L261.788 84.8127L264.382 69.991C266.235 59.2453 255.674 58.1337 250.116 65.915C241.779 77.0313 216.767 97.7817 196.387 97.7817C187.865 97.7817 185.456 93.7057 185.456 88.3329C230.848 84.998 239.185 47.2027 208.986 47.2027C172.858 47.2027 157.11 109.454 194.72 109.454Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <button
              type="button"
              className={styles.themeToggleBtn}
              aria-label="Toggle panel theme"
              onClick={() => setIsDark((v) => !v)}
            >
              <span key={isDark ? "dark" : "light"} className={styles.themeIcon}>
                {isDark ? <Moon size={16} /> : <Sun size={16} />}
              </span>
            </button>
          </div>

          <div className={styles.panelDivider} />

          <div className={styles.settingsSection}>
            <div className={styles.settingsRow}>
              <span className={styles.settingsLabel}>Output Detail</span>
              <button
                type="button"
                className={styles.cycleButton}
                onClick={() => setDetailIndex((i) => (i + 1) % DETAIL_LEVELS.length)}
              >
                <span key={detailIndex} className={styles.cycleLabel}>
                  {DETAIL_LEVELS[detailIndex]}
                </span>
                <span className={styles.cycleDots}>
                  {DETAIL_LEVELS.map((level, i) => (
                    <span
                      key={level}
                      className={cx(styles.cycleDot, i === detailIndex && styles.cycleDotActive)}
                    />
                  ))}
                </span>
              </button>
            </div>

            <SettingsSwitch
              label="React Components"
              checked={reactComponents}
              onChange={() => setReactComponents((v) => !v)}
            />

            {/* Always renders off — clicking it fires a one-shot action
                rather than persisting a checked state, so it never
                actually flips. */}
            <SettingsSwitch label="Hide Until Restart" checked={false} onChange={() => {}} />
          </div>

          <div className={styles.panelDivider} />

          <div className={styles.settingsSection}>
            <span className={styles.settingsLabel}>Marker Color</span>
            <span className={styles.markerColorRow}>
              {ACCENTS.map((color, i) => (
                <button
                  key={color.name}
                  type="button"
                  aria-label={color.name}
                  aria-pressed={i === accentIndex}
                  className={cx(styles.swatch, i === accentIndex && styles.swatchSelected)}
                  style={{ "--swatch-color": color.value } as CSSProperties}
                  onClick={() => setAccentIndex(i)}
                />
              ))}
            </span>
          </div>

          <div className={styles.panelDivider} />

          <div className={styles.settingsSection}>
            <SettingsCheckbox
              label="Clear on copy/send"
              checked={clearOnCopySend}
              onChange={() => setClearOnCopySend((v) => !v)}
            />

            <SettingsCheckbox
              label="Block page interactions"
              checked={blockPageInteractions}
              onChange={() => setBlockPageInteractions((v) => !v)}
            />
          </div>

          <div className={styles.panelDivider} />

          {/* Navigates to the automations page below — the sliding
              transition is real, the MCP connection behind it isn't. */}
          <button
            type="button"
            className={styles.settingsNavLink}
            onClick={() => setSettingsPage("automations")}
          >
            <span>Manage MCP & Webhooks</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* automations page — absolutely positioned over the main page,
            slides in from the right while it fades/slides out. */}
        <div className={cx(styles.settingsPageAutomations, settingsPage === "automations" && styles.slideIn)}>
          <button
            type="button"
            className={styles.settingsBackButton}
            onClick={() => setSettingsPage("main")}
          >
            <ChevronLeft size={16} />
            <span>Manage MCP & Webhooks</span>
          </button>

          <div className={styles.panelDivider} />

          <div className={styles.settingsSection}>
            <div className={styles.automationHeader}>MCP Connection</div>
            <p className={styles.automationDescription}>
              MCP connection allows agents to receive and act on annotations.{" "}
              <span className={styles.learnMoreLink}>Learn more</span>
            </p>
          </div>

          <div className={styles.panelDivider} />

          <div className={styles.settingsSection}>
            <div className={styles.settingsRow}>
              <span className={styles.automationHeader}>Webhooks</span>
              <span className={styles.autoSendContainer}>
                <span
                  className={cx(styles.autoSendLabel, webhooksEnabled && styles.autoSendLabelActive)}
                >
                  Auto-Send
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={webhooksEnabled}
                  className={cx(styles.switchTrack, webhooksEnabled && styles.switchTrackOn)}
                  onClick={() => setWebhooksEnabled((v) => !v)}
                >
                  <span
                    className={cx(styles.switchThumb, webhooksEnabled && styles.switchThumbOn)}
                  />
                </button>
              </span>
            </div>
            <p className={styles.automationDescription}>
              The webhook URL will receive live annotation changes and annotation data.
            </p>
            <textarea
              className={styles.webhookUrlInput}
              placeholder="Webhook URL"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
          </div>
        </div>
        </div>
      </div>
    </div>
    </div>
  );
};
