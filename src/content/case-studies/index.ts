import { CaseStudy } from '@/lib/types';

// Placeholder content. Replace all media and copy fields with real assets.

export const caseStudies: CaseStudy[] = [
  {
    slug: 'the-future-of-the-morris',
    contentType: 'case-study',
    title: 'The Future of the Morris',
    category: 'documentary',
    client: 'The Morris Performing Arts Center',
    year: 2022,
    thumbnailGif: '',
    thumbnailStill: '',
    featured: true,
    order: 4,
    heroVideo: { type: 'vimeo', id: 'PLACEHOLDER' },
    overview:
      'A cinematic documentary exploring the historic Morris Performing Arts Center and its role in the cultural identity of South Bend, Indiana.',
    challenge:
      'Convey the emotional weight of a century-old institution while building anticipation for its next chapter — without leaning on nostalgia alone.',
    approach:
      'We structured the film around intimate interviews with community leaders, artists, and longtime patrons, intercutting archival materials with sweeping cinematography of the venue itself. Every frame was composed to reflect the grandeur of the space and the warmth of the people it serves.',
    deliverables: [
      'Feature-length documentary (60 min)',
      'Short-form social cut (2 min)',
      'Still photography suite for press',
    ],
    results:
      "The film premiered to a sold-out house at The Morris and has since been screened at regional film festivals. It became a centerpiece of the venue's capital campaign, helping secure over $2M in community pledges.",
    contributors: [
      { role: 'Director', name: 'Chuck Fry' },
      { role: 'Cinematographer', name: 'Ryan Blaske' },
      { role: 'Creative Director', name: 'Jacob Titus' },
    ],
    gallery: [],
    cta: {
      label: 'Start a project',
      href: '/inquire',
    },
  },
];
