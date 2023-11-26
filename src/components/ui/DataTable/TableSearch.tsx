import { Input } from '../input';

type Props = {
  value: string;
  onChange: React.ChangeEventHandler;
};

export default function TableSearch({ value, onChange }: Props) {
  return (
    <div className="flex">
      <Input
        value={value}
        className="max-w-sm rounded-xl"
        placeholder="Пошук..."
        onChange={onChange}
      />
    </div>
  );
}
