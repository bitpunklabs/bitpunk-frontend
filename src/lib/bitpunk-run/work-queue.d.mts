export type JobHandle = { promote(): void; cancel(): void };
export declare function createWorkQueue(options?: { budgetMs?: number; canRun?: (job: { priority: number }) => boolean }): {
  wake(): void;
  clear(): void;
  add<T>(iterator: Generator<void, T, unknown>, options?: { priority?: number; onComplete?: (value: T) => void; onError?: (error: unknown) => void; onCancel?: () => void }): JobHandle;
};
