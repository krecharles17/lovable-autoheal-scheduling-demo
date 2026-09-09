export function overlaps(first, second) {
  return first.start < second.end && second.start < first.end;
}

export function isAvailable(bookings, request) {
  return !bookings.some((booking) =>
    booking.roomId === request.roomId && overlaps(booking, request)
  );
}

export function availableRooms(rooms, bookings, request) {
  return rooms.filter((roomId) => isAvailable(bookings, { ...request, roomId }));
}

export function validateBooking(booking) {
  if (!booking.roomId || !Number.isFinite(booking.start) || !Number.isFinite(booking.end)) {
    throw new Error('A booking needs a room and finite start and end times');
  }
  if (booking.start >= booking.end) {
    throw new Error('Booking start must be before booking end');
  }
}
