export function overlaps(first, second) {
  const firstEnd = first.end + (first.cleanupMinutes ?? 0);
  const secondEnd = second.end + (second.cleanupMinutes ?? 0);
  return first.start < secondEnd &&
    (second.start < firstEnd || (first.cleanupMinutes > 0 && second.start === firstEnd));
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
  if (!booking.roomId || !Number.isFinite(booking.start) || !Number.isFinite(booking.end) ||
      (booking.cleanupMinutes !== undefined &&
       (!Number.isFinite(booking.cleanupMinutes) || booking.cleanupMinutes < 0))) {
    throw new Error('A booking needs a room and finite start and end times');
  }
  if (booking.start >= booking.end) {
    throw new Error('Booking start must be before booking end');
  }
}
