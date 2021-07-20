function createEmployeeRecord(employeeData) {
  const [
    firstName,
    familyName,
    title,
    payPerHour
  ] = employeeData;
  const timeInEvents = [];
  const timeOutEvents = [];
  return {
    firstName,
    familyName,
    title,
    payPerHour,
    timeInEvents,
    timeOutEvents
  }
}

function createEmployeeRecords(employeesData) {
  return employeesData.map(createEmployeeRecord);
}

function createTimeEvent(type) {
  return function timeEvent(record, dateStamp) {
    const dateTime = createDateFromStamp(dateStamp)
    const timeRecord = {
      type,
      hour: parseInt(`${dateStamp.slice(11, 13)}00`),
      date: dateStamp.slice(0, 10),
      dateTime
    }
    return Object.assign(
      //{},
      record,
      {
        [`time${type.slice(4)}Events`]: [...record[`time${type.slice(4)}Events`], timeRecord]
      }
    )
  }
}

function createTimeInEvent(record, dateStamp) {
  return createTimeEvent("TimeIn")(record, dateStamp);
}

function createTimeOutEvent(record, dateStamp) {
  return createTimeEvent("TimeOut")(record, dateStamp);
}

function hoursWorkedOnDate(record, date) {
  const searchDate = createDateFromStamp(date)
  const timeIn = record.timeInEvents.find(timeIn => areDatesEqual(searchDate, timeIn.dateTime));
  const timeOut = record.timeOutEvents.find(timeOut => timeOut.dateTime > timeIn.dateTime);
  if (timeIn && timeOut) {
    return (timeOut.dateTime - timeIn.dateTime) / (1000 * 60 * 60);
  }
}

function wagesEarnedOnDate(record, date) {
  return hoursWorkedOnDate(record, date) * record.payPerHour;
}

function allWagesFor(record) {
  const wagesEarnedPerDay = record.timeInEvents.map(timeIn => wagesEarnedOnDate(record, timeIn.date));
  const totalHoursWorked = wagesEarnedPerDay.reduce((acc, curr) => acc + curr, 0);
  return totalHoursWorked;
}

function calculatePayroll(records) {
  return records.reduce((payroll, record) => payroll + allWagesFor(record), 0)
}

function findEmployeeByFirstName(records, firstName) {
  return records.find(record => record.firstName === firstName);
}

// Utils
function areDatesEqual(date1, date2) {
  return date1.getYear() === date2.getYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate();
}

function createDateFromStamp(dateStamp = "") {
  let dateTime;
  if (dateStamp.match(/\d{4}-\d{2}-\d{2} \d{4}/)) {
    const [date, time] = dateStamp.split(' ');
    const [year, month, day] = date.split('-');
    const hours = time.slice(0, 2);
    const minutes = time.slice(2);
    dateTime = new Date(year, month - 1, day, hours, minutes);
  } else if (dateStamp.match(/\d{4}-\d{2}-\d{2}/)) {
    const date = dateStamp
    const [year, month, day] = date.split('-');
    const hours = 0;
    const minutes = 0;
    dateTime = new Date(year, month - 1, day, hours, minutes);
  } else {
    throw new Error(`${dateStamp} is not in a valid datestamp format.`);
  }
  if (!dateTime.getDate()) {
    throw new Error(`${dateStamp} is not a valid date.`)
  }
  return dateTime;
}