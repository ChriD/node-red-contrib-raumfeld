/**
 *
 */
module.exports = function(RED) {

    "use strict"

    const Raumfeld_Renderer = require('./raumfeld-renderer.js')


    class Raumfeld_Renderer_LoadRessource extends Raumfeld_Renderer
    {
      constructor(_config)
      {
        super(RED, _config)
        var node = this
        RED.nodes.createNode(node, _config)

        node.on("input", function(_msg){

          node.config.roomName        = node.config.roomName        || _msg.roomName
          node.config.scope           = node.config.scope           || _msg.scope
          node.config.ressourceType   = node.config.ressourceType   || _msg.ressourceType
          node.config.ressourceValue  = node.config.ressourceValue  || _msg.ressourceValue || _msg.payload

          if(!node.config.roomName)
            return
          if(!node.config.scope)
            return
          if(!node.config.ressourceType)
            return
          if(!node.config.ressourceValue)
            return

          // TODO: allow set of random / repeat --> make defined rF object?

          node.loadRessource(node.getSelectedRenderer())

          // redirect incoming mesage directly to output
          if (_msg.hasOwnProperty("payload")) node.send(_msg)
        })

      }


      async loadRessource(_renderer)
      {
        var msg = {}
        var node = this

        // only virtual renderers are allowed here because only virtual renderers does have the
        // ability to load ressources
        // TODO: check if virtual

        if(_renderer)
        {
          try
          {
            switch(node.config.ressourceType.toUpperCase())
            {
              case "PLAYLIST":
                await _renderer.loadPlaylist(node.config.ressourceValue, 1, true)
                break
              case "CONTAINER":
                await _renderer.loadContainer(node.config.ressourceValue, "", 1, false, true)
                break
              case "SINGLE":
                await _renderer.loadSingle(node.config.ressourceValue, "", false, true)
                break
              case "LINEIN":
                await _renderer.loadSingle(node.config.ressourceValue, true)
                break
              case "URL":
                await _renderer.loadUri(node.config.ressourceValue, false, true)
                break
              case "SHUFFLE":
                await _renderer.loadShuffle(node.config.ressourceValue, "", false, true)
                break
            }
          }
          catch(_exception)
          {
            node.warn(_exception.toString())
          }
        }
        else
        {
          node.warn("Could not find renderer for '" + node.config.roomName + "'")
        }

        return msg
      }

    }


    RED.nodes.registerType("raumfeld-common-loadRessource", Raumfeld_Renderer_LoadRessource)
  }