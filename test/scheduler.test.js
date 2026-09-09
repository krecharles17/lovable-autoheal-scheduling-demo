import test from 'node:test';
import assert from 'node:assert/strict';
import { availableRooms, isAvailable, overlaps, validateBooking } from '../scheduler.js';

test('overlapping intervals conflict', () => {
  assert.equal(overlaps({ start: 10, end: 12 }, { start: 11, end: 13 }), true);
});

test('touching intervals do not conflict', () => {
  assert.equal(overlaps({ start: 10, end: 12 }, { start: 12, end: 14 }), false);
});

test('availability only considers bookings in the requested room', () => {
  const bookings = [{ roomId: 'blue', start: 10, end: 12 }];
  assert.equal(isAvailable(bookings, { roomId: 'red', start: 11, end: 13 }), true);
});

test('availability rejects a conflicting booking', () => {
  const bookings = [{ roomId: 'blue', start: 10, end: 12 }];
  assert.equal(isAvailable(bookings, { roomId: 'blue', start: 11, end: 13 }), false);
});

test('availableRooms returns rooms without conflicts', () => {
  const bookings = [{ roomId: 'blue', start: 10, end: 12 }];
  assert.deepEqual(availableRooms(['blue', 'red'], bookings, { start: 11, end: 13 }), ['red']);
});

test('validation rejects empty and backwards bookings', () => {
  assert.throws(() => validateBooking({ roomId: 'blue', start: 4, end: 4 }));
  assert.throws(() => validateBooking({ roomId: 'blue', start: 5, end: 4 }));
});
