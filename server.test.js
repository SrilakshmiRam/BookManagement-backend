const request = require('supertest');
const app = require('./server'); // Make sure your server is exported correctly

describe('Books API', () => {
  // Test GET /books
  it('should return all books', async () => {
    const response = await request(app).get('/books');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.response)).toBe(true); // Check if response is an array
  });

  // Test POST /books
  it('should insert a new book', async () => {
    const newBook = {
      title: 'New Book',
      authorId: 1,
      genreId: 2,
      pages: 300,
      publishedDate: '2024-01-01'
    };

    const response = await request(app)
      .post('/books')
      .send(newBook);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('data inserted successfully');
  });

  // Test DELETE /books/:id
  it('should delete a book', async () => {
    const response = await request(app).delete('/books/1'); // Assuming book with id 1 exists
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('book deleted successfully');
  });

  // Test PUT /books/:id
  it('should update an existing book', async () => {
    const updatedBook = {
      title: 'Updated Book',
      authorId: 1,
      genreId: 2,
      pages: 350,
      publishedDate: '2024-02-01'
    };

    const response = await request(app)
      .put('/books/1') // Assuming book with id 1 exists
      .send(updatedBook);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('book updated successfully');
  });
});
