/* Спільні стилі кнопок тулбарів редактора (основний + плаваючий),
   за дизайн-мокапом: кнопка 32×32, іконка 16px, teal hover/актив. */

export const toolbarButtonClass =
	"flex size-8 shrink-0 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4";

export const toolbarSelectClass =
	"flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4";

export const toolbarActiveClass = "bg-primary/15 text-primary";

/* Пункт дропдаун-меню тулбара: teal-підсвітка через focus (Base UI Menu
   фокусує пункт і при наведенні миші, і при клавіатурній навігації). */
export const toolbarMenuItemClass =
	"focus:bg-primary/10 focus:text-primary";
