# BookTraq
## CURRENT VERSION: 1.0

BookTraq is a simple Electron desktop application that accepts as input the ISBN-13 number for individual books, then queries the Google Books API for book information, including title, author, publication date, etc.  The app writes this info to a MySQL database (if the user wants to save the data), either entering a new row for new entries or incrementing the Quantity column for books already in the database.  The input text field keeps focus so a book whose ISBN code has been read with a barcode scanner should always end up in the input field; on 13 characters of input, the app queries the API automatically, though the Submit button can always send a query for 10-digit ISBN numbers.  Author and title of each book are saved to the text area.

The code checks for the presence of a flag before displaying the modal popup asking the user whether the data should be saved; this can be set to allow rapid input of a large batch of books.

## Future Improvements: 
1. Manual entry of books not found on the API query via a form with appropriate validation; 
2. Colors and better styling: media queries, dynamic resizing of text area, etc. 
3. Reporting (DataTables?) to allow rapid searching of the database.
4. Improve the security!  Some practices in the application setup are not completely secure.  And put database username and password in a .env file! (already added to .gitignore, but no encryption is in the app yet)
5. Additional user functions: deletion of books (i.e., after a sale or loss of a book), modal-bypass flag setting without altering the code, etc. 
6. Consider a dashboard with a nav bar or buttons to route users to input/reporting pages as desired.
7. Consider authentication code with users and roles so the app can better serve as a point of sale system in a small bookstore or other similar context.
8. Consider a MySQL init singleton so the db connection need not be reinitialized with every query.
9. BUG FIX: focus does not reset on input field after a book isn't found. 
10. BUG FIX: Add better handling of modals if flag is set to allow skipping.
11. General cleanup: fewer return statements, consolidate the modals into a single call, etc.

## Setup:
1. Consult the init.txt file for packages to be installed.  Essentially, this code needs Node.JS with Bootstrap, jQuery, Electron and Sweetalert2 modules installed, along with the MySQL database.
2. Settings are in main.js to allow/suppress full-screen mode and a dev tools debugging panel (note that the autofocus of the text input on application start won't work if the dev tools panel is open).
3. The example.json file contains the results of a query should more data be desired from parsing the JSON. 