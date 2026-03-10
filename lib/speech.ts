/**
 * Web Speech API utilities — country → BCP 47 language code mapping.
 * No API key or cost. Works on all modern browsers.
 */

export const COUNTRY_LANG_MAP: Record<string, string> = {
  // Southeast Asia
  Thailand: 'th-TH',
  Vietnam: 'vi-VN',
  Indonesia: 'id-ID',
  Malaysia: 'ms-MY',
  Philippines: 'fil-PH',
  Singapore: 'en-SG',
  Cambodia: 'km-KH',
  Myanmar: 'my-MM',
  Laos: 'lo-LA',

  // East Asia
  Japan: 'ja-JP',
  'South Korea': 'ko-KR',
  Korea: 'ko-KR',
  China: 'zh-CN',
  Taiwan: 'zh-TW',
  'Hong Kong': 'zh-HK',
  Macau: 'zh-MO',

  // South Asia
  India: 'hi-IN',
  Pakistan: 'ur-PK',
  Bangladesh: 'bn-BD',
  'Sri Lanka': 'si-LK',
  Nepal: 'ne-NP',

  // Middle East
  'United Arab Emirates': 'ar-AE',
  UAE: 'ar-AE',
  'Saudi Arabia': 'ar-SA',
  Qatar: 'ar-QA',
  Bahrain: 'ar-BH',
  Kuwait: 'ar-KW',
  Oman: 'ar-OM',
  Jordan: 'ar-JO',
  Egypt: 'ar-EG',
  Lebanon: 'ar-LB',
  Morocco: 'ar-MA',
  Tunisia: 'ar-TN',
  Algeria: 'ar-DZ',
  Turkey: 'tr-TR',
  Israel: 'he-IL',
  Iran: 'fa-IR',
  Iraq: 'ar-IQ',

  // Europe
  France: 'fr-FR',
  Germany: 'de-DE',
  Spain: 'es-ES',
  Italy: 'it-IT',
  Portugal: 'pt-PT',
  Netherlands: 'nl-NL',
  Belgium: 'fr-BE',
  Switzerland: 'de-CH',
  Austria: 'de-AT',
  Poland: 'pl-PL',
  'Czech Republic': 'cs-CZ',
  Czechia: 'cs-CZ',
  Slovakia: 'sk-SK',
  Hungary: 'hu-HU',
  Romania: 'ro-RO',
  Bulgaria: 'bg-BG',
  Greece: 'el-GR',
  Croatia: 'hr-HR',
  Serbia: 'sr-RS',
  Slovenia: 'sl-SI',
  Russia: 'ru-RU',
  Ukraine: 'uk-UA',
  Lithuania: 'lt-LT',
  Latvia: 'lv-LV',
  Estonia: 'et-EE',
  Finland: 'fi-FI',
  Sweden: 'sv-SE',
  Norway: 'nb-NO',
  Denmark: 'da-DK',
  Iceland: 'is-IS',
  Ireland: 'en-IE',
  'United Kingdom': 'en-GB',

  // Americas
  'United States': 'en-US',
  USA: 'en-US',
  Canada: 'en-CA',
  Mexico: 'es-MX',
  Brazil: 'pt-BR',
  Argentina: 'es-AR',
  Colombia: 'es-CO',
  Chile: 'es-CL',
  Peru: 'es-PE',
  Venezuela: 'es-VE',
  Ecuador: 'es-EC',
  Bolivia: 'es-BO',
  Uruguay: 'es-UY',
  Cuba: 'es-CU',
  'Dominican Republic': 'es-DO',
  Guatemala: 'es-GT',
  'Costa Rica': 'es-CR',
  Panama: 'es-PA',

  // Africa
  'South Africa': 'af-ZA',
  Kenya: 'sw-KE',
  Tanzania: 'sw-TZ',
  Uganda: 'sw-UG',
  Ethiopia: 'am-ET',
  Ghana: 'en-GH',
  Nigeria: 'en-NG',
  Senegal: 'fr-SN',
  Mozambique: 'pt-MZ',
  Angola: 'pt-AO',

  // Oceania
  Australia: 'en-AU',
  'New Zealand': 'en-NZ',
}

export function getLangCode(country: string): string {
  return COUNTRY_LANG_MAP[country] ?? 'en-US'
}

/** Speak text using the browser's built-in speech synthesis. */
export function speakText(
  text: string,
  langCode: string,
  rate = 0.85,
  onEnd?: () => void,
  onError?: () => void,
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = langCode
  u.rate = rate
  if (onEnd) u.onend = onEnd
  if (onError) u.onerror = onError
  window.speechSynthesis.speak(u)
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}
