let Calculator = require('./main');

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

const testpoint1 = testPoints[0].position;
const testpoint2 = testPoints[1].position;
const waypoint1 = testPoints[2].position;
const waypoint5 = testPoints[3].position;

// test for calculate distance
describe('calculate distance', () => {
  let calculator = new Calculator();
  it('returns something', () => {
    expect(calculator.calculateReport(testPoints)).toBeDefined();
  });

  it('calculates the distance between two same waypoints', () => {
    expect(calculator.calculateDist(testpoint1.latitude, testpoint1.latitude, testpoint1.longitude, testpoint1.longitude)).toBe(0);
  });

  it('calculates the distance between two different waypoints', () => {
    expect(calculator.calculateDist(testpoint1.latitude, testpoint2.latitude, testpoint1.longitude, testpoint2.longitude)).toBeCloseTo(56.7, 1);
  });

  it('calculates the linear distance between waypoint 1 and 5 is less than the sum of distance between each point', () => {
    expect(calculator.calculateDist(waypoint1.latitude, waypoint5.latitude, waypoint1.longitude, waypoint5.longitude)).toBeLessThan(201.12);
  });
});


// test for calculate report
describe('calculate report', () => {
  it('calls function calculateDist() 3 times', () => {
    let calculator = new Calculator();

    const spy = jest.spyOn(calculator, 'calculateDist');
    let testPointCount = testPoints.length;
    calculator.calculateReport(testPoints);
    expect(spy).toHaveBeenCalledTimes(testPointCount-1);
  });

  it('returns correct report rows when distance between waypoints are 65, 30, 0', () => {
    const secondMs = 1000;
    let time1 = new Date(Date.now());
    let time2 = new Date(time1.getTime() + 10 * secondMs);
    let time3 = new Date(time2.getTime() + 10 * secondMs);
    let time4 = new Date(time3.getTime() + 10 * secondMs);

    let calculator = new Calculator();
    jest.spyOn(calculator, 'calculateDist')
      .mockImplementation(() => 0)
      .mockImplementationOnce(() => 65)
      .mockImplementationOnce(() => 30)
      .mockImplementationOnce(() => 0);

    let { reportRows, reportSummary } = calculator.calculateReport([
      {
        timestamp: time1.toISOString(),
        position: {
          latitude: 60.0004,
          longitude: 20.0001
        },
        speed: 6.3889,
        speed_limit: 5
      },
      {
        timestamp: time2.toISOString(),
        position: {
          latitude: 60.0004,
          longitude: 20.0001
        },
        speed: 6.3889,
        speed_limit: 5
      },
      {
        timestamp: time3.toISOString(),
        position: {
          latitude: 60.0004,
          longitude: 20.0001
        },
        speed: 6.3889,
        speed_limit: 5
      },
      {
        timestamp: time4.toISOString(),
        position: {
          latitude: 60.0004,
          longitude: 20.0001
        },
        speed: 6.3889,
        speed_limit: 5
      }
    ]);

    expect(reportRows.length).toBe(3);
    expect(reportRows).toEqual([
      {
        header: { fromWaypoint: 1, toWaypoint: 2, isSpeeding: true },
        description: { distance: "65.00", speed: "6.50", duration: 10 }
      },
      {
        header: { fromWaypoint: 2, toWaypoint: 3, isSpeeding: false },
        description: { distance: "30.00", speed: "3.00", duration: 10 }
      },
      {
        header: { fromWaypoint: 3, toWaypoint: 4, isSpeeding: false },
        description: { distance: "0.00", speed: "0.00", duration: 10 }
      }
    ]);

    expect(reportSummary).toEqual({
      distSpeeding: 65, 
      duraSpeeding: 10, 
      totDistance: 95, 
      totDuration: 30
    });
  })
});