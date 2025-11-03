import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';
import { ProjectStatus } from '../../domain/project';

const projectSchema = new Schema(
  {
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, default: '' },
    status: { type: String, enum: Object.values(ProjectStatus), default: ProjectStatus.IN_PROGRESS, required: true },
    progress: { type: Number, min: 0, max: 100, default: 0, required: true },
    teamMembers: { type: [String], default: [] },
    tasks: {
      type: [
        new Schema(
          {
            title: { type: String, required: true },
            done: { type: Boolean, default: false, required: true },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
  contacts: {
    type: [
      new Schema(
        {
          name: { type: String, required: true },
          displayName: { type: String, required: true },
          phone: { type: String, default: '' },
          email: { type: String, default: '' },
        },
        { _id: false }
      ),
    ],
    default: [],
  },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export type ProjectDocument = InferSchemaType<typeof projectSchema> & { _id: mongoose.Types.ObjectId };

const ProjectModel: Model<ProjectDocument> = mongoose.models.Project || mongoose.model<ProjectDocument>('Project', projectSchema);
export default ProjectModel;


