# Private Blockchain

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

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
1. Get the information of a block by height

![Image of GET method to get the info of a block](https://github.com/chuanqin3/Udacity-Blockchain-with-NodeJS/blob/master/InstructionPictures/get-block-intro.png)

#### POST
1. Post a new block to the chain

![Image of POST method to create a new block](https://github.com/chuanqin3/Udacity-Blockchain-with-NodeJS/blob/master/InstructionPictures/post-block-intro.png)

2. Request validation for an address

![Image of POST method to request a validation]
(https://github.com/chuanqin3/Udacity-Blockchain-with-NodeJS/blob/master/InstructionPictures/post-request-validation-intro.png)

## Testing simpleChain.js

To test code:
1. Open a command prompt or shell terminal after install node.js.
2. Enter a node session, also known as REPL (Read-Evaluate-Print-Loop).
```
node
.load simpleChain.js
```
3. The `simpleChain.js` will initiate the blockchain for you, and add 10 blocks after Genesis block
4. Validate a block, using Genesis block as an example
```
chain.validateBlock(0);
```
5. Feel free to generate another 10 (or any number you like) blocks using a for loop
```
for (var i = 0; i <= 10; i++) {
  blockchain.addBlock(new Block("test data "+i));
}
```
6. Validate blockchain
```
chain.validateChain();
```
7. Get Block information
```
chain.getBlock(0).then((c)=>{console.log(c)});
```
