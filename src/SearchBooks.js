import React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';

class SearchBooks extends Component {
    static propTypes = {
        shelfBooks: propTypes.array.isRequired,
        addBookToShelf: propTypes.func.isRequired,
        updateBookShelf: propTypes.func.isRequired
    };    
    state = {
        searchResults: []
    }

    getSearchResults = query => {
        if (!query) return this.setState({searchResults: []});
        BooksAPI.search(query)
        .then(books => {
            if (!books || !Array.isArray(books)) return;
            let booksChanged = books.map(book => {
                let bookIndex = this.props.shelfBooks.findIndex(shelfBook => shelfBook.id === book.id);
                book.shelf = (bookIndex === -1) ? 'none' : this.props.shelfBooks[bookIndex].shelf;
                return book;
            });
            this.setState({searchResults: booksChanged})
        });
    }

    changeCategory = e => {
        //console.log(e.target.dataset.bookId);
        //console.log(e.target.options[e.target.selectedIndex].value);
        let selectElement = e.target;
        let newCategory = selectElement.options[selectElement.selectedIndex].value;
        let book = this.state.searchResults.find(book => book.id === selectElement.dataset.bookId);
        book.shelf = newCategory;
        this.setState({books: this.state.searchResults});
        let shelfIndex = this.props.shelfBooks.findIndex(book => book.id === selectElement.dataset.bookId);
        console.log('searchBooks shelfIndex :', shelfIndex);
        shelfIndex === -1 ? this.props.addBookToShelf(book) : this.props.updateBookShelf(book);
    };

    render() {
        console.log('render state', this.state);
        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link className="close-search" to="/">Close</Link>
                    {/*<a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>*/}
                    <div className="search-books-input-wrapper">
                        {/*
                          NOTES: The search from BooksAPI is limited to a particular set of search terms.
                          You can find these search terms here:
                          https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                          However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                          you don't find a specific author or title. Every search is limited by search terms.
                        */}
                        <input type="text" 
                            placeholder="Search by title or author"
                            onChange={event => this.getSearchResults(event.target.value)}
                        />
                    </div>
                </div>
                <div className="search-books-results">
                    <ol className="books-grid">
                        {this.state.searchResults.map(book => (
                            <li key={book.id} onClick={(e) => {/*console.log(e.target)*/}}>
                                <div className="book">
                                    <div className="book-top">
                                        <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                                        <div className="book-shelf-changer">
                                            <select value={book.shelf} data-book-id={book.id} onChange={this.changeCategory}>
                                                <option value="none" disabled>Move to...</option>
                                                <option value="currentlyReading">Currently Reading</option>
                                                <option value="wantToRead">Want to Read</option>
                                                <option value="read">Read</option>
                                                <option value="none">None</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="book-title">{book.title}</div>
                                    {book.authors && (<div className="book-authors">{book.authors[0]}</div>)}
                                </div>
                            </li>                                               
                        ))}
                    </ol>
                </div>
            </div>            
        )
    }    
}
export default SearchBooks;