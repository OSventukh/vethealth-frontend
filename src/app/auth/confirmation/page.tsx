import Confirmation from '../components/Confirmation';

type Props = {
  searchParams: {
    hash: string;
  };
};
export default function ConfirmationPage({ searchParams }: Props) {
  const { hash } = searchParams;
  return <Confirmation token={hash} />;
}
