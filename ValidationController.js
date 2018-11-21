const SHA256 = require('crypto-js/sha256');
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

// Usage instruction
// let address = '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ'
// let signature = 'IJtpSFiOJrw/xYeucFxsHvIRFJ85YSGP8S1AEZxM4/obS3xr9iz7H0ffD7aM2vugrRaCi/zxaPtkflNzt5ykbc0='
// let message = '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532330740:starRegistry'

// console.log(bitcoinMessage.verify(message, address, signature))

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
    this.timeoutRequests = [];
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

        // this.timeoutRequests[walletAddress] = setTimeout(() => {
        //   self.removeValidationRequest(walletAddress)
        // }, TimeoutRequestsWindowTime);

        // req.validationWindow = timeLeft;

        if (!walletAddress) {
          res.status(400).json({
            success: false,
            message: "Please check your request, which might be empty, undefined, or in a wrong format."
          })
        } else {
          // set up the current timestamp
          const requestTimeStamp = new Date().getTime().toString().slice(0, -3);

          // check if the request is in the mempool already
          console.log(this.mempool)
          let inMempool =  this.mempool.hasOwnProperty(walletAddress)
          console.log(inMempool)

          // if in Mempool, compare the timestamp. If elapsed time is less than 5 mins, do nothing and return the same messageToSign
          // if not in Mempool, add it to the mempool and issue a new messageToSign
          let timeElapsed = (new Date().getTime().toString().slice(0,-3)) - this.mempool[walletAddress];
          let requestExpired = timeElapsed - TimeoutRequestsWindowTime

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
        const { address, signature } = req.body;

        let registerStar = null;
        let status = {
          walletAddress: address,
          requestTimeStamp: null,
          message: message,
          validationWindow: null
        }

        // verify the message using Bitcoin Message package
        const isValid = bitcoinMessage.verify(message, address, signature)
      } catch (error) {
        res.status(404).json({
          success: false,
          message: `Failed to validate yoursignature. Error: ${error}`
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
