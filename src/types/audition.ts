export type AuditionData = {
  // Section 1 — Personal Information
  fullName: string;
  stageName: string;
  dob: string;
  age: string;
  nationality: string;
  ethnicity: string;
  gender: string[];
  height: string;
  weight: string;
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  photoBase64: string;

  // Section 2 — Measurements
  measureWeight: string;
  heightWithoutHeels: string;
  heightWithHeels: string;
  hobby: string;
  emailId: string;
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

  // Section 5 — About You
  aboutYou: string;

  // Section 6 — Experience
  experience: string;

  // Section 7 — Skills
  skill1: string;
  skill2: string;
  skill3: string;
  skill4: string;

  // Section 8 — Upload Links
  link1: string;
  link2: string;
  link3: string;
  link4: string;

  // Section 9 — Social Media
  instagram: string;
  snapchat: string;
  threads: string;
  otherSocial: string;

  // Section 10 — Agreement
  agreedToTerms: boolean;
  signatureName: string;
  signatureDate: string;
};
