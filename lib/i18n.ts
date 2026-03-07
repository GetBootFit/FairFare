export type Locale = 'en' | 'es' | 'fr' | 'de'

export const LOCALES: { code: Locale; label: string; flag: string; flagCode: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧', flagCode: 'gb' },
  { code: 'es', label: 'Español', flag: '🇪🇸', flagCode: 'es' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', flagCode: 'fr' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', flagCode: 'de' },
]

export type TranslationKey =
  // Navigation
  | 'nav_home'
  | 'nav_taxi'
  | 'nav_tipping'
  // Home page
  | 'home_tagline'
  | 'home_taxi_title'
  | 'home_taxi_desc'
  | 'home_tipping_title'
  | 'home_tipping_desc'
  | 'home_pricing'
  | 'home_install_prompt'
  | 'home_install_btn'
  // Taxi form
  | 'taxi_from'
  | 'taxi_to'
  | 'taxi_pickup_placeholder'
  | 'taxi_dest_placeholder'
  | 'taxi_check_route'
  | 'taxi_calculating'
  | 'taxi_loading_full'
  | 'taxi_unlock_btn'
  | 'taxi_change_route'
  // Tipping form
  | 'tipping_description'
  | 'tipping_search'
  | 'tipping_loading'
  // Payment modal — existing
  | 'payment_title'
  | 'payment_taxi_desc'
  | 'payment_tipping_desc'
  | 'payment_note'
  | 'payment_pay_btn'
  | 'payment_redirecting'
  | 'payment_cancel'
  // Payment modal — tier labels
  | 'payment_single_result'
  | 'payment_single_desc_taxi'
  | 'payment_single_desc_tipping'
  | 'payment_country_pass'
  | 'payment_all_features_24h'
  | 'payment_for_this_trip'
  | 'payment_bundle'
  | 'payment_bundle_desc'
  | 'payment_best_value'
  | 'payment_currency_label'
  | 'payment_currency_change'
  // Common
  | 'common_error'

type Translations = Record<TranslationKey, string>

const translations: Record<Locale, Translations> = {
  en: {
    nav_home: 'Home',
    nav_taxi: 'Taxi',
    nav_tipping: 'Tipping',
    home_tagline: 'Instant confidence for taxis and tips — anywhere in the world.',
    home_taxi_title: 'Taxi Fare Check',
    home_taxi_desc: 'Fair price range, scam alerts & what to say to your driver',
    home_tipping_title: 'Tipping Guide',
    home_tipping_desc: 'Know exactly how much to tip in any country, for any service',
    home_pricing: 'From {single} · {bundle} for 10 queries · No account',
    home_install_prompt: 'Add FairFare to your home screen for quick access',
    home_install_btn: 'Add',
    taxi_from: 'From',
    taxi_to: 'To',
    taxi_pickup_placeholder: 'Airport, hotel or address',
    taxi_dest_placeholder: 'Hotel, attraction or address',
    taxi_check_route: 'Check Route',
    taxi_calculating: 'Calculating route…',
    taxi_loading_full: 'Loading full report…',
    taxi_unlock_btn: 'Unlock Full Report',
    taxi_change_route: '← Change route',
    tipping_description: 'Select a country to see tipping customs for every scenario.',
    tipping_search: 'Search country…',
    tipping_loading: 'Loading tipping guide for {country}…',
    payment_title: 'Choose your access',
    payment_taxi_desc: 'Fair fare range, scam warnings & local phrase for your driver.',
    payment_tipping_desc: 'Full tipping guide for every service scenario in this country.',
    payment_note: 'No account. Instant. Card · Apple Pay · Google Pay',
    payment_pay_btn: 'Pay {price} →',
    payment_redirecting: 'Redirecting to payment…',
    payment_cancel: 'Cancel',
    payment_single_result: 'Single Result',
    payment_single_desc_taxi: 'This route only',
    payment_single_desc_tipping: 'This country only',
    payment_country_pass: '{country} Pass — 24 hours',
    payment_all_features_24h: 'All taxi + tipping · unlimited queries',
    payment_for_this_trip: 'FOR THIS TRIP',
    payment_bundle: '10-Query Bundle',
    payment_bundle_desc: '10 queries · stored on this device · 90 days',
    payment_best_value: 'BEST VALUE',
    payment_currency_label: 'Charging in {currency}',
    payment_currency_change: 'Change',
    common_error: 'Something went wrong',
  },

  es: {
    nav_home: 'Inicio',
    nav_taxi: 'Taxi',
    nav_tipping: 'Propinas',
    home_tagline: 'Confianza inmediata para taxis y propinas — en cualquier parte del mundo.',
    home_taxi_title: 'Verificar tarifa de taxi',
    home_taxi_desc: 'Rango de precio justo, alertas de estafas y qué decirle a tu conductor',
    home_tipping_title: 'Guía de propinas',
    home_tipping_desc: 'Sabe exactamente cuánto propina dar en cualquier país y servicio',
    home_pricing: 'Desde {single} · {bundle} por 10 consultas · Sin cuenta',
    home_install_prompt: 'Añade FairFare a tu pantalla de inicio para acceso rápido',
    home_install_btn: 'Añadir',
    taxi_from: 'Desde',
    taxi_to: 'Hasta',
    taxi_pickup_placeholder: 'Aeropuerto, hotel o dirección',
    taxi_dest_placeholder: 'Hotel, atracción o dirección',
    taxi_check_route: 'Verificar ruta',
    taxi_calculating: 'Calculando ruta…',
    taxi_loading_full: 'Cargando informe completo…',
    taxi_unlock_btn: 'Desbloquear informe',
    taxi_change_route: '← Cambiar ruta',
    tipping_description: 'Selecciona un país para ver las costumbres de propinas en cada situación.',
    tipping_search: 'Buscar país…',
    tipping_loading: 'Cargando guía de propinas para {country}…',
    payment_title: 'Elige tu acceso',
    payment_taxi_desc: 'Rango de tarifa justa, advertencias de estafas y frase local para tu conductor.',
    payment_tipping_desc: 'Guía completa de propinas para cada escenario de servicio en este país.',
    payment_note: 'Sin cuenta. Instantáneo. Tarjeta · Apple Pay · Google Pay',
    payment_pay_btn: 'Pagar {price} →',
    payment_redirecting: 'Redirigiendo al pago…',
    payment_cancel: 'Cancelar',
    payment_single_result: 'Resultado único',
    payment_single_desc_taxi: 'Solo esta ruta',
    payment_single_desc_tipping: 'Solo este país',
    payment_country_pass: 'Pase {country} — 24 horas',
    payment_all_features_24h: 'Todo taxi + propinas · consultas ilimitadas',
    payment_for_this_trip: 'PARA ESTE VIAJE',
    payment_bundle: 'Paquete 10 consultas',
    payment_bundle_desc: '10 consultas · guardadas en este dispositivo · 90 días',
    payment_best_value: 'MEJOR VALOR',
    payment_currency_label: 'Cobrando en {currency}',
    payment_currency_change: 'Cambiar',
    common_error: 'Algo salió mal',
  },

  fr: {
    nav_home: 'Accueil',
    nav_taxi: 'Taxi',
    nav_tipping: 'Pourboires',
    home_tagline: 'Confiance instantanée pour les taxis et les pourboires — partout dans le monde.',
    home_taxi_title: 'Vérification du tarif taxi',
    home_taxi_desc: 'Fourchette de prix juste, alertes d\'arnaque et quoi dire à votre chauffeur',
    home_tipping_title: 'Guide de pourboires',
    home_tipping_desc: 'Sachez exactement combien donner comme pourboire dans chaque pays',
    home_pricing: 'À partir de {single} · {bundle} pour 10 requêtes · Sans compte',
    home_install_prompt: 'Ajoutez FairFare à votre écran d\'accueil pour un accès rapide',
    home_install_btn: 'Ajouter',
    taxi_from: 'Départ',
    taxi_to: 'Arrivée',
    taxi_pickup_placeholder: 'Aéroport, hôtel ou adresse',
    taxi_dest_placeholder: 'Hôtel, attraction ou adresse',
    taxi_check_route: 'Vérifier le trajet',
    taxi_calculating: 'Calcul du trajet…',
    taxi_loading_full: 'Chargement du rapport complet…',
    taxi_unlock_btn: 'Débloquer le rapport',
    taxi_change_route: '← Modifier le trajet',
    tipping_description: 'Sélectionnez un pays pour voir les coutumes de pourboire dans chaque situation.',
    tipping_search: 'Rechercher un pays…',
    tipping_loading: 'Chargement du guide de pourboires pour {country}…',
    payment_title: 'Choisissez votre accès',
    payment_taxi_desc: "Fourchette de tarif juste, avertissements d'arnaques et phrase locale pour votre chauffeur.",
    payment_tipping_desc: 'Guide complet de pourboires pour chaque scénario de service dans ce pays.',
    payment_note: 'Sans compte. Instantané. Carte · Apple Pay · Google Pay',
    payment_pay_btn: 'Payer {price} →',
    payment_redirecting: 'Redirection vers le paiement…',
    payment_cancel: 'Annuler',
    payment_single_result: 'Résultat unique',
    payment_single_desc_taxi: 'Ce trajet uniquement',
    payment_single_desc_tipping: 'Ce pays uniquement',
    payment_country_pass: 'Pass {country} — 24 heures',
    payment_all_features_24h: 'Tout taxi + pourboires · requêtes illimitées',
    payment_for_this_trip: 'POUR CE VOYAGE',
    payment_bundle: 'Pack 10 requêtes',
    payment_bundle_desc: '10 requêtes · stockées sur cet appareil · 90 jours',
    payment_best_value: 'MEILLEUR RAPPORT',
    payment_currency_label: 'Facturation en {currency}',
    payment_currency_change: 'Modifier',
    common_error: 'Une erreur est survenue',
  },

  de: {
    nav_home: 'Start',
    nav_taxi: 'Taxi',
    nav_tipping: 'Trinkgeld',
    home_tagline: 'Sofortige Sicherheit für Taxis und Trinkgelder — überall auf der Welt.',
    home_taxi_title: 'Taxitarif prüfen',
    home_taxi_desc: 'Fairer Preisbereich, Betrugswarnungen & was du deinem Fahrer sagen sollst',
    home_tipping_title: 'Trinkgeldführer',
    home_tipping_desc: 'Erfahre genau, wie viel Trinkgeld in jedem Land und für jeden Service',
    home_pricing: 'Ab {single} · {bundle} für 10 Anfragen · Kein Konto',
    home_install_prompt: 'Füge FairFare zum Startbildschirm für schnellen Zugriff hinzu',
    home_install_btn: 'Hinzufügen',
    taxi_from: 'Von',
    taxi_to: 'Nach',
    taxi_pickup_placeholder: 'Flughafen, Hotel oder Adresse',
    taxi_dest_placeholder: 'Hotel, Sehenswürdigkeit oder Adresse',
    taxi_check_route: 'Route prüfen',
    taxi_calculating: 'Route wird berechnet…',
    taxi_loading_full: 'Vollständiger Bericht wird geladen…',
    taxi_unlock_btn: 'Bericht freischalten',
    taxi_change_route: '← Route ändern',
    tipping_description: 'Wähle ein Land, um die Trinkgeldgewohnheiten für jedes Szenario zu sehen.',
    tipping_search: 'Land suchen…',
    tipping_loading: 'Trinkgeldführer für {country} wird geladen…',
    payment_title: 'Wähle deinen Zugang',
    payment_taxi_desc: 'Fairer Fahrpreisbereich, Betrugshinweise und lokaler Satz für deinen Fahrer.',
    payment_tipping_desc: 'Vollständiger Trinkgeldführer für jedes Serviceszenario in diesem Land.',
    payment_note: 'Kein Konto. Sofort. Karte · Apple Pay · Google Pay',
    payment_pay_btn: '{price} zahlen →',
    payment_redirecting: 'Weiterleitung zur Zahlung…',
    payment_cancel: 'Abbrechen',
    payment_single_result: 'Einzelergebnis',
    payment_single_desc_taxi: 'Nur diese Route',
    payment_single_desc_tipping: 'Nur dieses Land',
    payment_country_pass: '{country}-Pass — 24 Stunden',
    payment_all_features_24h: 'Alle Taxi + Trinkgeld · unbegrenzte Anfragen',
    payment_for_this_trip: 'FÜR DIESE REISE',
    payment_bundle: '10er-Anfragen-Paket',
    payment_bundle_desc: '10 Anfragen · auf diesem Gerät gespeichert · 90 Tage',
    payment_best_value: 'BESTES ANGEBOT',
    payment_currency_label: 'Abrechnung in {currency}',
    payment_currency_change: 'Ändern',
    common_error: 'Etwas ist schiefgelaufen',
  },
}

export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? translations.en
}

/** Replace {key} placeholders in a translation string */
export function interpolate(str: string, vars: Record<string, string>): string {
  return str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`)
}
