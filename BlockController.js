const SHA256 = require('crypto-js/sha256');
const Block = require('./Block.js');
const Blockchain = require('./Blockchain.js');
const blockchain = new Blockchain();
const hex2ascii = require('hex2ascii')

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
    this.blocks = [];
    this.initializeMockData();
    this.getBlockByHeight();
    this.postNewBlock();
  }

  /**
   * Implement a GET Endpoint to retrieve a block by index, url: "/block/:index"
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
          res.status(404).json({
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
   * Implement a POST Endpoint to add a new Block, url: "/block"
   */
  postNewBlock() {
    this.app.post("/block", async (req, res) => {
      try {
        // define the star information that will be written into block
        let script = req.body
        script.star.story = Buffer(script.star.story).toString('hex')
        // Check if there is any content. No content no new block
        if (!script) {
          res.status(400).json({
            success: false,
            message: "Please check your request, which might be empty, undefined, or in a wrong format."
          })
        } else {
          // add new block to the chain
          let newBlock = new Block(script)
          await blockchain.addBlock(newBlock)

          // return the block just added
          // note: in response we have to add a storyDecoded which won't be saved into the blockchain
          newBlock.body.star.storyDecoded = hex2ascii(script.star.story)
          res.status(201).send(newBlock)
          }
      } catch (error) {
        res.status(400).json({
          success: false,
          message: `There is an error with creating the new block. Error: ${error}`
        })
      }
    });
  }

  /**
   * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
   */
  initializeMockData() {
    if(this.blocks.length === 0){
      for (let index = 0; index < 10; index++) {
        let blockAux = new Block(`Test Data #${index}`);
        blockAux.height = index;
        blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
        this.blocks.push(blockAux);
      }
    }
  }
}

/**
 * Exporting the BlockController class
 * @param {*} app
 */
module.exports = (app) => { return new BlockController(app);}
