import React from 'react';

/**
**  a functional component which returns jsx list of books in a shelf
**  takes 3 props
**      1. bookShelfName - string - name of the book shelf
**      2. books - array of books - books to be listed in the shelf
**      3. onShelfChange - function - to be called when the user changes the shelf of the book
**/
function BookShelf(props) {
    return (
        <div className="bookshelf">
            <h2 className="bookshelf-title">{props.bookShelfName}</h2>
            <div className="bookshelf-books">
                <ol className="books-grid">
                    {props.books.map(book => (
                        <li key={book.id}>
                            <div className="book">
                                <div className="book-top">
                                    <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                                    <div className="book-shelf-changer">
                                        <select value={book.shelf} onChange={(e) => props.onShelfChange(book, e.target.options[e.target.selectedIndex].value)}>
                                            <option value="none" disabled>Move to...</option>
                                            <option value="currentlyReading">Currently Reading</option>
                                            <option value="wantToRead">Want to Read</option>
                                            <option value="read">Read</option>
                                            <option value="none">None</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="book-title">{book.title}</div>
                                {book.authors && <div className="book-authors">{book.authors[0]}</div>}
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}

export default BookShelf;