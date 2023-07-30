import { Topic } from "@/types/content-types";
import { TopicContent } from "@/utils/constants/content.enum";
const topics: Topic[] = [
  {
    id: '1',
    title: 'Собаки',
    image: 'images/dog.svg',
    slug: 'dogs',
    description: '',
    status: 'active',
    parentId: '',
    content: TopicContent.Posts,

  },
  {
    id: '2',
    title: 'Коти',
    image: 'images/cat.svg',
    slug: 'cats',
    description: '',
    status: 'active',
    parentId: '',
    content: TopicContent.Posts,
  },
  {
    id: '3',
    title: 'Фармацевтичний довідник',
    image: 'images/drugs.svg',
    slug: 'drugs',
    description: '',
    status: 'active',
    parentId: '',
    content: TopicContent.Posts,
  },
  {
    id: '4',
    title: 'Лабораторні дослідження',
    image: 'images/lab.svg',
    slug: 'lab',
    description: '',
    status: 'active',
    parentId: '',
    content: TopicContent.Posts,
  },
];

export default topics
