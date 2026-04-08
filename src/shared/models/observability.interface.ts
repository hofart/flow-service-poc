export type ErrorType = 'form' | 'api' | 'network' | 'validation' | 'general';

export interface HandleErrorPayload {
  type: ErrorType;
  error?: any;
  context?: string;
  data?: Record<string, any>;
}

export interface ErrorPayload {
  message: string;
  data?: Record<string, any>;
  error?: any;
}

export interface ErrorResult {
  hasErrors: boolean;
  invalidFields?: string[];
  status?: number;
  message?: string;
  code?: string;
  errors?: string[];
  error?: any;
}
