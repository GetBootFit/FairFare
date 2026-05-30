/**
 * City-level tipping configuration for the tipping guide city selector.
 *
 * Countries NOT in this map (or absent from TIPPING_CITIES) skip the city step —
 * the national guide is fetched directly. This is intentional for city-states
 * (Hong Kong, Singapore) where the country IS the city.
 *
 * Country names must match the COUNTRIES array in TippingForm.tsx exactly.
 *
 * City names here become:
 *   - The UI pill labels shown to users
 *   - The city context string sent to Claude for city-specific tipping guidance
 *   - Part of the KV cache key: tipping_v3:{country}:{city}:{locale}
 *
 * ~210 cities across 50 countries — curated by most-visited tourist destinations
 * where city-level tipping context adds meaningful value over the national guide.
 */
export const TIPPING_CITIES: Record<string, readonly string[]> = {
  Argentina:        ['Buenos Aires', 'Mendoza', 'Córdoba', 'Bariloche'],
  Australia:        ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Cairns', 'Gold Coast', 'Hobart'],
  Austria:          ['Vienna', 'Salzburg', 'Innsbruck'],
  Belgium:          ['Brussels', 'Bruges', 'Antwerp', 'Ghent'],
  Brazil:           ['São Paulo', 'Rio de Janeiro', 'Salvador', 'Florianópolis', 'Fortaleza', 'Recife'],
  Canada:           ['Toronto', 'Vancouver', 'Montréal', 'Calgary', 'Ottawa', 'Québec City'],
  Chile:            ['Santiago', 'Valparaíso', 'San Pedro de Atacama'],
  China:            ['Beijing', 'Shanghai', 'Guangzhou', 'Chengdu', "Xi'an", 'Hangzhou'],
  Colombia:         ['Bogotá', 'Medellín', 'Cartagena'],
  'Costa Rica':     ['San José', 'Manuel Antonio', 'Tamarindo', 'La Fortuna', 'Monteverde', 'Puerto Viejo', 'Jacó'],
  Croatia:          ['Dubrovnik', 'Split', 'Zagreb'],
  'Czech Republic': ['Prague'],
  Denmark:          ['Copenhagen'],
  Egypt:            ['Cairo', 'Luxor', 'Hurghada', 'Sharm el-Sheikh'],
  Finland:          ['Helsinki', 'Rovaniemi'],
  France:           ['Paris', 'Nice', 'Lyon', 'Marseille', 'Bordeaux', 'Strasbourg'],
  Germany:          ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Dresden'],
  Greece:           ['Athens', 'Santorini', 'Mykonos', 'Thessaloniki', 'Rhodes'],
  // Hong Kong — city-state: no city step, national guide only
  Hungary:          ['Budapest'],
  India:            ['Mumbai', 'Delhi', 'Jaipur', 'Kolkata', 'Goa', 'Agra', 'Bangalore', 'Kochi'],
  Indonesia:        ['Bali', 'Jakarta', 'Yogyakarta'],
  Ireland:          ['Dublin', 'Cork', 'Galway'],
  Israel:           ['Tel Aviv', 'Jerusalem', 'Eilat'],
  Italy:            ['Rome', 'Milan', 'Florence', 'Venice', 'Naples', 'Amalfi', 'Bologna', 'Siena'],
  Japan:            ['Tokyo', 'Osaka', 'Kyoto', 'Hiroshima', 'Nara', 'Sapporo'],
  Jordan:           ['Amman', 'Petra'],
  Malaysia:         ['Kuala Lumpur', 'Penang', 'Langkawi'],
  Mexico:           ['Mexico City', 'Cancún', 'Playa del Carmen', 'Guadalajara', 'Oaxaca', 'Puerto Vallarta', 'San Miguel de Allende', 'Los Cabos'],
  Morocco:          ['Marrakech', 'Casablanca', 'Fez', 'Chefchaouen'],
  Netherlands:      ['Amsterdam', 'Rotterdam'],
  'New Zealand':    ['Auckland', 'Queenstown', 'Wellington', 'Rotorua'],
  Norway:           ['Oslo', 'Bergen', 'Tromsø'],
  Peru:             ['Lima', 'Cusco', 'Aguas Calientes'],
  Philippines:      ['Manila', 'Cebu', 'Boracay', 'Palawan'],
  Poland:           ['Warsaw', 'Kraków', 'Gdańsk', 'Wrocław'],
  Portugal:         ['Lisbon', 'Porto', 'Algarve'],
  Romania:          ['Bucharest', 'Cluj-Napoca', 'Brașov'],
  Russia:           ['Moscow', 'St. Petersburg'],
  'Saudi Arabia':   ['Riyadh', 'Jeddah'],
  // Singapore — city-state: no city step, national guide only
  'South Africa':   ['Cape Town', 'Johannesburg', 'Durban'],
  'South Korea':    ['Seoul', 'Busan', 'Jeju'],
  Spain:            ['Madrid', 'Barcelona', 'Seville', 'Granada', 'Valencia', 'Bilbao', 'Malaga', 'Ibiza'],
  Sweden:           ['Stockholm', 'Gothenburg'],
  Switzerland:      ['Zurich', 'Geneva', 'Lucerne', 'Zermatt'],
  Taiwan:           ['Taipei', 'Taoyuan', 'Tainan', 'Kaohsiung'],
  Thailand:         ['Bangkok', 'Chiang Mai', 'Phuket', 'Koh Samui', 'Pattaya', 'Krabi', 'Ayutthaya'],
  Tunisia:          ['Tunis', 'Sousse', 'Hammamet', 'Djerba', 'Sfax', 'Kairouan'],
  Turkey:           ['Istanbul', 'Cappadocia', 'Antalya', 'Bodrum', 'İzmir'],
  UAE:              ['Dubai', 'Abu Dhabi'],
  Ukraine:          ['Kyiv', 'Lviv'],
  'United Kingdom': ['London', 'Edinburgh', 'Manchester', 'Birmingham', 'Bristol', 'Glasgow', 'Liverpool', 'Bath', 'Oxford'],
  'United States':  ['New York', 'Los Angeles', 'Chicago', 'San Francisco', 'Miami', 'Las Vegas', 'New Orleans', 'Boston', 'Seattle', 'Washington DC', 'Nashville', 'Austin'],
  Vietnam:          ['Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hội An', 'Nha Trang', 'Huế'],
}
