// src/utils/timestamp.js

exports.getKstTimestamp = () => {
  const date = new Date();
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const YYYY = kstDate.getUTCFullYear();
  const MM = String(kstDate.getUTCMonth() + 1).padStart(2, "0");
  const DD = String(kstDate.getUTCDate()).padStart(2, "0");
  const hh = String(kstDate.getUTCHours()).padStart(2, "0");
  const mm = String(kstDate.getUTCMinutes()).padStart(2, "0");
  const ss = String(kstDate.getUTCSeconds()).padStart(2, "0");

  return `${YYYY}${MM}${DD}-${hh}${mm}${ss}`;
};