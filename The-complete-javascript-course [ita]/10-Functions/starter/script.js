'use strict';

// Valore di default per i parametri
let info_voli = [];
function print_info_flights(codice_volo, numero_passeggeri = 0, prezzo = 1000) {
  if (codice_volo === undefined || typeof codice_volo !== 'string') {
    console.log('Codice volo non definito');
    return;
  }
  const info_volo = {
    codice_volo,
    numero_passeggeri,
    prezzo,
  };
  info_voli.push(info_volo);
  console.log(info_volo);
}

print_info_flights('AZ123', 100, 1000);
print_info_flights(200, 2000);
print_info_flights('AZ789', 300, 3000);
