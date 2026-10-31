import { getMediaAction } from "@/actions/media.action";

/**
 * У теми картинка — звʼязок one-to-one (UNIQUE на `topics.imageId`): картинку
 * іншої теми обрати не можна, бекенд відповість 409. Перевіряємо ще в пікері,
 * щоб редактор не дізнавався про це лише при збереженні.
 */
export async function topicImageConflict(
	fileId: string,
	topicId?: string,
): Promise<string | null> {
	const result = await getMediaAction(fileId);
	if (!result.success) return result.message;
	const owner = result.data.usages.find(
		(usage) =>
			usage.type === "topic" &&
			usage.fields.includes("image") &&
			usage.id !== topicId,
	);
	return owner
		? `Ця картинка вже належить темі «${owner.title}». У кожної теми має бути власний файл — завантажте копію або оберіть інше зображення.`
		: null;
}
