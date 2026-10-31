// JSON-LD builders (handoff 8). Absolute URLs here are correct: schema needs full URLs.
import { site, rooms } from '../data/site';
import { services } from '../data/services';

const abs = (path: string) => new URL(path, site.url).href;
const BIZ_ID = `${site.url}/#studio`;

export function recordingStudio() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RecordingStudio',
    '@id': BIZ_ID,
    name: site.name,
    url: abs('/'),
    logo: abs('/images/logoRGB.png'),
    image: abs('/og/home.png'),
    telephone: site.phoneE164,
    email: site.email,
    foundingDate: String(site.founded),
    founder: { '@type': 'Person', name: site.owner, jobTitle: site.ownerTitle },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '517 W 45th St',
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.zip,
      addressCountry: site.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lon },
    hasMap: site.mapsUrl,
    areaServed: ['Manhattan', 'Brooklyn', 'Queens', 'The Bronx', 'Staten Island', 'Long Island', 'New Jersey', 'Connecticut'],
    description: `Owner-operated recording, mixing, mastering, voice over, ADR, podcast and filming studio in Hell's Kitchen, Manhattan, since ${site.founded}. Open by appointment only; no walk-ins.`,
    sameAs: Object.values(site.social),
    amenityFeature: [
      ...rooms.map((r) => ({ '@type': 'LocationFeatureSpecification', name: `${r.name} (${r.feet[0]} x ${r.feet[1]} ft)`, value: true })),
      { '@type': 'LocationFeatureSpecification', name: "Baldwin 7' acoustic grand piano", value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Trident Series 80B console', value: true },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Studio services',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name, url: abs(`/services/${s.slug}/`) },
      })),
    },
  };
}

export function webPage(path: string, name: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${abs(path)}#webpage`,
    url: abs(path),
    name,
    description,
    isPartOf: { '@type': 'WebSite', name: site.name, url: abs('/') },
    about: { '@id': BIZ_ID },
    inLanguage: 'en-US',
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function serviceList() {
  return services.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    serviceType: s.name,
    description: s.copy,
    url: abs(`/services/${s.slug}/`),
    provider: { '@id': BIZ_ID },
    areaServed: { '@type': 'City', name: 'New York' },
  }));
}

export function place() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: `${site.name}, 517 West 45th Street`,
    address: { '@type': 'PostalAddress', streetAddress: '517 W 45th St', addressLocality: 'New York', addressRegion: 'NY', postalCode: '10036', addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lon },
    containedInPlace: { '@type': 'Place', name: "Hell's Kitchen, Manhattan" },
    hasMap: site.mapsUrl,
  };
}
