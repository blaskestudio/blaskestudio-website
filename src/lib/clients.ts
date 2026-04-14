export interface Client {
  name: string;
  logo: string;
  /** Logos that render visually small due to design — bump to h-20 max-w-[200px] */
  large?: boolean;
}

// Static clients — local WebP files served from public/logos/
// (CMT, US Army, Booking.com, and old Patrick logo removed per client request)
export const clients: Client[] = [
  { name: 'Indiana University',    logo: '/logos/iu.webp' },
  { name: 'Notre Dame',            logo: '/logos/nd.webp' },
  { name: 'Washington Post',       logo: '/logos/wp.webp',      large: true },
  { name: 'Lip Sync Battle',       logo: '/logos/lip.webp',     large: true },
  { name: 'The Ranch',             logo: '/logos/ranch.webp' },
  { name: 'Victory Park',          logo: '/logos/vp.webp',      large: true },
  { name: 'Girls Inc.',            logo: '/logos/girls.webp' },
  { name: 'Good Magazine',         logo: '/logos/good.webp' },
  { name: 'We Energies',           logo: '/logos/we.webp',      large: true },
  { name: 'Smoker Craft',          logo: '/logos/smoker.webp' },
  { name: 'Viewrail',              logo: '/logos/view.webp' },
  { name: 'The Morris',            logo: '/logos/morris.webp' },
  { name: 'South Bend Symphony',   logo: '/logos/orchestra.webp' },
  { name: 'South Bend',            logo: '/logos/sb.webp' },
  { name: 'Compass Coffee',        logo: '/logos/cc.webp' },
  { name: 'J. Morse',              logo: '/logos/jm.webp' },
  { name: 'Pop Culture',           logo: '/logos/pop.webp' },
];
