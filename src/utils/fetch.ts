const api = 'http://localhost:5000';

export async function fetchData(url: string, options?: RequestInit ) {
  try {
    const response = await fetch(
      `${api}/${url}`,
      options || {
        method: 'GET',
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || 'Somethin went wrong');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
}
