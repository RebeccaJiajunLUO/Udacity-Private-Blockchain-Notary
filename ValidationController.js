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
    this.requestValidation();
  }

  /**
   * Implement a GET Endpoint to retrieve a block by index, url: "/requestValidation"
   */
  requestValidation() {
    this.app.post("/requestValidation", async (req, res) => {
      try {
        // retrieve the address from request
        const address = req.body.address;
        if (!address) {
          res.status(400).json({
            success: false,
            message: "Please check your request, which might be empty, undefined, or in a wrong format."
          })
        } else {
          const timeStamp = new Date().getTime().toString().slice(0, -3);
          let messageToSign = null;
          messageToSign = address + `:` + timeStamp + `:starRegistry`
          res.json(messageToSign)
        }
      } catch (error) {
        res.status(404).json({
          success: false,
          message: `Validation request failed. Error: ${error}`
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
