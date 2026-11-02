
const express = require('express');

const app = express();

const PORT = 3000;

app.use(express.json());

let books = [];
app.post('/books', (req, res) => {

    console.log("POST API called!");
    console.log(req.body);

    const { id, title, author, category, quantity, availability } = req.body;

    const newBook = {
        id,
        title,
        author,
        category,
        quantity,
        availability
    };

    books.push(newBook);

    console.log(books);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});
app.get('/books', (req, res) => {

    res.status(200).json(books);

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
