import { prisma } from "@/config";
import { Hotel, Room } from "@prisma/client";

async function findAll() : Promise<Hotel[]> {
    return prisma.hotel.findMany()
}

type HotelRooms = Hotel & {Rooms: Room[]}

async function findRoomsByHotelId(id: number) : Promise<HotelRooms> {
    return prisma.hotel.findUnique({
        where: {
            id
        },
        include: {
            Rooms: true,
        }
    })
}

const hotelRepository = {
    findAll,
    findRoomsByHotelId
  };
  
  export default hotelRepository;