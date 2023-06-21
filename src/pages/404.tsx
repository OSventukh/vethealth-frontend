export default function Page404() {
  return (
    <h2 className='notitification-title'>This page not found</h2>
  )
}

export async function getStaticProps(context) {
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
          siteUrl: null
        },
        navigationMenu: null
      }
    }
  }
}