export type AuditionData = {
  // Section 1 — Personal Information
  fullName: string;
  stageName: string;
  dob: string;
  age: string;
  nationality: string;
  ethnicity: string;
  gender: string[];
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  photoBase64: string;

  // Section 2 — Measurements
  measureWeight: string;
  heightWithoutHeels: string;
  heightWithHeels: string;
  hair: string;
  eyes: string;
  complexion: string;
  bustChest: string;
  upperWaist: string;
  lowerWaist: string;
  hips: string;
  bodyType: string;

  // Section 3 — Audition Category
  auditionCategories: string[];

  // Section 4 — Language Skills
  languageSkills: string;

  // Section 5 — About You (5 bullet points joined with \n)
  aboutYou: string;

  // Section 6 — Experience (5 bullet points joined with \n)
  experience: string;

  // Section 7 — Skills
  skill1: string;
  skill2: string;
  skill3: string;
  skill4: string;

  // Section 8 — Audition Link
  auditionLink: string;

  // Section 9 — Social Media (full URLs)
  instagram: string;
  snapchat: string;
  threads: string;
  otherSocial: string;

  // Section 10 — Agreement
  agreedToTerms: boolean;
  signatureName: string;
  signatureDate: string;
};
