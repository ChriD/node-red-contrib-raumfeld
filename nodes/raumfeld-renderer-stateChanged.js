/**
 *
 */
module.exports = function(RED) {

    "use strict"

    const Raumfeld_Renderer = require('./raumfeld-renderer.js')


    class Raumfeld_Renderer_StateChanged extends Raumfeld_Renderer
    {
      constructor(_config)
      {
        super(RED, _config)
        var node = this
        RED.nodes.createNode(node, _config)

        function rendererMediaItemDataChanged(_mediaRenderer, _mediaItemData) {
          node.rendererMediaItemDataChanged(_mediaRenderer, _mediaItemData)
        }

        function rendererStateChanged(_mediaRenderer, _rendererState) {
          node.rendererStateChanged(_mediaRenderer, _rendererState)
        }

        function rendererStateKeyValueChanged(_mediaRenderer, _key, _oldValue, _newValue, _roomUdn) {
          node.rendererStateKeyValueChanged(_mediaRenderer, _key, _oldValue, _newValue, _roomUdn)
        }

        node.raumkernel.on("rendererMediaItemDataChanged", rendererMediaItemDataChanged)
        node.raumkernel.on("rendererStateKeyValueChanged", rendererStateKeyValueChanged)
        node.raumkernel.on("rendererStateChanged"        , rendererStateChanged)

        node.on("close", function() {
          node.raumkernel.removeListener("rendererMediaItemDataChanged",  rendererMediaItemDataChanged)
          node.raumkernel.removeListener("rendererStateKeyValueChanged",  rendererStateKeyValueChanged)
          node.raumkernel.removeListener("rendererStateChanged",          rrendererStateChanged)
        })

      }

      rendererMediaItemDataChanged(_mediaRenderer, _mediaItemData)
      {
        var state = this.config.state.toUpperCase()
        var msg   = {}

        // be sure we do only output data for the media renderer defined by the node
        if(!this.considerRenderer(_mediaRenderer))
          return

        // generate media renderer identifier data and include it to the message root
        msg.rendererIdentification = this.generateRendererIdentification(_mediaRenderer)

        if(state == "MEDIAINFO")
          msg.payload = this.copyObject(_mediaItemData)

        if (msg.hasOwnProperty("payload")) this.send(msg)
      }


      rendererStateChanged(_mediaRenderer, _rendererState)
      {
      }


      rendererStateKeyValueChanged(_mediaRenderer, _key, _oldValue, _newValue, _roomUdn)
      {
        var key   = _key.toUpperCase()
        var state = this.config.state.toUpperCase()
        var msg   = {}

        // be sure we do only output data for the media renderer defined by the node
        if(this.config.scope == "ZONE" && _roomUdn)
          return;
        if(!this.considerRenderer(_mediaRenderer))
          return

        // generate media renderer identifier data and include it to the message root
        msg.rendererIdentification = this.generateRendererIdentification(_mediaRenderer)

        if(key == "VOLUME" && state == "VOLUME")
          msg.payload = _newValue
        if(key == "MUTE"   && state == "MUTE")
           msg.payload = _newValue
        if(key == "TRANSPORTSTATE" && state == "ISPLAYING")
           msg.payload = (_newValue == "NO_MEDIA_PRESENT" || _newValue == "STOPPED") ? false : true
        if(key == "CURRENTTRACKURI" && state == "HASMEDIA")
           msg.payload = _newValue ? true : false
        if(state == "ANYSTATE")
           msg.payload = _newValue

        if (msg.hasOwnProperty("payload"))
        {
          msg.rendererStateDetail = {
            key       : _key,
            oldValue  : _oldValue,
            newValue  : _newValue
          }
        }

        if (msg.hasOwnProperty("payload")) this.send(msg)
      }


    }


    RED.nodes.registerType("raumfeld-renderer-stateChanged", Raumfeld_Renderer_StateChanged)
  }