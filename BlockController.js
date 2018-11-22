const SHA256 = require('crypto-js/sha256');
const Block = require('./Block.js');
const Blockchain = require('./Blockchain.js');
const blockchain = new Blockchain();
const hex2ascii = require('hex2ascii');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

  /**
   * Constructor to create a new BlockController, you need to initialize here all your endpoints
   * @param {*} app
   */
  constructor(app) {
    this.app = app;
    this.getBlockByHeight();
    this.getStarByHash();
    this.getStarByAddress();
  }

  /**
   * Implement a GET Endpoint to retrieve a block by height, url: "/block/:height"
   */
  getBlockByHeight() {
    this.app.get("/block/:height", async (req, res) => {
      try {
        const block = await blockchain.getBlock(req.params.height)
        if (block) {
          // add the star story decoded to ascii
          block.body.star.storyDecoded = hex2ascii(block.body.star.story)
          res.send(block)
        } else {
          res.status(400).json({
            success: false,
            message: `Block ${req.params.height} is not found.`
          })
        }
      } catch (error) {
        res.status(404).json({
          success: false,
          message: `Block ${req.params.height} is not found.`
        })
      }
    });
  }

  /**
   * Implement a GET Endpoint to retrieve a block by hash, url: "/stars/hash::hash"
   * note: use two semicolons because single semicolon will cause a semicolon prefix to the hash
   */
  getStarByHash() {
    this.app.get("/stars/hash::hash", async (req, res) => {
      try {
        const hash = req.params.hash
        res.send(hash)
      } catch (error) {
        res.status(404).json({
          success: false,
          message: `Failed to find the block by hash. Error: ${error}`
        })
      }
    })
  }

  /**
   * Implement a GET Endpoint to retrieve a block by hash, url: "/stars/address::address"
   * note: use two semicolons because single semicolon will cause a semicolon prefix to the address
   */
  getStarByAddress() {
    this.app.get("/stars/address::address", async (req, res) => {
      try {
        const address = req.params.address
        res.send(address)
      } catch (error) {
        res.status(404).json({
          success: false,
          message: `Failed to find the block by hash. Error: ${error}`
        })
      }
    })
  }
}

/**
 * Exporting the BlockController class
 * @param {*} app
 */
module.exports = (app) => { return new BlockController(app);}
