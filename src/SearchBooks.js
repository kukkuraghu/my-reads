import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';
import BookShelf from './BookShelf';
import propTypes from 'prop-types';

class SearchBooks extends Component {
    //2 props. shelfBooks - the list of books currently on shelf. onShelfChange - function to be called when the user puts the book in a different shelf.
    static propTypes = {
        shelfBooks: propTypes.array.isRequired,
        onShelfChange: propTypes.func.isRequired
    };
    state = {
        searchResults: []
    }

    //called when the user changes the search string
    getSearchResults = query => {
        //if the query string is empty return from the function after resetting the state to empty searchResults array.
        if (!query) return this.setState({searchResults: []});
        //calls BooksAPI to get the books matching the search terms
        BooksAPI.search(query)
        .then(books => {
            if (!books || !Array.isArray(books)) return;
            //for each book check if the book is there in the shelf.
            const booksUpdated = books.map(book => {
                const foundBook = this.props.shelfBooks.find(shelfBook => shelfBook.id === book.id);
                //if book is already there in the shelf, update the book with shelf info, otherwise make the shelf "none".
                book.shelf = (foundBook) ? foundBook.shelf : 'none';
                return book;
            });
            this.setState({searchResults: booksUpdated})
        });
    };

    /**
    **  This function is called when the user placess the book in a different shelf.
    **  2 params.
    **      currentBook - an object with book prperties.
    **      newShelf - a string representation of the new shelf.
    **/
    changeBookStatus = (currentBook, newShelf) => {
        let book = this.state.searchResults.find(book => book.id === currentBook.id);
        //update the book with new shelf information
        book.shelf = newShelf;
        //refresh the state
        this.setState({books: this.state.searchResults});
        //calls the props.onShelfChange so that the parent component can update the shelf.
        this.props.onShelfChange(currentBook, newShelf);
    };

    render() {
        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link className="close-search" to="/">Close</Link>
                    <div className="search-books-input-wrapper">
                        <input type="text"
                            placeholder="Search by title or author"
                            onChange={event => this.getSearchResults(event.target.value)}
                        />
                    </div>
                </div>
                <BookShelf
                    bookShelfName="Search Results"
                    books={this.state.searchResults}
                    onShelfChange={this.changeBookStatus}
                />
            </div>
        )
    }
}
export default SearchBooks;