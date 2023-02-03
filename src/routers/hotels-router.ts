import { getHotels, getRoomsByHotelId } from '@/controllers/hotels-controller';
import { authenticateToken } from '@/middlewares';
import { Router } from 'express';

const hotelRouter = Router();

hotelRouter.all('/*', authenticateToken).get('/', getHotels).get('/:hotelId', getRoomsByHotelId);

export { hotelRouter };
