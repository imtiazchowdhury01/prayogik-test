import { convertNumberToBangla } from "./convertNumberToBangla";

export const formatDuration = (duration: any) => {
  const hours = Math.floor(duration / 3600);
  const minutes =  Math.floor((duration % 3600) / 60);

  const parts = [];
  if (hours > 0) parts.push(`${convertNumberToBangla(hours)}ঘণ্টা`);
  if (minutes > 0) parts.push(`${convertNumberToBangla(minutes)}মিনিট`);

  return parts.length > 0 ? parts.join(" ") : null;
};

export function convertDateTimeToBanglaTime(dateString: string) {
  const futureDate = new Date(dateString);
  const now = new Date();

  let diffMs = +futureDate - +now;

  if (diffMs < 0) diffMs = 0;

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  return `${convertNumberToBangla(days)} দিন, ${convertNumberToBangla(
    hours
  )} ঘণ্টা, ${convertNumberToBangla(minutes)} মিনিট`;
}
