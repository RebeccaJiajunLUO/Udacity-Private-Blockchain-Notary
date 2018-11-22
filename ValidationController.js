const SHA256 = require('crypto-js/sha256');
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

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
    this.blocks = [];
    this.mempool = {};
    this.mempoolValid = [];
    this.requestValidation();
    this.validateSignature();
  }

  /**
   * Implement a POST Endpoint to give user a message to sign, url: "/requestValidation"
   */
  requestValidation() {
    this.app.post("/requestValidation", async (req, res) => {
      try {
        // retrieve the address from request
        const walletAddress = req.body.walletAddress;
        // the request should be available for validation for 5 mins (to milliseconds); aka stay in mempool for 5 mins
        // If the user re-submits the same request, the app will return the same request that it is already in the mempool
        const TimeoutRequestsWindowTime = 5*60;

        // check if walletAddress from request is valid
        if (!walletAddress) {
          res.status(400).json({
            success: false,
            message: "Please check your request, which might be empty, undefined, or in a wrong format."
          })
        } else {
          // set up the current timestamp
          const requestTimeStamp = new Date().getTime().toString().slice(0, -3);

          // check if the request is in the mempool already
          let inMempool =  this.mempool.hasOwnProperty(walletAddress)

          // if in Mempool, compare the timestamp. If elapsed time is less than 5 mins, do nothing and return the same messageToSign
          // if not in Mempool, add it to the mempool and issue a new messageToSign
          let timeElapsed = (new Date().getTime().toString().slice(0,-3)) - this.mempool[walletAddress];
          // let requestExpired = timeElapsed - TimeoutRequestsWindowTime

          let messageToSign = null;
          let timeLeft = null;

          if (inMempool) {
            messageToSign = walletAddress + `:` + this.mempool[walletAddress] + `:starRegistry`
            timeLeft = (TimeoutRequestsWindowTime) - timeElapsed;
          } else {
            // add address to the mempool
            this.mempool[walletAddress] = requestTimeStamp
            setTimeout(() => {
              delete this.mempool[walletAddress]
            }, TimeoutRequestsWindowTime*1000);

            messageToSign = walletAddress + `:` + requestTimeStamp + `:starRegistry`
            timeLeft = (TimeoutRequestsWindowTime);
          }

          // Send the message to be signed back in JSON format
          res.json({
            messageToSign: messageToSign,
            validationWindow: timeLeft + " seconds left"
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
        const { message, walletAddress, signature } = req.body;

        // verify if the request is in the mempool by wallet address, and then verify signature
        console.log(this.mempool)
        let inMempool =  this.mempool.hasOwnProperty(walletAddress)
        let isValid = null;
        let requestTimeStamp = null;
        let result = null;
        if (inMempool) {
          requestTimeStamp = this.mempool[walletAddress]
          isValid = bitcoinMessage.verify(message, walletAddress, signature);
          if (isValid) { // the signature is valid
            result = {
              registerStar: true,
              status: {
                address: walletAddress,
                requestTimeStamp: requestTimeStamp,
                message: message,
                validationWindow: 200,
                messageSignature: true
              }
            }
            this.mempoolValid.push(result)
            console.log(this.mempoolValid)

          } else { // the signature is not valid
            result = {
              registerStar: false,
              message: `Your signature is not valid.`
            }
          }
          res.json(result)
        } else {
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
}

/**
 * Exporting the ValidationController class
 * @param {*} app
 */
module.exports = (app) => { return new ValidationController(app);}
