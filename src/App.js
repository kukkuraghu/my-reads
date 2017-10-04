import React from 'react';
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';
import SearchBooks from './SearchBooks';
import BookShelf from './BookShelf';
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
                            	<BookShelf 
                            		bookShelfName="Currently Reading"
                            		books={currentlyReading}
                            		onShelfChange={this.changeCategory}
                            	/>
                            	<BookShelf 
                            		bookShelfName="Want to Read"
                            		books={wantToRead}
                            		onShelfChange={this.changeCategory}
                            	/>
								<BookShelf 
                            		bookShelfName="Read"
                            		books={read}
                            		onShelfChange={this.changeCategory}
                            	/>
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
