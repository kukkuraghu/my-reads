import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';
import SearchBooks from './SearchBooks';
import BookShelf from './BookShelf';
import './App.css';

class BooksApp extends Component {
	//a state with books array - array of books in the bookshelf.
	state = {
		books : []
	}
    componentDidMount() {
        //make the API call to get the books on the shelf
        BooksAPI.getAll()
        .then(books => {
        	console.log(books);
        	this.setState({books})
        })
        .catch(error => console.log(error));
    }

    /**
    **This function is called when the user placess the book in a different shelf.
	**  2 params.
    **      currentBook - an object with book prperties.
    **      newShelf - a string representation of the new shelf.
    **/
    changeShelf = (currentBook, newShelf) => {
    	//check if the currentBook is already there in the shelf
    	let shelfBook = this.state.books.find(book => book.id === currentBook.id);
    	if (shelfBook) {
    		//currentBook is already there in the shelf. Update the shelf info and refresh state.
    		shelfBook.shelf = newShelf;
    		this.setState({books: this.state.books});
    	}
    	else {
    		//currentBook is not there in the shelf. Update the shelf info and refresh state.
    		shelfBook = currentBook;
    		shelfBook.shelf = newShelf;
    		this.setState(prevState => ({books: prevState.books.concat(shelfBook)}))
    	}
    	//update the database with updated info.
    	BooksAPI.update(shelfBook, currentBook.shelf)
    	.then(() => console.log('book updated'));
    };

	render() {
		const currentlyReading = this.state.books.filter(book => book.shelf === 'currentlyReading');
		const wantToRead = this.state.books.filter(book => book.shelf === 'wantToRead');
		const read = this.state.books.filter(book => book.shelf === 'read');
		return (
			<div className="app">
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
                            		onShelfChange={this.changeShelf}
                            	/>
                            	<BookShelf
                            		bookShelfName="Want to Read"
                            		books={wantToRead}
                            		onShelfChange={this.changeShelf}
                            	/>
								<BookShelf
                            		bookShelfName="Read"
                            		books={read}
                            		onShelfChange={this.changeShelf}
                            	/>
                            </div>
                            <div className="open-search">
                            	<Link
                        			to="/search"
                    			>
                        			Search for books
                    			</Link>
                            </div>
                        </div>
                    </div>
                )}/>
				<Route path="/search" render={() => (
					<SearchBooks
						shelfBooks={this.state.books}
						onShelfChange={this.changeShelf}
					/>
				)}/>
			</div>
		);
	}
}

export default BooksApp
