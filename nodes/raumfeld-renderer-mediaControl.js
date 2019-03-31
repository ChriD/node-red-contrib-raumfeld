/**
 *
 */
module.exports = function(RED) {

    "use strict"

    const Raumfeld_Renderer = require('./raumfeld-renderer.js')


    class Raumfeld_Renderer_MediaControl extends Raumfeld_Renderer
    {
      constructor(_config)
      {
        super(RED, _config)
        var node = this
        RED.nodes.createNode(node, _config)

        node.on("input", function(_msg){

          node.config.roomName  = node.config.roomName || _msg.roomName;
          node.config.scope     = node.config.scope    || _msg.scope;
          node.config.action    = node.config.action   || _msg.action;

          if(!node.config.roomName)
            return
          if(!node.config.scope)
            return
          if(!node.config.action)
            return

          node.doAction(node.getSelectedRenderers())

          // redirect incoming mesage directly to output
          if (_msg.hasOwnProperty("payload")) node.send(_msg)
        })

      }


      doAction(_renderers)
      {
        var msg = {}
        var node = this

        if(_renderers.length)
        {
          for(var idx=0; idx<_renderers.length; idx++)
          {
            var renderer = _renderers[idx]
            switch(node.config.action.toUpperCase())
            {
              case "PLAY":
                renderer.play()
                break
              case "PAUSE":
                renderer.pause()
                break
              case "STOP":
                renderer.stop()
                break
              case "NEXT":
                renderer.next()
                break
              case "PREV":
                renderer.prev()
                break
              case "PLAYMODE":
                renderer.setPlayMode(node.config.playmode.toUpperCase())
                break
            }
          }
        }
        else
        {
          node.warn("Could not find renderer for '" + node.config.roomName + "'")
        }

        return msg
      }

    }


    RED.nodes.registerType("raumfeld-renderer-mediaControl", Raumfeld_Renderer_MediaControl)
  }