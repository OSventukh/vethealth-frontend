export default function Page500() {
  return <h2 className="notitification-title">Виникла непередбачувана помилка</h2>;
}

export async function getStaticProps() {
  try {
    return {
      props: {
        general: {
          siteName: 'Vethealth',
          siteDescription: 'Лікувавння та догляд за тваринами',
        },
      },
      revalidate: 1000,
    };
  } catch (error) {
    return {
      props: {
        general: {
          siteName: null,
          siteDescription: null,
          siteUrl: null,
        },
        navigationMenu: null,
      },
    };
  }
}
