import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

export interface RowActionItem {
  key: string;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

export interface RowActionsMenuProps {
  items: RowActionItem[];
  ariaLabel?: string;
  /** When true, the trigger is disabled (e.g. while a row async action runs). */
  disabled?: boolean;
}

function getScrollParents(el: HTMLElement | null): HTMLElement[] {
  const parents: HTMLElement[] = [];
  let p: HTMLElement | null = el?.parentElement ?? null;
  while (p) {
    const s = window.getComputedStyle(p);
    const scrollable =
      /(auto|scroll|overlay)/.test(s.overflowY) ||
      /(auto|scroll|overlay)/.test(s.overflowX);
    if (scrollable) {
      parents.push(p);
    }
    p = p.parentElement;
  }
  return parents;
}

export const RowActionsMenu: React.FC<RowActionsMenuProps> = ({
  items,
  ariaLabel = "Row actions",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const menuWidth = 176; // w-44
    const gap = 4;

    let left = rect.right - menuWidth;
    left = Math.max(gap, Math.min(left, vw - menuWidth - gap));

    const menuH = menuRef.current?.offsetHeight ?? items.length * 40 + 16;
    let top = rect.bottom + gap;
    if (top + menuH > vh - gap) {
      top = rect.top - menuH - gap;
    }
    if (top < gap) {
      top = gap;
    }

    setCoords({ top, left });
  }, [items.length]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    const id = requestAnimationFrame(() => updatePosition());
    return () => cancelAnimationFrame(id);
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open || !buttonRef.current) return;

    const onScrollOrResize = () => updatePosition();
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);
    const scrollParents = getScrollParents(buttonRef.current);
    scrollParents.forEach((el) => {
      el.addEventListener("scroll", onScrollOrResize, true);
    });

    return () => {
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
      scrollParents.forEach((el) => {
        el.removeEventListener("scroll", onScrollOrResize, true);
      });
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (buttonRef.current?.contains(t) || menuRef.current?.contains(t)) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const onItem = useCallback((item: RowActionItem) => {
    setOpen(false);
    item.onClick();
  }, []);

  if (items.length === 0) return null;

  if (disabled) {
    return (
      <div className="inline-block text-left">
        <button
          type="button"
          disabled
          aria-label={ariaLabel}
          aria-disabled="true"
          className="inline-flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-md border border-stanbic-border bg-stanbic-canvas text-stanbic-text/40 opacity-60"
        >
          <EllipsisVerticalIcon className="h-5 w-5" />
        </button>
      </div>
    );
  }

  const menu = open ? (
    <div
      ref={menuRef}
      role="menu"
      style={{
        position: "fixed",
        top: coords.top,
        left: coords.left,
        zIndex: 60,
      }}
      className="w-52 rounded-lg border border-stanbic-border bg-white py-1 text-left shadow-lg"
    >
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          role="menuitem"
          onClick={() => onItem(item)}
          className={`block w-full px-3 py-2.5 text-left text-sm font-medium leading-[130%] transition hover:bg-stanbic-canvas ${item.danger
              ? "text-red-600 hover:bg-red-50"
              : "text-stanbic-text"
            }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  ) : null;

  return (
    <div className="inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-stanbic-secondary bg-white text-stanbic-secondary shadow-sm transition hover:bg-stanbic-secondary/5 hover:text-stanbic-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-stanbic-secondary/35"
      >
        <EllipsisVerticalIcon className="h-5 w-5" />
      </button>
      {typeof document !== "undefined" && menu
        ? createPortal(menu, document.body)
        : null}
    </div>
  );
};
