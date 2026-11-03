export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <span className="inline-block size-12 animate-spin rounded-full border-4 border-solid border-muted border-t-primary" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
