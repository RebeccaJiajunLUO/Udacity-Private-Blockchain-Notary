const Block = require('./Block.js');
const Blockchain = require('./Blockchain.js');
const blockchain = new Blockchain();
const bitcoinMessage = require('bitcoinjs-message');
const hex2ascii = require('hex2ascii');

/**
 * Controller Definition to encapsulate routes to work with Blockchain ID validation routine
 */

class ValidationController {
  /**
   * Constructor to create a new BlockController, you need to initialize here all your endpoints
   * @param {*} app
   */
  constructor(app) {
    this.app = app;
    this.mempool = {};
    this.mempoolValid = [];
    this.requestValidation();
    this.validateSignature();
    this.postNewBlock();
  }

  /**
   * Implement a POST Endpoint to give user a message to sign, url: "/requestValidation"
   */
  requestValidation() {
    this.app.post("/requestValidation", async (req, res) => {
      try {
        // retrieve the address from request
        const address = req.body.address;
        // the request should be available for validation for 5 mins (to milliseconds); aka stay in mempool for 5 mins
        // If the user re-submits the same request, the app will return the same request that it is already in the mempool
        const TimeoutRequestsWindowTime = 5*60;

        // check if walletAddress from request is valid
        if (!address) {
          res.status(400).json({
            success: false,
            message: "Please check your request, which might be empty, undefined, or in a wrong format."
          })
        } else {
          // set up the current timestamp
          const requestTimeStamp = new Date().getTime().toString().slice(0, -3);

          // check if the request is in the mempool already
          let inMempool =  this.mempool.hasOwnProperty(address)

          // if in Mempool, compare the timestamp. If elapsed time is less than 5 mins, do nothing and return the same messageToSign
          // if not in Mempool, add it to the mempool and issue a new messageToSign
          let timeElapsed = (new Date().getTime().toString().slice(0,-3)) - this.mempool[address];

          let message = null;
          let timeLeft = null;

          if (inMempool) {
            message = address + `:` + this.mempool[address] + `:starRegistry`
            timeLeft = (TimeoutRequestsWindowTime) - timeElapsed;
          } else {
            // add address to the mempool
            this.mempool[address] = requestTimeStamp
            // remove the address from mempool after 5 minutes
            setTimeout(() => {
              delete this.mempool[address]
            }, TimeoutRequestsWindowTime*1000);

            message = address + `:` + requestTimeStamp + `:starRegistry`
            timeLeft = (TimeoutRequestsWindowTime);
          }

          // Send the message to be signed back in JSON format
          res.json({
            address: address,
            requestTimeStamp: requestTimeStamp,
            message: message,
            validationWindow: timeLeft
          })
        }
      } catch (error) {
        res.status(404).json({
          success: false,
          message: `Validation request failed. Error: ${error}`
        })
      }
    });
  }

  /**
   * Implement a POST Endpoint to validate a user's signature, url: "/message-signature/validate"
   */
  validateSignature() {
    this.app.post("/message-signature/validate", async (req, res) => {
      try {
        // parse information from the request body
        const { message, address, signature } = req.body;

        // verify if the request is in the mempool by wallet address, and then verify signature
        let inMempool =  this.mempool.hasOwnProperty(address)
        let isValid = null;
        let requestTimeStamp = null;
        let timeElapsed = null; 
        let result = null;
        let validationWindow = null;
        if (inMempool) { // address found in the mempool
          requestTimeStamp = this.mempool[address]
          timeElapsed = (new Date().getTime().toString().slice(0,-3)) - requestTimeStamp;
          validationWindow = 5*60 - timeElapsed
          isValid = bitcoinMessage.verify(message, address, signature);
          if (isValid) { // the signature is valid
            result = {
              registerStar: true,
              status: {
                address: address,
                requestTimeStamp: requestTimeStamp,
                message: message,
                validationWindow: validationWindow,
                messageSignature: "valid"
              }
            }
            this.mempoolValid.push(result)
          } else { // the signature is not valid
            result = {
              registerStar: false,
              message: `Your signature is not valid.`
            }
          }
          res.json(result)
        } else { // address not found in the mempool
          res.status(404).json({
            success: false,
            message: `Please go to \requestValidation to get a message that you need to sign with your wallet.`
          })
        }
      } catch (error) {
        res.status(404).json({
          success: false,
          message: `Failed to validate your signature. Error: ${error}`
        })
      }
    })
  }

  /**
   * Implement a POST Endpoint to add a new Block, url: "/block"
   */
  postNewBlock() {
    this.app.post("/block", async (req, res) => {
      try {
        // define the star information that will be written into block
        let script = req.body

        // Check if there is any content. No content no new block
        if (!script) {
          res.status(400).json({
            success: false,
            message: "Please check your request, which might be empty, undefined, or in a wrong format."
          })
        } else {
          // verify if the address has passed the validation earlier
          let addressVerified = false;
          this.mempoolValid.forEach((each) => {
            if (script.address === each.status.address) {
              addressVerified = true;
            }
          })

          if (addressVerified) {
            // hex coded the story
            script.star.story = new Buffer.from(script.star.story).toString('hex')
            // add new block to the chain
            let newBlock = new Block(script)
            await blockchain.addBlock(newBlock)

            // return the block just added
            // note: in response we have to add a storyDecoded which won't be saved into the blockchain
            newBlock.body.star.storyDecoded = hex2ascii(script.star.story)
            res.status(201).send(newBlock)
            } else {
              res.status(400).json({
                success: false,
                message: `Your address is not valid. Please go to \requestValidation to start the process.`
              })
            }
          }
      } catch (error) {
        res.status(400).json({
          success: false,
          message: `There is an error with creating the new block. Error: ${error}`
        })
      }
    });
  }
}

/**
 * Exporting the ValidationController class
 * @param {*} app
 */
module.exports = (app) => { return new ValidationController(app);}
