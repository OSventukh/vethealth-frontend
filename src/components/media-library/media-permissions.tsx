"use client";
import { createContext, useContext } from "react";

/**
 * Чи може поточний користувач змінювати медіатеку: alt-тексти, їх ШІ-генерацію
 * (платну) і видалення. Бекенд пускає туди лише Admin+ — тут лише щоб не
 * показувати авторам кнопок, які однаково дадуть 403. Значення ставить
 * admin-layout (роль відома лише на сервері).
 */
const MediaPermissionsContext = createContext(false);

export function MediaPermissionsProvider({
	canManage,
	children,
}: {
	canManage: boolean;
	children: React.ReactNode;
}) {
	return (
		<MediaPermissionsContext.Provider value={canManage}>
			{children}
		</MediaPermissionsContext.Provider>
	);
}

export function useCanManageMedia(): boolean {
	return useContext(MediaPermissionsContext);
}
