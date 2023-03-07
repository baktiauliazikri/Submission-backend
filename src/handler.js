const { nanoid } = require('nanoid')
const books = require('./bookShelf')

const addBook = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const id = nanoid(16)
  const updatedAt = new Date().toISOString()
  const insertedAt = updatedAt

  let finished = ''
  if (pageCount === readPage) {
    finished = true
  } else {
    finished = false
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }

  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllBooks = (request, h) => {
  const parameterName = request.query.name
  const parameterQuery = request.query.reading
  const parameterFinished = request.query.finished

  if (parameterName !== undefined) {
    return {
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        })).filter((b) => b.name.toLowerCase().includes(parameterName.toLowerCase()))
      }
    }
  }

  if (parameterQuery !== undefined) {
    if (parseInt(parameterQuery) === 0) {
      return {
        status: 'success',
        data: {
          books: books
            .filter((b) => b.reading === false)
            .map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher
            }))
        }
      }
    }

    if (parseInt(parameterQuery) === 1) {
      return {
        status: 'success',
        data: {
          books: books
            .filter((b) => b.reading === true)
            .map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher
            }))
        }
      }
    }
  }
  if (parameterFinished !== undefined) {
    if (parseInt(parameterFinished) === 0) {
      return {
        status: 'success',
        data: {
          books: books
            .filter((b) => b.finished === false)
            .map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher
            }))
        }
      }
    }

    if (parseInt(parameterFinished) === 1) {
      return {
        status: 'success',
        data: {
          books: books
            .filter((b) => b.finished === true)
            .map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher
            }))
        }
      }
    }
  }

  const response = h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  })
  response.code(200)
  return response
}

const getBookById = (request, h) => {
  const { id } = request.params
  const book = books.filter((n) => n.id === id)[0]

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book
      }
    })
    response.code(200)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookById = (request, h) => {
  const { id } = request.params

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  const updatedAt = new Date().toISOString()

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const index = books.findIndex((book) => book.id === id)

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading
    }

    if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt
      }

      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
      })
      response.code(200)
      return response
    }
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBookById = (request, h) => {
  const { id } = request.params

  const index = books.findIndex((book) => book.id === id)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById
}
