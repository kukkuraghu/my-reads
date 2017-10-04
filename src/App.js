import React from 'react';
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';
import SearchBooks from './SearchBooks';
import './App.css';

class BooksApp extends React.Component {
	state = {
		books : []
		
		/**
		 * TODO: Instead of using this state variable to keep track of which page
		 * we're on, use the URL in the browser's address bar. This will ensure that
		 * users can use the browser's back and forward buttons to navigate between
		 * pages, as well as provide a good URL they can bookmark and share.
		 */
	}
    componentDidMount() {
        console.log('App componentDidMount called');
        BooksAPI.getAll()
        .then(books => {
        	console.log(books);
        	this.setState({books})
        })
        .catch(error => console.log(error));
    }    	
    changeCategory = e => {
    	console.log(e.target.dataset.bookId);
    	console.log(e.target.options[e.target.selectedIndex].value);
    	let selectElement = e.target;
    	let newCategory = selectElement.options[selectElement.selectedIndex].value;
    	let book = this.state.books.find(book => book.id === selectElement.dataset.bookId);
    	book.shelf = newCategory;
    	this.setState({books: this.state.books});
    	BooksAPI.update(book, newCategory)
    	.then(() => console.log('book updated'));
    };
    addBookToShelf = (book) => {
    	this.state.books.push(book);
    	BooksAPI.update(book, book.shelf)
        .then(() => console.log('book updated'));
    	//this.setState({books: this.state.books});
    };
    updateBookShelf = (book) => {
    	let bookIndex = this.state.books.findIndex(shelfBook => shelfBook.id === book.id);
    	this.state.books[bookIndex].shelf = book.shelf;
    	BooksAPI.update(book, book.shelf)
        .then(() => console.log('book updated'));
    	//this.setState({books: this.state.books});
    };    

	render() {
		//BooksAPI.search('Tolstoy').then(books => console.log(books));
		console.log('app.js state', this.state);
		let currentlyReading = [];
		let wantToRead = [];
		let read = [];
		if (this.state.books) {
			currentlyReading = this.state.books.filter(book => book.shelf === 'currentlyReading');
			wantToRead = this.state.books.filter(book => book.shelf === 'wantToRead');
			read = this.state.books.filter(book => book.shelf === 'read');
		}

		return (
			<div className="app">
				<Route path="/search" render={() => (
					<SearchBooks 
						shelfBooks={this.state.books}
						addBookToShelf={this.addBookToShelf}
						updateBookShelf={this.updateBookShelf}
					/>
				)}/>
                <Route exact path="/" render={() => (
                    <div className="list-books">
                        <div className="list-books-title">
                            <h1>MyReads</h1>
                        </div>
                        <div className="list-books-content">
                            <div>
                                <div className="bookshelf">
                                    <h2 className="bookshelf-title">Currently Reading</h2>
                                    <div className="bookshelf-books">
                                        <ol className="books-grid">
                                        	{currentlyReading.map(book => (
	                                            <li key={book.id} onClick={(e) => {/*console.log(e.target)*/}}>
	                                                <div className="book">
	                                                    <div className="book-top">
	                                                        <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
	                                                        <div className="book-shelf-changer">
	                                                            <select value="currentlyReading" data-book-id={book.id} onChange={this.changeCategory}>
	                                                                <option value="none" disabled>Move to...</option>
	                                                                <option value="currentlyReading">Currently Reading</option>
	                                                                <option value="wantToRead">Want to Read</option>
	                                                                <option value="read">Read</option>
	                                                                <option value="none">None</option>
	                                                            </select>
	                                                        </div>
	                                                    </div>
	                                                    <div className="book-title">{book.title}</div>
	                                                    <div className="book-authors">{book.authors[0]}</div>
	                                                </div>
	                                            </li>                                        		
                                        	))}
                                        </ol>
                                    </div>
                                </div>
                                <div className="bookshelf">
                                    <h2 className="bookshelf-title">Want to Read</h2>
                                    <div className="bookshelf-books">
                                        <ol className="books-grid">
                                        	{wantToRead.map(book => (
	                                            <li key={book.id}>
	                                                <div className="book">
	                                                    <div className="book-top">
	                                                        <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
	                                                        <div className="book-shelf-changer">
	                                                            <select value="wantToRead" data-book-id={book.id} onChange={this.changeCategory}>
	                                                                <option value="none" disabled>Move to...</option>
	                                                                <option value="currentlyReading">Currently Reading</option>
	                                                                <option value="wantToRead">Want to Read</option>
	                                                                <option value="read">Read</option>
	                                                                <option value="none">None</option>
	                                                            </select>
	                                                        </div>
	                                                    </div>
	                                                    <div className="book-title">{book.title}</div>
	                                                    <div className="book-authors">{book.authors[0]}</div>
	                                                </div>
	                                            </li>                                        		
                                        	))}
                                        </ol>
                                    </div>
                                </div>
                                <div className="bookshelf">
                                    <h2 className="bookshelf-title">Read</h2>
                                    <div className="bookshelf-books">
                                        <ol className="books-grid">
                                        	{read.map(book => (
	                                            <li key={book.id}>
	                                                <div className="book">
	                                                    <div className="book-top">
	                                                        <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
	                                                        <div className="book-shelf-changer">
	                                                            <select value="read" data-book-id={book.id} onChange={this.changeCategory}>
	                                                                <option value="none" disabled>Move to...</option>
	                                                                <option value="currentlyReading">Currently Reading</option>
	                                                                <option value="wantToRead">Want to Read</option>
	                                                                <option value="read">Read</option>
	                                                                <option value="none">None</option>
	                                                            </select>
	                                                        </div>
	                                                    </div>
	                                                    <div className="book-title">{book.title}</div>
	                                                    <div className="book-authors">{book.authors[0]}</div>
	                                                </div>
	                                            </li>                                        		
                                        	))}
                                        </ol>
                                    </div>
                                </div>
                            </div>
                            <div className="open-search">
                            	<Link
                        			to="/search"
                    			>
                        			Add a book
                    			</Link>
                                {/*<a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a> */}
                            </div>  
                        </div>
                    </div>
                )}/>
			</div>
		)
	}
}

export default BooksApp
