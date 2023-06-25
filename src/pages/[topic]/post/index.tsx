import { GetServerSidePropsContext } from 'next';

export default function index() {
  return <></>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params } = context;
    return {
      redirect: {
        destination: `/${params!.topic}`,
        permanent: true,
      },
    };
  
}
