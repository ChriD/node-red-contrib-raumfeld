/**
 *
 */
module.exports = function(RED) {

    "use strict"

    const Raumfeld_Renderer = require('./raumfeld-renderer.js')


    class Raumfeld_Renderer_GetState extends Raumfeld_Renderer
    {
      constructor(_config)
      {
        super(RED, _config)
        var node = this
        RED.nodes.createNode(node, _config)

        node.on("input", function(_msg){

          node.curConfig = node.copyObject(node.config)
          node.curConfig.roomName = node.config.roomName || _msg.roomName;
          node.curConfig.scope    = node.config.scope    || _msg.scope;
          node.curConfig.state    = node.config.state    || _msg.state;

          if(!node.curConfig.roomName)
            return
          if(!node.curConfig.scope)
            return
          if(!node.curConfig.state)
            return

          var msg = node.generateMsgForRendererState(node.getSelectedRenderer())
          if (msg.hasOwnProperty("payload")) node.send(msg)
        })

      }


      generateMsgForRendererState(_renderer)
      {
        var msg = {}
        var node = this

        if(_renderer)
        {
          // generate media renderer identifier data and include it to the message root
          msg.rendererIdentification = node.generateRendererIdentification(_renderer)

          switch(node.curConfig.state.toUpperCase())
          {
            case "VOLUME":
              msg.payload = _renderer.rendererState.Volume
              break
            case "MUTE":
              msg.payload = _renderer.rendererState.Mute
              break
            case "MEDIAINFO":
              msg.payload = _renderer.currentMediaItemData
              break
            case "ISPLAYING":
              msg.payload = (_renderer.rendererState.TransportState == "NO_MEDIA_PRESENT" || _renderer.rendererState.TransportState == "STOPPED") ? false : true
              break
            case "HASMEDIA":
              msg.payload = (_renderer.rendererState.CurrentTrackURI) ? true : false
              break
            case "FULLSTATE":
              msg.payload = node.copyObject(_renderer.rendererState)
              break
          }
        }
        else
        {
          node.warn("Could not find renderer '" + node.curConfig.roomName + "'")
        }

        return msg
      }

    }


    RED.nodes.registerType("raumfeld-renderer-getState", Raumfeld_Renderer_GetState)
  }