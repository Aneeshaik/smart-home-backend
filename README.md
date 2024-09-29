# Smart Home Project Backend
This backend service is a crucial component of a Smart Home Project, designed to manage the user information. Developed using Node.js and MongoDB, it provides a robust and scalable solution for controlling home devices, managing user authentication, and storing data securely.
## Key Features
* User Authentication
* Room Management
* Device Management
## Technologies Used
* **Node.js:** A JavaScript runtime built on Chrome’s V8 JavaScript engine, used for building the server-side application.

* **Express.js:** A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

* **MongoDB:** A NoSQL database for storing user data, device information, and automation rules.

* **JWT:** JSON Web Tokens for secure user authentication.
## API Endpoints
### User Authentication:
* ``` POST /signup ``` : To Register a new user
* ``` POST /signin ``` : To Login a user
### Room Management:
* ``` GET /houses/${houseId}/rooms/${roomId} ``` : To get room details
### Device Management:
* ``` GET /houses/${houseId}/rooms/${roomId}/devices/${updatedDevice._id} ``` : To get devices details
* ``` PUT /houses/${houseId}/rooms/${roomId}/devices/${updatedDevice._id} ``` : To make changes in devices
## Contributing
**1. Fork and Clone:**  
* Fork the repository and clone it to your local machine.
  
**2. Create a Branch:**  
* Create a new branch for your changes.
 
**3. Make Changes and Submit:**  
* Commit your changes and push them to your forked repository.  
* Open a pull request on GitHub to submit your changes. 
