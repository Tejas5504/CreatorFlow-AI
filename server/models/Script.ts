import mongoose from "mongoose";

export interface IScript extends mongoose.Document {
  userId: string;
  title: string;
  tone: string;
  length: string;
  hook: string;
  intro: string;
  main_content: string;
  statistics: string;
  outro: string;
  cta: string;
  createdAt: Date;
  updatedAt: Date;
}

const ScriptSchema = new mongoose.Schema<IScript>(
  {
    userId: { type: String, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    tone: { type: String, required: true },
    length: { type: String, required: true },
    hook: { type: String, required: true },
    intro: { type: String, required: true },
    main_content: { type: String, required: true },
    statistics: { type: String, required: true },
    outro: { type: String, required: true },
    cta: { type: String, required: true },
  },
  { timestamps: true }
);

const Script = mongoose.models.Script || mongoose.model<IScript>('Script', ScriptSchema);

export default Script;
