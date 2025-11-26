export interface Exercise {
  exercise_number: string; // A1, B2, etc.
  name: string;
  tempo: string | null;
  rep_range: string | null; // "10-12" or "10"
  sets: number | null;
  rest_seconds: number | null;
  notes: string | null;
  metadata?: {
    previousWeight?: string; // Track progression
    targetWeight?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
  };
}

export interface ExerciseGroup {
  group_id: string; // 'A' | 'B' | 'C' | 'D'
  exercises: Exercise[];
}

export interface Workout {
  id: string; // UUID
  title: string;
  date: string; // YYYY-MM-DD
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  exercise_groups: ExerciseGroup[];
  sourceScreenshots: string[]; // base64 or URLs
  metadata?: {
    extractionAccuracy?: number; // 0-1
    processingTimeMs?: number;
    geminiModelVersion?: string;
    userEdited?: boolean;
  };
}

export interface ProcessingStatus {
  fileId: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number; // 0-100
  error?: string;
  result?: Workout;
}
