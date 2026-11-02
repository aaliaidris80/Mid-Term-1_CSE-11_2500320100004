import express from 'express';
const app = express();
const PORT = 3000;
app.use(express.json());

let books = [
    {
        "id" : 101,
        "title" : "Java Programming" , 
        "author" : "Herbet Schildt",
        "category" : "Programming",
        "quantity" : 5,
        "available" : 5
    }
];

app.post('/api/books', (req, res) => {
    const { id, title, author, category, quantity, available } = req.body;

    if (!id || !title || !author || quantity === undefined || available === undefined) {
        return res.status(400).json({ 
            error: "Missing required fields." 
        });
    }

    if (typeof quantity !== 'number' || typeof available !== 'number' || quantity < 0 || available < 0) {
        return res.status(400).json({ 
            error: "Quantity and available fields must be valid numbers greater than or equal to 0." 
        });
    }

    const existingBook = books.find(book => book.id === id);
    if (existingBook) {
        return res.status(400).json({ 
            error: `A book with ID ${id} already exists.` 
        });
    }

    const newBook = {
        id,
        title,
        author,
        category: category || "General",
        quantity,
        available
    };
    books.push(newBook);

    return res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});


app.get('/api/books', (req, res) => {
    if (books.length === 0) {
        return res.status(200).json({
            message: "No books available in the library at the moment.",
            books: []
        });
    }
    
    return res.status(200).json({
        count: books.length,
        books: books
    });
});


app.get('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);

    if (!book) {
        return res.status(404).json({
            error: `Book with ID ${bookId} not found.`
        });
    }

    return res.status(200).json({
        book: book
    });
});

app.put('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);


    if (bookIndex === -1) {
        return res.status(404).json({ error: "Book not found" });
    }

    const { title, author, category, quantity, available } = req.body;


    books[bookIndex] = {
        ...books[bookIndex],
        title: title !== undefined ? title : books[bookIndex].title,
        author: author !== undefined ? author : books[bookIndex].author,
        category: category !== undefined ? category : books[bookIndex].category,
        quantity: quantity !== undefined ? quantity : books[bookIndex].quantity,
        available: available !== undefined ? available : books[bookIndex].available
    };

    return res.status(200).json({
        message: "Book updated successfully",
        book: books[bookIndex]
    });
});

app.delete('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) {
        return res.status(404).json({ error: "Book not found" });
    }
    const book = books[bookIndex];

    if (book.available < book.quantity) {
        return res.status(400).json({ 
            error: "Cannot delete book. One or more copies are currently checked out." 
        });
    }
    const deletedBook = books.splice(bookIndex, 1);
    return res.status(200).json({
        message: "Book deleted successfully",
        book: deletedBook[0]
    });
});
app.get('/api/books/search', (req, res) => {
    const titleQuery = req.query.title;

    if (!titleQuery) {
        return res.status(400).json({ error: "Title query parameter is required." });
    }

    const matchingBooks = books.filter(book => 
        book.title.toLowerCase().includes(titleQuery.toLowerCase())
    );

    return res.status(200).json({
        count: matchingBooks.length,
        books: matchingBooks
    });
});
app.patch('/api/books/:id/issue', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }

    if (book.available <= 0) {
        return res.status(400).json({ error: "No copies available to issue" });
    }

    book.available -= 1;

    return res.status(200).json({
        message: "Book issued successfully",
        book: book
    });
});
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});