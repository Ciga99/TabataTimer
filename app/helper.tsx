/**
 * Converte un numero di secondi in una stringa formattata mm:ss
 * @param totalSeconds - Il numero totale di secondi da convertire
 * @returns Una stringa nel formato "00:00"
 */
export const formatTime = (totalSeconds: number): string => {
  // 1. Calcoliamo i minuti dividendo per 60 e arrotondando per difetto
  const minutes = Math.floor(totalSeconds / 60);
  // 2. Usiamo l'operatore modulo (%) per ottenere i secondi rimanenti
  const seconds = totalSeconds % 60;
  // 3. Formattiamo i numeri per avere sempre due cifre (es. "05" invece di "5")
  // Usiamo padStart(2, '0') che aggiunge uno '0' se la stringa è più corta di 2 caratteri
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  return `${paddedMinutes}:${paddedSeconds}`;
};