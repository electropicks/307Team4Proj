export const getBook = async (queryString: string) => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${queryString}`,
  );

  return await response.json();
};
