// Shared frontend types for the portfolio app

export interface Links {
  github?: string;
  linkedin?: string;
  portfolio?: string;
  demo?: string; // used by projects
}

export interface Education {
  _id?: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
}

export interface Project {
  _id?: string;
  title: string;
  description: string;
  skills: string[];
  links: Links;
}

export interface WorkExperience {
  _id?: string;
  company: string;
  position: string;
  startDate: string; // ISO date string
  endDate?: string;  // ISO date string
  description: string;
}

export interface Profile {
  _id?: string;
  name: string;
  email: string;
  links: Links;
  education: Education[];
  projects: Project[];
  work: WorkExperience[];
  skills: string[];
}


