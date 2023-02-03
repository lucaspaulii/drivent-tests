import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelRepository from '@/repositories/hotels-repository';
import ticketRepository from '@/repositories/ticket-repository';
import { Hotel } from '@prisma/client';
import httpStatus from 'http-status';

async function verifyUserEnrollmentAndPaidTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) throw notFoundError;

  if (ticket.status === 'RESERVED') throw httpStatus.PAYMENT_REQUIRED;
}

async function getAllHotels(userId: number): Promise<Hotel[]> {
  verifyUserEnrollmentAndPaidTicket(userId);

  const hotels = await hotelRepository.findAll();

  if (!hotels) throw notFoundError();

  return hotels;
}

async function getRoomsByHotelId(userId: number, hotelId: number) {
  verifyUserEnrollmentAndPaidTicket(userId);

  const hotelWithRooms = await hotelRepository.findRoomsByHotelId(hotelId);

  if (!hotelWithRooms) throw notFoundError();

  return hotelWithRooms;
}

const hotelService = {
  getAllHotels,
  getRoomsByHotelId,
};

export default hotelService;
