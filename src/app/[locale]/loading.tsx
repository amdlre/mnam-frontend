import { Spinner } from '@amdlre/design-system';

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner size="2xl" />
    </div>
  );
}
