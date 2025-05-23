export const formatDate = (date: Date | null | undefined) => {
  if (!date) {
    return date;
  }
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("es-MX", options);
};
