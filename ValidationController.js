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
    this.initializeMockData();
    this.getBlockByHeight();
    this.postNewBlock();
  }

}