export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  isOpen: boolean;
}

export interface FAQCategory {
  name: string;
  icon: string;
}