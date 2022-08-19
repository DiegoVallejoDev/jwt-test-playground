export const timeStamp = (date: Date, additionalMilliseconds = 0) => {
  return Math.floor(date.getTime() / 1000) + additionalMilliseconds;
};
export const minutes = (minutes: number) => {
  // returns minutes in miliseconds
  return minutes * 60;
};