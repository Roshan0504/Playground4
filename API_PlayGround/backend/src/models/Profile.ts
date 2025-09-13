import mongoose, { Document, Schema } from 'mongoose';

export interface IEducation {
  _id?: mongoose.Types.ObjectId;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
}

export interface IProject {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  skills: string[];
  links: {
    github?: string;
    demo?: string;
  };
}

export interface IWorkExperience {
  _id?: mongoose.Types.ObjectId;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description: string;
}

export interface ILinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface IProfile extends Document {
  name: string;
  email: string;
  education: IEducation[];
  skills: string[];
  projects: IProject[];
  work: IWorkExperience[];
  links: ILinks;
}

const EducationSchema: Schema = new Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String, required: true },
  startYear: { type: Number, required: true },
  endYear: { type: Number }
});

const ProjectSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills: [{ type: String }],
  links: {
    github: String,
    demo: String
  }
});

const WorkExperienceSchema: Schema = new Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  description: { type: String, required: true }
});

const LinksSchema: Schema = new Schema({
  github: String,
  linkedin: String,
  portfolio: String
});

const ProfileSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  education: [EducationSchema],
  skills: [{ type: String }],
  projects: [ProjectSchema],
  work: [WorkExperienceSchema],
  links: LinksSchema
}, {
  timestamps: true
});

// Create indexes
ProfileSchema.index({ skills: 1 });
ProfileSchema.index({ 'projects.skills': 1 });
ProfileSchema.index({ email: 1 }, { unique: true });

export default mongoose.model<IProfile>('Profile', ProfileSchema);