export default function Progress({
  value,
  max,
  errorMargin,
}: {
  value: number | undefined;
  max: number | undefined;
  errorMargin: number;
}) {
  if (value === undefined || max === undefined) return null;
  const percent = value === 0 ? 0 : (value * 100) / max;
  const errorPercent = errorMargin * 2;


  console.log(percent, errorPercent);
  return (
    <div className="relative border-2 rounded-full border-accent-content overflow-hidden w-64 h-4">
      <div
        className="absolute top-0 left-0 bg-green-800 h-full"
        style={{ width: `${percent}%` }}
      ></div>
      <div
      title="Margin of error"
        className="absolute opacity-60 top-0 bg-red-800 h-full"
        style={{
          width: `${errorPercent}%`,
          left: `${percent - errorMargin}%`,
          right: `${100 - (percent + errorMargin)}%`,
        }}
      ></div>
    </div>
  );
}
