import Room from '../models/room.model.js';

const roomControllers = (io) => ({
  getAllRooms: async (req, res) => {
    try {
      const rooms = await Room.find({}).sort({createdAt:1});
      res.status(200).json(rooms);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  createRoom: async (req,res)=>{
    const {name} = req.body;

    if(!name || name.trim() === "") return res.status(400).json({message:"Room name is required."});

    try {
      let room = await Room.findOne({name:name.trim()});
      if(room){
        return res.status(400).json({message:"Room already exists."});
      }

      room = new Room({name:name.trim()});
      await room.save();
      io.emit('newRoomCreated',room);
      res.status(200).json(room);
    } catch (error) {
      console.error('Error creating room:',error.message);
      res.status(500).json({ message: error.message });
    }
  }
})

export default roomControllers