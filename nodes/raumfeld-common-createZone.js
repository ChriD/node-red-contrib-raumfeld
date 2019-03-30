/**
 *
 */
module.exports = function(RED) {

    "use strict"

    const Raumfeld_Node = require('./raumfeld-node.js')


    class Raumfeld_Common_CreateZone extends Raumfeld_Node
    {
      constructor(_config)
      {
        super(RED, _config)
        var node = this
        RED.nodes.createNode(node, _config)

        node.on("input", function(_msg){

          // check if zone which should be created exists as given in the parameters
          // if not we have to create the zone and we have to await until its finished
          if(!node.existsZone())
            node.createZone()



          /*
          node.config.roomName = node.config.roomName || _msg.payload.roomName;
          node.config.scope    = node.config.scope    || _msg.payload.scope;
          node.config.state    = node.config.state    || _msg.payload.state;

          if(!node.config.roomName)
            return
          if(!node.config.scope)
            return
          if(!node.config.state)
            return

          var msg = node.generateMsgForRendererState(node.getSelectedRenderer())
          if (msg.hasOwnProperty("payload")) node.send(msg)
          */
        })

      }

      existsZone()
      {
        var nodeRoomNames = []
        var zoneMap       = this.raumkernel.managerDisposer.zoneManager.zoneMap

        for(let idx=0; idx<this.config.rooms.length; idx++)
          nodeRoomNames.push(this.config.rooms[idx].roomName.toUpperCase())

        // run trough all zones and check if there is an exact match for the rooms giben in the parameter
        for (const [key, value] of zoneMap.entries())
        {
          var zoneRoomNames = []

          for (const [roomKey, roomValue] of value.rooms.entries())
            zoneRoomNames.push(roomValue.name.toUpperCase())

          // check size of both arrays, they have to be the same for an exact match!
          if(nodeRoomNames.length == zoneRoomNames.length)
          {
            // sort and join for easy match checking
            if(nodeRoomNames.sort().join(',') === zoneRoomNames.sort().join(','))
              return true
          }
        }
        return false
      }


      async createZone()
      {
        var firstRoomUdn = ""

        for(let idx=0; idx<this.config.rooms.length; idx++)
        {
          var roomUDN = this.raumkernel.managerDisposer.zoneManager.getRoomUdnForMediaRendererUDN(this.config.rooms[idx].roomName)
          if(!roomUDN)
            this.warn("Room '" + this.config.rooms[idx].roomName + "' not found in raumfeld system")
          // create a new zone for the first room
          if(idx === 0)
          {
            try
            {
              firstRoomUdn = roomUDN
              await this.raumkernel.managerDisposer.zoneManager.connectRoomToZone(roomUDN, "", true)
            }
            catch(_exception)
            {
              this.warn("Create zone error: " + _exception.toString())
            }
          }
          else
          {
            try
            {
              let zoneUDN = this.raumkernel.managerDisposer.zoneManager.getZoneUDNFromRoomUDN(firstRoomUdn);
              await this.raumkernel.managerDisposer.zoneManager.connectRoomToZone(roomUDN, zoneUDN, true)
            }
            catch(_exception)
            {
              this.warn("Create zone error: " + _exception.toString())
            }
          }
        }
      }



    }


    RED.nodes.registerType("raumfeld-common-createZone", Raumfeld_Common_CreateZone)
  }