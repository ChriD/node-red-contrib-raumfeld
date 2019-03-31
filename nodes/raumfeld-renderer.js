
"use strict"


/**
 * This is the node base class for all nodes which are in relation to raumfeld
 */

"use strict"

const Raumfeld_Node  = require('./raumfeld-node.js')


class Raumfeld_Node_Renderer extends Raumfeld_Node
{
  constructor(_RED, _config)
  {
    super(_RED, _config)
  }


   /**
   * returns if a renderer should be considered by the node action
   * @return true if the renderer is mentioned in the node, otherwise false
   */
  considerRenderer(_renderer)
  {
    if(!_renderer)
      return false

    var renderer = this.getSelectedRenderer()
    if(!renderer)
      return false

    if(renderer.udn() == _renderer.udn())
      return true
    return false
  }


  /**
   * returns a renderer object for the given scope and room
   * @return a room or virtual renderer object, may be null if no renderer is found for the given settings!
   */
  getSelectedRenderer()
  {
    var useZoneRenderer = this.config.scope == "ZONE" ? true : false;
    return useZoneRenderer ? this.raumkernelNode.deviceManager.getVirtualMediaRenderer(this.config.roomName) : this.raumkernelNode.deviceManager.getMediaRenderer(this.config.roomName)
  }


    /**
   * returns an array renderer object for the given scope and room
   * @return an array of room or virtual renderer object, may be null if no renderer is found for the given settings!
   */
  getSelectedRenderers()
  {
    // TODO: multiple selection!
    var useZoneRenderer = this.config.scope == "ZONE" ? true : false;
    return [useZoneRenderer ? this.raumkernelNode.deviceManager.getVirtualMediaRenderer(this.config.roomName) : this.raumkernelNode.deviceManager.getMediaRenderer(this.config.roomName)]
  }

  /**
  * returns an identification object usefull for message outputs
  * @param _renderer a media renderer object
  * @return a common object which includes rendere id data
  */
  generateRendererIdentification(_renderer)
  {
    return {
      "name"    : _renderer.name(),
      "udn"     : _renderer.udn(),
      "isZone"  : _renderer.constructor.name == "UPNPMediaRendererRaumfeldVirtual" ? true : false
    }

  }

}

module.exports = Raumfeld_Node_Renderer

