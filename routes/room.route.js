import { Router } from "express";
import roomControllers from "../controllers/room.controller.js";

const createRoomRoutes = (io) =>{
  const router  = Router();
  const controller = roomControllers(io);

  router.get('/all',controller.getAllRooms);
  router.post('/create',controller.createRoom);

  return router;
}

export default createRoomRoutes