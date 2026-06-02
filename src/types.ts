export interface Test {
  id: string;
  title: string;
  type: 'ielts' | 'next-prep';
  thumbnailUrl: string;
  pdfUrl: string;
  createdAt: string;
}

export interface Result {
  id: string;
  testName: string;
  date: string;
  studentName: string;
  score: string;
  createdAt: string;
}
