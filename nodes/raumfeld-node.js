
"use strict"


/**
 * This is the node base class for all nodes which are in relation to raumfeld
 */
class Raumfeld_Node
{
  constructor(_RED, _config)
  {
    this.config         = JSON.parse(JSON.stringify(_config))
    this.raumkernelNode = _RED.nodes.getNode(this.config.raumkernel)
    this.raumkernel     = this.raumkernelNode.raumkernel
  }

  /**
   * deep-copy a object
   * @param {Object} _object the object to copy
   * @return {Object} a copy of the object
   */
  copyObject(_object)
  {
    if(_object)
      return JSON.parse(JSON.stringify(_object))
    return null
  }

}

module.exports = Raumfeld_Node

