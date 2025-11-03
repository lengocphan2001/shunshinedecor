import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const quickReportSchema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    date: { type: Date, required: true },
    
    // ManPower section
    manpower: {
      type: [{
        role: { type: String, required: true },
        count: { type: Number, required: true, default: 0 },
      }],
      default: [],
    },
    
    // Quality section
    qualityEntries: {
      type: [{
        authorId: { type: String, required: true },
        authorName: { type: String, required: true },
        content: { type: String, required: true },
        attachments: [{
          url: String,
          fileName: String,
          fileSize: Number,
          mimeType: String,
        }],
        timestamp: { type: Date, default: Date.now },
      }],
      default: [],
    },
    
    // Schedule section
    scheduleEntries: {
      type: [{
        authorId: { type: String, required: true },
        authorName: { type: String, required: true },
        content: { type: String, required: true },
        attachments: [{
          url: String,
          fileName: String,
          fileSize: Number,
          mimeType: String,
        }],
        timestamp: { type: Date, default: Date.now },
      }],
      default: [],
    },
    
    // Comments section
    comments: {
      type: [{
        id: { type: String, required: true },
        authorId: { type: String, required: true },
        authorName: { type: String, required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        isDeleted: { type: Boolean, default: false },
      }],
      default: [],
    },
    
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Index for efficient querying by project and date
quickReportSchema.index({ projectId: 1, date: 1 });

export type QuickReportDocument = InferSchemaType<typeof quickReportSchema> & { _id: mongoose.Types.ObjectId };

const QuickReportModel: Model<QuickReportDocument> = mongoose.models.QuickReport || mongoose.model<QuickReportDocument>('QuickReport', quickReportSchema);
export default QuickReportModel;

