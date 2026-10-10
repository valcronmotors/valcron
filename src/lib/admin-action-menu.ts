export type MenuBox = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type MenuSize = {
  width: number;
  height: number;
};

export type ViewportSize = {
  width: number;
  height: number;
};

export function positionAdminMenu({
  trigger,
  menu,
  viewport,
  padding = 8,
}: {
  trigger: MenuBox;
  menu: MenuSize;
  viewport: ViewportSize;
  padding?: number;
}) {
  const spaceBelow = viewport.height - trigger.bottom - padding;
  const spaceAbove = trigger.top - padding;
  // Mobile/tablet portrait: always use a bottom sheet so menus never overlap card stacks.
  const cramped =
    viewport.width < 1024 || (spaceBelow < menu.height && spaceAbove < menu.height);

  if (cramped) {
    return {
      mode: "sheet" as const,
      top: 0,
      left: 0,
      width: viewport.width,
    };
  }

  const openUp = spaceBelow < menu.height && spaceAbove > spaceBelow;
  const width = Math.min(menu.width, viewport.width - padding * 2);
  let left = trigger.right - width;
  left = Math.min(Math.max(padding, left), viewport.width - width - padding);
  let top = openUp ? trigger.top - menu.height - 4 : trigger.bottom + 4;
  top = Math.min(Math.max(padding, top), viewport.height - menu.height - padding);

  return {
    mode: "menu" as const,
    top,
    left,
    width,
  };
}

export const ADMIN_ACTION_MENU_A11Y = {
  triggerHaspopup: "menu",
  menuRole: "menu",
  itemRole: "menuitem",
} as const;
