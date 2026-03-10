/**
 * Static emergency contact numbers by country (normalized lowercase key).
 * police | ambulance | fire
 * Source: publicly available national emergency numbers.
 */

export interface EmergencyNumbers {
  police: string
  ambulance: string
  fire: string
}

const EMERGENCY_CONTACTS: Record<string, EmergencyNumbers> = {
  // Southeast Asia
  thailand:      { police: '191', ambulance: '1669', fire: '199' },
  vietnam:       { police: '113', ambulance: '115',  fire: '114' },
  cambodia:      { police: '117', ambulance: '119',  fire: '118' },
  laos:          { police: '191', ambulance: '195',  fire: '190' },
  myanmar:       { police: '199', ambulance: '192',  fire: '191' },
  indonesia:     { police: '110', ambulance: '119',  fire: '113' },
  malaysia:      { police: '999', ambulance: '999',  fire: '994' },
  singapore:     { police: '999', ambulance: '995',  fire: '995' },
  philippines:   { police: '911', ambulance: '911',  fire: '911' },
  'the philippines': { police: '911', ambulance: '911', fire: '911' },

  // East Asia
  japan:         { police: '110', ambulance: '119',  fire: '119' },
  china:         { police: '110', ambulance: '120',  fire: '119' },
  'south korea': { police: '112', ambulance: '119',  fire: '119' },
  korea:         { police: '112', ambulance: '119',  fire: '119' },
  taiwan:        { police: '110', ambulance: '119',  fire: '119' },
  'hong kong':   { police: '999', ambulance: '999',  fire: '999' },
  mongolia:      { police: '102', ambulance: '103',  fire: '101' },

  // South Asia
  india:         { police: '100', ambulance: '102',  fire: '101' },
  nepal:         { police: '100', ambulance: '102',  fire: '101' },
  'sri lanka':   { police: '119', ambulance: '110',  fire: '111' },
  bangladesh:    { police: '999', ambulance: '999',  fire: '999' },
  pakistan:      { police: '15',  ambulance: '1122', fire: '16'  },
  maldives:      { police: '119', ambulance: '102',  fire: '118' },

  // Middle East
  'united arab emirates': { police: '999', ambulance: '998', fire: '997' },
  uae:           { police: '999', ambulance: '998',  fire: '997' },
  dubai:         { police: '999', ambulance: '998',  fire: '997' },
  'saudi arabia':{ police: '999', ambulance: '997',  fire: '998' },
  turkey:        { police: '155', ambulance: '112',  fire: '110' },
  jordan:        { police: '191', ambulance: '911',  fire: '193' },
  egypt:         { police: '122', ambulance: '123',  fire: '180' },
  israel:        { police: '100', ambulance: '101',  fire: '102' },
  qatar:         { police: '999', ambulance: '999',  fire: '999' },

  // Europe
  'united kingdom': { police: '999', ambulance: '999', fire: '999' },
  uk:            { police: '999', ambulance: '999',  fire: '999' },
  england:       { police: '999', ambulance: '999',  fire: '999' },
  france:        { police: '17',  ambulance: '15',   fire: '18'  },
  germany:       { police: '110', ambulance: '112',  fire: '112' },
  italy:         { police: '113', ambulance: '118',  fire: '115' },
  spain:         { police: '091', ambulance: '112',  fire: '080' },
  portugal:      { police: '112', ambulance: '112',  fire: '112' },
  greece:        { police: '100', ambulance: '166',  fire: '199' },
  netherlands:   { police: '112', ambulance: '112',  fire: '112' },
  belgium:       { police: '101', ambulance: '112',  fire: '100' },
  switzerland:   { police: '117', ambulance: '144',  fire: '118' },
  austria:       { police: '133', ambulance: '144',  fire: '122' },
  poland:        { police: '997', ambulance: '999',  fire: '998' },
  czechia:       { police: '158', ambulance: '155',  fire: '150' },
  hungary:       { police: '107', ambulance: '104',  fire: '105' },
  romania:       { police: '112', ambulance: '112',  fire: '112' },
  sweden:        { police: '112', ambulance: '112',  fire: '112' },
  norway:        { police: '112', ambulance: '113',  fire: '110' },
  denmark:       { police: '112', ambulance: '112',  fire: '112' },
  finland:       { police: '112', ambulance: '112',  fire: '112' },
  ireland:       { police: '999', ambulance: '999',  fire: '999' },
  croatia:       { police: '192', ambulance: '194',  fire: '193' },

  // Americas
  'united states': { police: '911', ambulance: '911', fire: '911' },
  usa:           { police: '911', ambulance: '911',  fire: '911' },
  canada:        { police: '911', ambulance: '911',  fire: '911' },
  mexico:        { police: '911', ambulance: '911',  fire: '911' },
  brazil:        { police: '190', ambulance: '192',  fire: '193' },
  argentina:     { police: '101', ambulance: '107',  fire: '100' },
  colombia:      { police: '112', ambulance: '132',  fire: '119' },
  peru:          { police: '105', ambulance: '117',  fire: '116' },
  chile:         { police: '133', ambulance: '131',  fire: '132' },
  cuba:          { police: '106', ambulance: '104',  fire: '105' },

  // Africa
  'south africa': { police: '10111', ambulance: '10177', fire: '10177' },
  kenya:         { police: '999', ambulance: '999',  fire: '999' },
  nigeria:       { police: '199', ambulance: '112',  fire: '112' },
  ghana:         { police: '191', ambulance: '193',  fire: '192' },
  ethiopia:      { police: '991', ambulance: '907',  fire: '939' },
  morocco:       { police: '19',  ambulance: '15',   fire: '15'  },
  tanzania:      { police: '112', ambulance: '112',  fire: '112' },
  uganda:        { police: '999', ambulance: '112',  fire: '999' },

  // Oceania
  australia:     { police: '000', ambulance: '000',  fire: '000' },
  'new zealand': { police: '111', ambulance: '111',  fire: '111' },
  fiji:          { police: '917', ambulance: '911',  fire: '917' },
}

/**
 * Normalise a country string to a lookup key (lowercase, trimmed).
 */
function normalise(country: string): string {
  return country.toLowerCase().trim()
}

/**
 * Look up emergency numbers for a country.
 * Returns null if the country is not in the dataset.
 */
export function getEmergencyNumbers(country: string): EmergencyNumbers | null {
  return EMERGENCY_CONTACTS[normalise(country)] ?? null
}
