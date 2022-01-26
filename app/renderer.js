//require('jquery');
const exec = require('child_process').exec;
const swal = require('sweetalert2');
const mysql = require('mysql');

resetForm();
// allow manual entry...
const submitButton = document.getElementById('submit');
submitButton.addEventListener('click', () => {
    const isbn = document.getElementById('isbn').value;
    const book = parseBookData(isbn, processBook);
});
// ...but prefer auto check once the ISBN13 is complete: 
const isbn_textbox = document.getElementById('isbn'); 
isbn_textbox.addEventListener('input', () => { 
    const isbn = document.getElementById('isbn').value;
    if (isbn.length === 13) { 
        const book = parseBookData(isbn, processBook);
	}
});
function parseBookData(isbn, callback) { 
	if (isbn.length === 0) return; 
	const commandString = `curl 'https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}'`;
	exec(commandString, (err, stdout, stderr) => {
		if (err) {
			console.error(`exec error: ${err}`);
			return;
		}
        // TODO need error handling for books not found; what does stdout look like then?
		let bookinfo = JSON.parse(stdout);
		if (bookinfo.totalItems == 0) { 
			swal.fire({
				text: 'Book not found!', 
				icon: 'error'
			}).then(() => {
				isbn_textbox.value = '';
			});
			// TODO error handling for books not found (once added, offer redirect to manual entry form)
			return; // TODO make this an if/else instead? 
		}
		let volumeInfo = bookinfo.items[0].volumeInfo;
		let book = {};
		let authors = '';
		// some books have titles but no authors (see ISBN 9789510244627 for an example)!
		if (volumeInfo.authors) { 
			volumeInfo.authors.forEach((value, index) => {
				authors += value;
				if (index != volumeInfo.authors.length - 1) {
					authors += ', ';
				}
			});
		}
		book.authors = authors; 
		let categories = '';
		if (volumeInfo.categories != null && volumeInfo.categories.length > 0) { 
			volumeInfo.categories.forEach((value, index) => {
				categories += value;
				if (index != volumeInfo.categories.length - 1) {
					categories += ', ';
				}
			});
		}
		book.categories = categories;
		let ids = volumeInfo.industryIdentifiers;
        // TODO do I need to check for more identifiers? 
		let isbn10 = isbn13 = '';
		ids.forEach((value) => {
			if (value.type === 'ISBN_10') { // TODO might need to submit manually if only 10 digits... 
				isbn10 = value.identifier;
			}
			else if (value.type === 'ISBN_13') {
				isbn13 = value.identifier;
			}
		});
		[book.isbn10, book.isbn13, book.language, book.pageCount]  = [isbn10, isbn13, volumeInfo.language, volumeInfo.pageCount];
		[book.printType, book.publishedDate] = [volumeInfo.printType, volumeInfo.publishedDate];
		[book.subtitle, book.title] = [volumeInfo.subtitle, volumeInfo.title];
		let details = book.title + ' by ' + ((book.authors) ? book.authors : 'unknown author(s)');
		document.getElementById('booksSearched').innerHTML += details + "\n";
		callback(book);
    });
}
function processBook(book) { 
	let canSkipModal = false; // set to true for fast insertions; TODO put this value in a .env and fix its side effects 
	// console.log(`book is ${book}`);  // debugging the object 
	if (book && !canSkipModal) { 
		swal.fire({ // TODO add option to delete (for a sale, loss, etc.); maybe chain another swal with comment box for reason
			text: book.title + ((book.subtitle) ? (' ' + book.subtitle) : '') + ' by ' + ((book.authors) ? book.authors : 'unknown author(s)'), 
			icon: 'info', 
			showCancelButton: true,
			confirmButtonText: 'Add to Database', 
		}).then((result) => {
			if (result.isConfirmed) { 
				addToDatabase(book); 
			}
			else if (result.dismiss === swal.DismissReason.cancel) { 
				swal.fire({
					text: 'Canceled; book not added.', 
					icon: 'warning'
				}).then(() => {
					resetForm();
				});
			}
		});
	} else if (book) { 
		addToDatabase(book);
	}
}
// TODO these will also have to come from .env files not in source control 
function addToDatabase(book) { // TODO can we move the connection out of here, maybe make it a singleton? 
	const connection = mysql.createConnection({
		host: 'localhost', 
		user: 'booktraq', 
		password: 'booktraq', 
		database: 'booktraq'
	});
	connection.connect(function(err) { 
		if (err) { 
			console.log(err); 
			return; 
		}
		// note that some dupe isbns have been issued for different books.  note also that 
		// a title might change slightly with issuing of new editions and that makes 
		// title a poor match string.  
		let query = 'SELECT COUNT(Id) AS Total, Id FROM Book WHERE (ISBN13=? OR ISBN10=?)'; 
		//console.log(query);
		connection.query(query, [book.isbn13, book.isbn10], function(err, result) { 
			if (err) { 
				console.log(err); 
				return;
			}
			//console.log(result); 
			if (result[0].Total == 0) { // book is not in inventory, so add it
				query = 'INSERT INTO Book (Title, Subtitle, Authors, PrintType, PublicationDate, Language, ' + 
					'PageCount, ISBN10, ISBN13, Quantity, DateAdded) VALUES (?)';
				//console.log(query);
				let values = [book.title, book.subtitle, book.authors, book.printType, book.publishedDate, book.language, 
					book.pageCount, book.isbn10, book.isbn13, 1, new Date()];
				connection.query(query, [values], function(err, result) { 
					if (err) { 
						console.log(err); 
						return; 
					}
					else { 
						swal.fire({
							text: 'Added to database!', 
							icon: 'success'
						}).then(() => {
							resetForm();
						});
					}
				});
			}
			else { // the book IS in the inventory, so update the quantity
				// update
				query = 'UPDATE Book SET Quantity = Quantity + 1 WHERE Id=?'; // consider adding a comment with the date 
				//console.log(query);
				let id = result[0].Id;
				connection.query(query, id, function(err, result) { 
					if (err) { 
						console.log(err); 
						return false;
					}
					else { 
						swal.fire({
							text: 'Book quantity updated!', 
							icon: 'success'
						}).then(() => {
							resetForm();
						});
					}
				});
			}
		});
	});
}
function resetForm() { 
	document.getElementById('isbn').value = ''; 
	document.getElementById('isbn').focus(); 
}
