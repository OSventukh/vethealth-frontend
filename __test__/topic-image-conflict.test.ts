import { topicImageConflict } from "@/app/(dashboard)/admin/topics/components/EditTopic/topic-image-conflict";

const getMediaMock = jest.fn();
jest.mock("../src/actions/media.action", () => ({
	getMediaAction: (...args: unknown[]) => getMediaMock(...args),
}));

const withUsages = (usages: unknown[]) => ({
	success: true,
	data: { id: "f1", usages },
});

describe("topicImageConflict", () => {
	it("refuses an image that is another topic's image", async () => {
		getMediaMock.mockResolvedValue(
			withUsages([
				{
					type: "topic",
					id: "t2",
					title: "Коти",
					slug: "cats",
					fields: ["image"],
				},
			]),
		);

		await expect(topicImageConflict("f1", "t1")).resolves.toContain(
			"вже належить темі «Коти»",
		);
	});

	it("allows the topic's own image and images used elsewhere", async () => {
		getMediaMock.mockResolvedValue(
			withUsages([
				{
					type: "topic",
					id: "t1",
					title: "Собаки",
					slug: "dogs",
					fields: ["image"],
				},
				{
					type: "post",
					id: "p1",
					title: "Кліщі",
					slug: "ticks",
					fields: ["cover"],
				},
				{
					type: "topic",
					id: "t3",
					title: "Птахи",
					slug: "birds",
					fields: ["social"],
				},
			]),
		);

		await expect(topicImageConflict("f1", "t1")).resolves.toBeNull();
	});
});
