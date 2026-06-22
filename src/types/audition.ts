export type AuditionData = {
  // Section 1 — Personal Information
  fullName: string;
  dob: string;
  age: string;
  nationality: string;
  ethnicity: string;
  gender: string[];
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  photoBase64: string;

  // Section 2 — Measurements
  measureWeight: string;
  heightWithoutHeels: string;
  hairColour: string;
  eyeColour: string;
  bustChest: string;
  trouser: string;
  hips: string;

  // Section 3 — Language Skills
  languageSkills: string;

  // Section 4 — About You (max 250 chars)
  aboutYou: string;

  // Section 5 — Experience (max 250 chars)
  experience: string;

  // Section 6 — Skills
  skill1: string;
  skill2: string;
  skill3: string;
  skill4: string;

  // Section 7 — Social Media (full URLs)
  instagram: string;

  // Section 8 — Agreement
  agreedToTerms: boolean;
  signatureName: string;
  signatureDate: string;
};
