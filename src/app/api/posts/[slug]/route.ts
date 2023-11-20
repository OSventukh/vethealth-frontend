const baseUrl = process.env.API_SERVER;

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const response = await fetch(`${baseUrl}/posts?slug=${params.slug}`);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }
    return Response.json(result);
  } catch (error) {
    return Response.error();
  }
}
