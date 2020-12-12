# Buyer-Seller-APP

ABOUT THE PROJECT:
Using a third party (Custom-cat) API, an Admin will be able to add Products in his own Collection which will be further added by a Seller in their own collection (allowing modifications in price & name).
A Buyer can only purchase products from Seller, after it is verified by Custom cat for it's stock availability.
A Buyer will be able to see Seller products through Stores created by the Seller.


NOTE: I have shared one module of my project for you to get a better insight of my work. All the other modules are removed in this repo. 
Note the file structure below (which I'm applying to my project), as I have not uploaded (the files) folder wise in this repo.

1. app.js: My index router is called here.
2. routes/index.js: Defined routes for Admin & User product.
3. models/SellerProduct.model.js & models/Product.model.js: Defines the model structure according to Custom-Cat API's.
4. controllers/admin/Product.js: Contains all the API's for Admin-Product.
5. controllers/Product.js: Contains all the API's for Seller & Buyer Product.
6. controllers/Validate.js: Contains validations for Add / Edit Admin & Seller Products.
7. controllers/services/product.service.js: Contains service for Product (to be used within API's).
8. swagger.json: API Documentation is achieved via Swagger.

IDE: VSCode
DB: MongoDB
Language: JS
Platform: Node
Framework: Express

Thank you.
