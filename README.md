# Private Blockchain Star Notary Service

A service that allows users to claim ownership of their favorite star in the night sky. It is the 4th project for Udacity's Blockchain Nanodegree program.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node.js and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

Node.js framework: **Express.js**[https://expressjs.com/]

### Configuring your project

- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```
*Note: the entry point is `app.js`*
- Install crypto-js with --save flag to save dependency to our package.json file
```
npm install crypto-js --save
```
- Install level with --save flag
```
npm install level --save
```
- Install Express.js with --save flag
```
npm install express --save
```
- Install hex2ascii with --save flag
```
npm install hex2ascii --save
```
```
npm i bitcoinjs-message --save
```
```
npm i bitcoinjs-lib --save OR npm i --ignore-scripts bitcoinjs-lib --save
```
## Testing Node.js server
To start the server:
```
node app.js
```
The sever will run on http://localhost:8000/

### Endpoints
Below is an instruction of how to use Postman to test the endpoints:
#### GET
1. Get a block by height

Example #1
![Image of GET method to get the info of a block by height](https://github.com/chuanqin3/Udacity-Private-Blockchain-Notary/blob/master/InstructionPictures/get-block-intro.png)

Example #2
![Image of GET method to get the info of a block by height](https://github.com/chuanqin3/Udacity-Private-Blockchain-Notary/blob/master/InstructionPictures/get-block-by-height.png)

2. Get a block by hash

![Image of GET method to get the info of a block by hash](https://github.com/chuanqin3/Udacity-Private-Blockchain-Notary/blob/master/InstructionPictures/get-block-by-hash.png)

#### POST
1. Register a new star's information in the chain

![Image of POST method to create a new block](https://github.com/chuanqin3/Udacity-Private-Blockchain-Notary/blob/master/InstructionPictures/post-block-intro-2.png)

2. Request validation for an address

Step 1) Install Electrum Wallet and copy the receiving address:
![Image of POST method to request a validation](https://github.com/chuanqin3/Udacity-Private-Blockchain-Notary/blob/master/InstructionPictures/post-request-validation-intro-1.png)

Step 2) Go to Postman and paste your receiving address in the body of request and click 'Send'

![Image of POST method to request a validation](https://github.com/chuanqin3/Udacity-Private-Blockchain-Notary/blob/master/InstructionPictures/post-request-validation-intro-4.png)

Step 3) Copy the `message` from the JSON output and use Electrum Wallet to sign this message

![Image of POST method to request a validation](https://github.com/chuanqin3/Udacity-Private-Blockchain-Notary/blob/master/InstructionPictures/post-request-validation-intro-3.png)

Step 4) Copy the `Signature`, `address`, and `message`, then paste them into the body of a request to `/message-signature/validate`

![Image of POST method to request a validation](https://github.com/chuanqin3/Udacity-Private-Blockchain-Notary/blob/master/InstructionPictures/post-request-validation-intro-5.png)
