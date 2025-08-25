# DStore v0.1.0
A data storage server

Made using NodeJS 22.18.0, other versions may not work properly.

Main Page: index.html\
Port: 3000

## Features
As this is version 0.1.0, there are little to no features.
### Encryption
All files are encrypted using a password.
### Upload
Write the filename, data and password to upload a file.
Will fail if:
- Name length is not between 1 and 20 characters
- Name consists entirely of points
- Name contains a slash
- Password is not between 1 and 31 characters
- Name is used by another file
### Retrieve
Write the filename and password to retrieve file data.
Will fail if:
- File doesn't exist
- Password is incorrect

## Server
### Starting the server
Enter the DStore directory and run the command:
```bash
npm start
```
When `Server is listening on port 3000` is printed to the console, you can use the server.
### File Storage
Uploaded files are stored in the `./datastore` directory, which gets made when the server is first run.