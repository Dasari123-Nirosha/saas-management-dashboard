
function SkeletonLoader({
  variant = "text",
  count = 1,
  width,
  height,
  className = "",
}) {
  const skeletons = Array.from(
    { length: Math.max(1, count) },
    (_, index) => index
  );

  return (
    <div
      className={`skeleton-loader skeleton-loader--${variant} ${className}`.trim()}
      aria-hidden="true"
    >
      {skeletons.map((item) => (
        <div
          key={item}
          className={`skeleton skeleton--${variant}`}
          style={{
            ...(width ? { width } : {}),
            ...(height ? { height } : {}),
          }}
        />
      ))}
    </div>
  );
}

export default SkeletonLoader;