export interface Client {
  name: string;
  logo: string;
  /** Logos that render visually small due to design — bump to h-20 max-w-[200px] */
  large?: boolean;
}

// 21 clients — local WebP files served from public/logos/
export const clients: Client[] = [
  { name: 'Indiana University',    logo: '/logos/iu.webp' },
  { name: 'Notre Dame',            logo: '/logos/nd.webp' },
  { name: 'Washington Post',       logo: '/logos/wp.webp',      large: true },
  { name: 'CMT',                   logo: '/logos/cmt.webp' },
  { name: 'Lip Sync Battle',       logo: '/logos/lip.webp',     large: true },
  { name: 'The Ranch',             logo: '/logos/ranch.webp' },
  { name: 'Victory Park',          logo: '/logos/vp.webp',      large: true },
  { name: 'US Army',               logo: '/logos/army.webp' },
  { name: 'Booking.com',           logo: '/logos/booking.webp', large: true },
  { name: 'Girls Inc.',            logo: '/logos/girls.webp' },
  { name: 'Good Magazine',         logo: '/logos/good.webp' },
  { name: 'P Magazine',            logo: '/logos/p.webp' },
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
