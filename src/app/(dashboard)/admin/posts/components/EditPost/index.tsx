"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import type { CategoryResponse } from "@/api/types/categories.type";
import type { PostResponse } from "@/api/types/posts.type";
import type { TopicResponse } from "@/api/types/topics.type";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import type { UserSession } from "@/utils/types/user.type";
import {
	createPostSchema,
	type PostValues,
} from "@/utils/validators/form.validator";
import type { PostStatusEnum } from "../../actions/post-status.enum";
import { savePostAction } from "../../actions/save-post.action";
import { ClassificationCard } from "./classification-card";
import { ContentTab } from "./content-tab";
import { CoverCard } from "./cover-card";
import { PostEditorHeader } from "./post-editor-header";
import { PublishCard } from "./publish-card";
import { RevisionHistoryButton } from "./revisions/revision-history-sheet";
import { SeoTab } from "./seo-tab";
import { SettingsTab } from "./settings-tab";

type Props = {
	initialData?: PostResponse | null;
	topics?: TopicResponse[];
	categories?: CategoryResponse[];
	editMode?: boolean;
	user?: UserSession;
};

type EditorTab = "content" | "seo" | "settings";

const TWITTER_CARDS = ["summary", "summary_large_image"] as const;

const toIds = (items?: { id: string }[] | null): { id: string }[] =>
	items?.map(({ id }) => ({ id })) || [];

/** Порожні рядки → undefined: `forbidNonWhitelisted`-бекенд відхиляє
 * невідомі поля, а `@IsUrl()` на canonicalUrl падає на "". */
const cleanMetadata = (metadata: PostValues["metadata"]) => ({
	metaTitle: metadata.metaTitle?.trim() || undefined,
	metaDescription: metadata.metaDescription?.trim() || undefined,
	metaKeywords: metadata.metaKeywords?.trim() || undefined,
	ogTitle: metadata.ogTitle?.trim() || undefined,
	ogDescription: metadata.ogDescription?.trim() || undefined,
	ogImage: metadata.ogImage?.trim() || undefined,
	twitterCard: metadata.twitterCard,
	canonicalUrl: metadata.canonicalUrl?.trim() || undefined,
	indexable: metadata.indexable,
	followable: metadata.followable,
});

/** Поля, які повертає відновлення версії (решта — статус, теми, категорії — не змінюється). */
const pickRestored = (post: PostResponse): Partial<PostResponse> => ({
	title: post.title,
	slug: post.slug,
	content: post.content,
	featuredImage: post.featuredImage,
	featuredImageFile: post.featuredImageFile,
	featuredImageUrl: post.featuredImageUrl,
	metadata: post.metadata,
	updatedAt: post.updatedAt,
});

/**
 * Обгортка над формою: після відновлення версії форму (react-hook-form +
 * Lexical) треба перемонтувати з новими даними — `defaultValues` і
 * `initialContent` читаються лише при монтуванні. Звичайне збереження форму
 * не перемонтовує (не скидає undo-історію Lexical і прокрутку).
 */
export default function EditPost(props: Props) {
	const router = useRouter();
	const [restored, setRestored] = useState<{
		post: Partial<PostResponse>;
		version: number;
	} | null>(null);

	const initialData = props.initialData
		? { ...props.initialData, ...restored?.post }
		: props.initialData;

	const handleRestored = (post: PostResponse) => {
		setRestored((prev) => ({
			post: pickRestored(post),
			version: (prev?.version ?? 0) + 1,
		}));
		if (post.slug !== props.initialData?.slug) {
			router.replace(`/admin/posts/edit/${post.slug}`, { scroll: false });
		} else {
			// Свіжі статус/теми з сервера (updateTag уже скинув кеш).
			router.refresh();
		}
	};

	return (
		<PostEditorForm
			key={restored?.version ?? 0}
			{...props}
			initialData={initialData}
			onRestored={handleRestored}
		/>
	);
}

function PostEditorForm({
	initialData,
	topics: topicsOptions,
	categories: categoriesOptions,
	editMode,
	user,
	onRestored,
}: Props & { onRestored: (post: PostResponse) => void }) {
	const router = useRouter();
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const [activeTab, setActiveTab] = useState<EditorTab>("content");
	const [stats, setStats] = useState({ words: 0, chars: 0 });

	const form = useForm<PostValues>({
		resolver: zodResolver(createPostSchema),
		defaultValues: {
			title: initialData?.title || "",
			slug: initialData?.slug || "",
			content: initialData?.content || "",
			featuredImageFile: initialData?.featuredImageFile || null,
			featuredImageUrl: initialData?.featuredImageUrl || "",
			topics: toIds(initialData?.topics),
			categories: toIds(initialData?.categories),
			metadata: {
				metaTitle: initialData?.metadata?.metaTitle || "",
				metaDescription: initialData?.metadata?.metaDescription || "",
				metaKeywords: initialData?.metadata?.metaKeywords || "",
				ogTitle: initialData?.metadata?.ogTitle || "",
				ogDescription: initialData?.metadata?.ogDescription || "",
				ogImage: initialData?.metadata?.ogImage || "",
				twitterCard: TWITTER_CARDS.includes(
					initialData?.metadata?.twitterCard as (typeof TWITTER_CARDS)[number],
				)
					? (initialData?.metadata
							?.twitterCard as (typeof TWITTER_CARDS)[number])
					: "summary_large_image",
				canonicalUrl: initialData?.metadata?.canonicalUrl || "",
				indexable: initialData?.metadata?.indexable ?? true,
				followable: initialData?.metadata?.followable ?? true,
			},
		},
		mode: "onChange",
	});

	// Читаємо під час рендера: formState — проксі з підпискою, і без цього
	// читання react-hook-form не рахує isDirty.
	const { isDirty } = form.formState;

	const onInvalid = (errors: FieldErrors<PostValues>) => {
		const contentTabErrors = errors.title || errors.content || errors.slug;
		setActiveTab(contentTabErrors ? "content" : "seo");
		toast({
			variant: "destructive",
			description: "Перевірте виділені поля форми",
		});
	};

	const saveHandler = (status: PostStatusEnum) => {
		form.handleSubmit((values) => {
			startTransition(async () => {
				const res = await savePostAction(
					{
						id: initialData?.id,
						title: values.title,
						content: values.content || "",
						slug: values.slug || "",
						featuredImageFile: values.featuredImageFile
							? { id: values.featuredImageFile.id }
							: null,
						featuredImageUrl: values.featuredImageUrl || null,
						topics: values.topics,
						categories: values.categories,
						status: { id: status },
						metadata: cleanMetadata(values.metadata),
					},
					editMode,
				);
				toast({
					variant: res.error ? "destructive" : "success",
					description: res.success ? "Стаття збережена" : res.message,
				});
				if (res.success) {
					// Збережене стає новою базою для isDirty (інакше форма вважалась би
					// «зміненою» до перезавантаження). keepValues — не чіпати те, що
					// редактор устиг ввести, поки йшов запит.
					form.reset(values, { keepValues: true });
				}
				if (res.success && res.redirect && res.redirect !== initialData?.slug) {
					router.replace(`/admin/posts/edit/${res.redirect}`, {
						scroll: false,
					});
				}
			});
		}, onInvalid)();
	};

	return (
		<Form {...form}>
			<Tabs
				value={activeTab}
				onValueChange={(value) => setActiveTab(value as EditorTab)}
				className="w-full max-w-[1400px]"
			>
				<PostEditorHeader
					editMode={editMode}
					actions={
						editMode &&
						initialData?.id && (
							<RevisionHistoryButton
								postId={initialData.id}
								getCurrent={() => {
									const values = form.getValues();
									return {
										title: values.title,
										slug: values.slug || "",
										content: values.content || "",
										featuredImageFileId: values.featuredImageFile?.id ?? null,
										featuredImageUrl: values.featuredImageUrl || null,
										metaTitle: values.metadata.metaTitle || "",
										metaDescription: values.metadata.metaDescription || "",
									};
								}}
								isDirty={isDirty}
								onRestored={onRestored}
							/>
						)
					}
				/>

				<div className="flex w-full flex-col items-start gap-5 lg:flex-row">
					<div className="w-full min-w-0 flex-1">
						<TabsContent value="content" keepMounted className="mt-0">
							<ContentTab
								initialContent={initialData?.content}
								topicsOptions={topicsOptions}
								stats={stats}
								onStatsChange={setStats}
							/>
						</TabsContent>
						<TabsContent value="seo" keepMounted className="mt-0">
							<SeoTab words={stats.words} topicsOptions={topicsOptions} />
						</TabsContent>
						<TabsContent value="settings" keepMounted className="mt-0">
							<SettingsTab
								editMode={editMode}
								postId={initialData?.id}
								postTitle={initialData?.title}
							/>
						</TabsContent>
					</div>

					<aside className="flex w-full flex-col gap-4 lg:sticky lg:top-0 lg:w-[320px] lg:shrink-0 lg:self-start xl:w-[340px]">
						<PublishCard
							status={initialData?.status}
							user={user}
							isPending={isPending}
							onSave={saveHandler}
						/>
						<ClassificationCard
							topicsOptions={topicsOptions}
							categoriesOptions={categoriesOptions}
						/>
						<CoverCard />
					</aside>
				</div>
			</Tabs>
		</Form>
	);
}
