# Library API Design (Books Resource)
## Endpoints

### 1. Get all books (መጽሐፍትን መዘርዘር)
* **Method:** `GET`
* **Path:** `/books`
* **Description:** 
* **Success Status Code:** `200 OK`
### 2. Get books by author 
* **Method:** `GET`
* **Path:** `/books?author=AuthorName`
* **Description:** 
* **Success Status Code:** `200 OK`
### 3. Get one book by ID 
* **Method:** `GET`
* **Path:** `/books/{id}`
* **Description:**
* **Success Status Code:** `200 OK`
### 4. Create a new book 
* **Method:** `POST`
* **Path:** `/books`
* **Description:** 
* **Request Body Example:**
  ```json
  {
    "title": "Health Economics in Practice",
    "author": "Siwule Abiye",
    "publishedYear": 2026
  }