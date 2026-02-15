import { Schema, model, Document } from 'mongoose';

interface IVacancy extends Document {
  vacancyId: number;
  vacancyIdFromLink: number;
  description: string;
  date: Date;
}

const vacancySchema = new Schema<IVacancy>({
  vacancyId: { type: Number, required: true },
  vacancyIdFromLink: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
});

const Vacancy = model<IVacancy>('Vacancy', vacancySchema);

export default Vacancy;
