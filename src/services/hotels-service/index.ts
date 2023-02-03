import { notFoundError } from '@/errors';
import { paymentRequiredError } from '@/errors/payment-required-error';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelRepository from '@/repositories/hotels-repository';
import ticketRepository from '@/repositories/ticket-repository';
import { Hotel } from '@prisma/client';
import httpStatus from 'http-status';

async function verifyUserEnrollmentAndPaidTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  };

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) {
    throw notFoundError();
  };

  if (ticket.status === 'RESERVED' || ticket.TicketType.includesHotel === false) {
    throw paymentRequiredError();
  };
}

async function getAllHotels(userId: number): Promise<Hotel[]> {
  await verifyUserEnrollmentAndPaidTicket(userId);

  const hotels = await hotelRepository.findAll();

  if (!hotels) {
    throw notFoundError();
  }
  if (hotels.length === 0) {
    throw notFoundError();
  }

  return hotels;
}

async function getRoomsByHotelId(userId: number, hotelId: number) {
  await verifyUserEnrollmentAndPaidTicket(userId);

  const hotelWithRooms = await hotelRepository.findRoomsByHotelId(hotelId);

  if (!hotelWithRooms) {
    throw notFoundError();
  }

  return hotelWithRooms;
}

const hotelService = {
  getAllHotels,
  getRoomsByHotelId,
};

export default hotelService;
