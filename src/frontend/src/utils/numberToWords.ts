const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function convertHundreds(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ones[n];
  if (n < 100) {
    return `${tens[Math.floor(n / 10)]}${n % 10 !== 0 ? ` ${ones[n % 10]}` : ""}`;
  }
  return `${ones[Math.floor(n / 100)]} Hundred${n % 100 !== 0 ? ` ${convertHundreds(n % 100)}` : ""}`;
}

export function numberToWords(num: number): string {
  if (num === 0) return "Zero";
  if (num < 0) return `Minus ${numberToWords(-num)}`;

  let n = num;
  let result = "";
  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  const lakh = Math.floor(n / 100000);
  n %= 100000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;
  const rest = n;

  if (crore > 0) result += `${convertHundreds(crore)} Crore `;
  if (lakh > 0) result += `${convertHundreds(lakh)} Lakh `;
  if (thousand > 0) result += `${convertHundreds(thousand)} Thousand `;
  if (rest > 0) result += convertHundreds(rest);

  return result.trim();
}
