export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  createdAt: string;
  status?: 'sending' | 'sent' | 'error';
}
