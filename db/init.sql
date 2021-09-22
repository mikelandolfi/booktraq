--assumes MySQL is already installed. 
--naturally, you should update usernames and passwords on install! 
CREATE DATABASE booktraq; 
CREATE USER 'booktraq'@'localhost' IDENTIFIED BY 'booktraq';
GRANT ALL PRIVILEGES ON booktraq.* TO 'booktraq'@'localhost';
CREATE DATABASE booktraq; 
USE booktraq; 
--in the future, other tables can be created if the user wants to expand beyond books based on the printType field value
CREATE TABLE Book(
    Id INT NOT NULL AUTO_INCREMENT, 
    Title VARCHAR(100) NOT NULL, 
    Subtitle VARCHAR(300), 
    Authors VARCHAR(100) NOT NULL, 
    PrintType VARCHAR(30), 
    PublicationDate VARCHAR(10), 
    Language VARCHAR(5), 
    PageCount INT(20),
    ISBN10 VARCHAR(10), 
    ISBN13 VARCHAR(13),
    Quantity INT(4),
    DateAdded DATETIME NOT NULL,
    IsDeleted BIT(1),
    DateDeleted DATE,
    ReasonDeleted VARCHAR(100), 
    Source VARCHAR(300), 
    Comment VARCHAR(300),
    PRIMARY KEY (Id)
);