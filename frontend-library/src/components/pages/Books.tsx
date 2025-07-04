// import React from 'react'

import { useGetBooksQuery } from "../redux/api/books.api";


export default function Books ()
{
  const { data, isLoading, isError } = useGetBooksQuery();
  console.log(data)
  return (
    <div>
      Books
    </div>
  )
}
