import { CategoryResponse } from '@/api/types/categories.type';
import CustomNavigation from '@/components/ui/custom/custom-navigation';

type Props = {
  items: CategoryResponse[];
};
export default function DesktopNavigation({ items }: Props) {
  return <CustomNavigation items={items} />;
}
