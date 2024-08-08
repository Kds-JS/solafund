export function getTimeRemaining(targetTimestamp: number) {
  const now = new Date().getTime();
  const timeDifference = targetTimestamp - now;

  if (timeDifference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      end: true,
    };
  }

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    end: false,
  };
}

export function getDateTimestamp(date: Date): number {
  const timestamp = date.getTime();
  const timestampInSeconds = Math.floor(timestamp / 1000);
  return timestampInSeconds;
}
