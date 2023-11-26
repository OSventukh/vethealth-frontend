'use client';
import { useState, useTransition } from 'react';
import dynamic from 'next/dynamic';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Lexical = dynamic(() => import('@/components/dashboard/Editor/Lexical'), {
  ssr: false,
});
import { savePostAction } from '../../actions/save-post.action';
import { Button } from '@/components/ui/button';
import {
  BookPlus,
  CircleEllipsis,
  MoreHorizontal,
  Option,
  OptionIcon,
  PanelRightOpen,
  Save,
  Settings,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Multiselect from '@/components/ui/multiselect';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function EditPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();

  const titleChangeHandler = (title: string) => {
    setTitle(title);
  };

  const contentChangeHandler = (content: string) => {
    setContent(content);
  };

  const saveHandler = () => {
    startTransition(async () => {
      const res = await savePostAction({
        title,
        content,
        status: {
          id: '2',
        },
      });
    });
  };
  return (
    <Sheet>
      <Lexical
        onChangeTitle={titleChangeHandler}
        onChangeContent={contentChangeHandler}
      />

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Налаштування статті</SheetTitle>
        </SheetHeader>
        <Label htmlFor="slug">URL адреса</Label>
        <Input id="slug" />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Label htmlFor="topics">Вибрати тему</Label>
        <Multiselect
          id="topics"
          options={[{ value: 'values', label: 'Value' }]}
        />
      </SheetContent>
      <DropdownMenu>
        <DropdownMenuContent className="flex flex-col mb-4 gap-2 justify-center items-center bg-transparent border-none shadow-none">
          <DropdownMenuItem className="focus:bg-transparent" title="Меню">
            <SheetTrigger className="flex justify-center items-center p-0 w-12 h-12 bg-blue-500 hover:opacity-90 rounded-2xl shadow-lg">
              <PanelRightOpen />
            </SheetTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem
            title="Зберегти"
            className="flex justify-center items-center p-0 w-12 h-12 cursor-pointer bg-green-600 hover:opacity-90 focus:bg-green-600 rounded-2xl shadow-lg"
            onClick={saveHandler}
          >
            <Save />
          </DropdownMenuItem>
        </DropdownMenuContent>
        <DropdownMenuTrigger className="fixed flex justify-center items-center bottom-20 right-[calc(100vw/7)] p-0 w-14 h-14 bg-slate-400 transition-all opacity-50 hover:opacity-100 rounded-2xl shadow-lg hover:shadow-2xl">
          <CircleEllipsis />
        </DropdownMenuTrigger>
      </DropdownMenu>
    </Sheet>
  );
}
