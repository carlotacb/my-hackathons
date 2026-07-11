export type Category = 'organized' | 'attended' | 'volunteered' | 'coached';

export interface Hackathon {
  id: string;
  name: string;
  category: Category;
  date: string;
  duration: string;
  place: string;
  /** [lat, lng]; omitted for fully online/hybrid events */
  coords?: [number, number];
  description: string;
  projectName?: string;
  projectUrl?: string;
  websiteUrl?: string;
  devpostUrl?: string;
  /** URL or /public path to the hackathon's logo. Falls back to a generic icon when unset or broken. */
  logoUrl?: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  organized: 'Organized',
  attended: 'Attended',
  volunteered: 'Volunteered',
  coached: 'Coached',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  organized: '#ff6b6b',
  attended: '#5b8cff',
  volunteered: '#2ecc9a',
  coached: '#f7b731',
};
