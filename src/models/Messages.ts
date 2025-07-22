import { Schema, model, Document } from 'mongoose';

interface IMessage extends Document {
  messageId: number;
  name: string;
  message: string;
  date: Date;
}

const messageSchema = new Schema<IMessage>({
  messageId: { type: Number, required: true },
  name: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
});

const Message = model<IMessage>('Message', messageSchema);

export default Message;
