# coffee-shop-backend
## Testing
- Create a New Product:
    * Method: POST
    * Endpoint: http://localhost:3000/products
    * Response: 
        ```json
        {
            "name": "Latte",
            "description": "Milk and esspresso",
            "price": 5.5,
            "category": "coffee",
            "stock": null,
            "imageUrl": "",
            "_id": "67618a13b93dc222b513533c",
            "__v": 0
        }
    * Screenshot:
    ![post](</img/post.png>)
- Get all Products:
    * Method: GET
    * Endpoint: http://localhost:3000/products
    * Response:
        ```json
        {
            "_id": "6760ed67ca6da1c127892021",
            "name": "Large Coffee Mug",
            "description": "A large coffee mug, perfect for your morning coffee.",
            "price": 14.99,
            "category": "mugs",
            "stock": 50,
            "imageUrl": "http://example.com/mug.jpg",
            "__v": 0
        },
            {
            "_id": "67618a13b93dc222b513533c",
            "name": "Latte",
            "description": "Milk and esspresso",
            "price": 5.5,
            "category": "coffee",
            "stock": null,
            "imageUrl": "",
            "__v": 0
        }
    * Screenshot:
    ![get all products](</img/getAll.png>)
- Get a Single Product by ID:
    * Method: GET
    * Endpoint: http://localhost:3000/products/67618a13b93dc222b513533c
    * Response:
        ```json
        {
            "_id": "67618a13b93dc222b513533c",
            "name": "Latte",
            "description": "Milk and esspresso",
            "price": 5.5,
            "category": "coffee",
            "stock": null,
            "imageUrl": "",
            "__v": 0
        }
    * Screenshot:
    ![get single product](</img/getSingle.png>)
- Update a Product by ID:
    * Method: PUT
    * Endpoint: http://localhost:3000/products/67618a13b93dc222b513533c
    * Response: 
        ```json
        {
            "_id": "67618a13b93dc222b513533c",
            "name": "Everything Bagel",
            "description": "A fresh baked everything bagel.",
            "price": 3.99,
            "category": "pastry",
            "stock": 43,
            "imageUrl": "http://example.com/everythingBagel.jpg",
            "__v": 0
        }
    * Screenshot:
    ![update product](</img/update.png>)
- Delete a Product by ID:
    * Method: DELETE
    * Endpoint: http://localhost:3000/products/6760ed67ca6da1c127892021
    * Response:
        ```json
        {
            "_id": "6760ed67ca6da1c127892021",
            "name": "Large Coffee Mug",
            "description": "A large coffee mug, perfect for your morning coffee.",
            "price": 14.99,
            "category": "mugs",
            "stock": 50,
            "imageUrl": "http://example.com/mug.jpg",
            "__v": 0
        }
    * Screenshot:
    ![delete product](</img/delete.png>)
