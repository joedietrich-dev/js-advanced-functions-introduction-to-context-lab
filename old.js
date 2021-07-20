function createTimeInEvent(record, dateStamp) {
  return createTimeEvent("TimeIn")(record, dateStamp);
  // const timeInFormatted = dateStamp.slice(0, 10) +
  //   'T' + dateStamp.slice(11, 13) +
  //   ':' + dateStamp.slice(-2);
  // const timeIn = new Date(timeInFormatted);
  // const timeInRecord = {
  //   type: "TimeIn",
  //   hour: parseInt(`${dateStamp.slice(11, 13)}00`),
  //   date: dateStamp.slice(0, 10),
  //   dateTime: timeIn
  // }
  // return Object.assign(
  //   {},
  //   record,
  //   {
  //     timeInEvents: [...record.timeInEvents, timeInRecord]
  //   }
  // )

}