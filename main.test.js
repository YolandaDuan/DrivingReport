let math = require('./main');

const testPoints = [
  {
    timestamp: "2016-06-21T12:00:00.000Z",
    position: {
      latitude: 60.0004,
      longitude: 20.0001
    },
    speed: 6.3889,
    speed_limit: 8.33
  },
  {
    timestamp: "2016-06-21T12:00:00.000Z",
    position: {
      latitude: 60.0009,
      longitude: 20.0003
    },
    speed: 6.3889,
    speed_limit: 8.33
  },
  {
    timestamp: "2016-06-21T12:00:00.000Z",
    position: {
      latitude: 59.334,
      longitude: 18.0667 
    },
    speed: 6.3889,
    speed_limit: 8.33
  },
  {
    timestamp: "2016-06-21T12:00:00.000Z",
    position: {
      latitude: 59.3323,
      longitude: 18.0666 
    },
    speed: 6.3889,
    speed_limit: 8.33
  },
]

test('calculate the distance of two waypoints if they are same location', () => {
  const waypoint1 = testPoints[0].position;
  expect(math.calculateDist(waypoint1.latitude, waypoint1.latitude, waypoint1.longitude, waypoint1.longitude)).toBe(0);
});

test('calculate the distance between two waypoints', () => {
  expect(math.calculateDist(60.0004, 60.0009, 20.0001, 20.0003)).toBeCloseTo(56.7, 1);
});

test('linear distance between waypoint 1 and 5 is less than ', () => {
  expect(math.calculateDist(59.334, 59.3323, 18.0667, 18.0666)).toBeLessThan(201.12);
});

test('finalCalcu have return values', () => {
  expect(math.calculateReport(testPoints)).toBeDefined();
});