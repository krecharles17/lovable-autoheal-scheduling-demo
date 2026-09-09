import { expect, test } from 'vitest';
import { availableRooms, isAvailable, overlaps, validateBooking } from '../scheduler.js';

test('overlapping intervals conflict', () => {
  expect(overlaps({ start: 10, end: 12 }, { start: 11, end: 13 })).toBe(true);
});

test('touching intervals do not conflict', () => {
  expect(overlaps({ start: 10, end: 12 }, { start: 12, end: 14 })).toBe(false);
});

test('availability only considers bookings in the requested room', () => {
  const bookings = [{ roomId: 'blue', start: 10, end: 12 }];
  expect(isAvailable(bookings, { roomId: 'red', start: 11, end: 13 })).toBe(true);
});

test('availability rejects a conflicting booking', () => {
  const bookings = [{ roomId: 'blue', start: 10, end: 12 }];
  expect(isAvailable(bookings, { roomId: 'blue', start: 11, end: 13 })).toBe(false);
});

test('availableRooms returns rooms without conflicts', () => {
  const bookings = [{ roomId: 'blue', start: 10, end: 12 }];
  expect(availableRooms(['blue', 'red'], bookings, { start: 11, end: 13 })).toEqual(['red']);
});

test('validation rejects empty and backwards bookings', () => {
  expect(() => validateBooking({ roomId: 'blue', start: 4, end: 4 })).toThrow();
  expect(() => validateBooking({ roomId: 'blue', start: 5, end: 4 })).toThrow();
});

test('cleanup blocks a booking immediately after checkout', () => {
  const bookings = [{ roomId: 'blue', start: 600, end: 720, cleanupMinutes: 30 }];
  expect(isAvailable(bookings, { roomId: 'blue', start: 721, end: 750 })).toBe(false);
});

test('cleanup ends at its exact half-open boundary', () => {
  const bookings = [{ roomId: 'blue', start: 600, end: 720, cleanupMinutes: 30 }];
  expect(isAvailable(bookings, { roomId: 'blue', start: 750, end: 780 })).toBe(true);
});

test('a booking after cleanup is available', () => {
  const bookings = [{ roomId: 'blue', start: 600, end: 720, cleanupMinutes: 30 }];
  expect(isAvailable(bookings, { roomId: 'blue', start: 751, end: 780 })).toBe(true);
});

test('zero cleanup preserves the half-open boundary', () => {
  const bookings = [{ roomId: 'blue', start: 600, end: 720, cleanupMinutes: 0 }];
  expect(isAvailable(bookings, { roomId: 'blue', start: 720, end: 750 })).toBe(true);
});
