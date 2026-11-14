export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading page" className="b-loading">
      <div className="b-loading-copy">
        <div
          className="b-skeleton"
          style={{ height: 16, width: 180, marginBottom: 48 }}
        />
        {[90, 100, 75].map((width) => (
          <div
            key={width}
            className="b-skeleton"
            style={{ height: 64, width: `${width}%`, marginBottom: 12 }}
          />
        ))}
        <div className="b-skeleton" style={{ height: 80, marginTop: 32 }} />
        <div
          className="b-skeleton"
          style={{ height: 48, width: 220, marginTop: 32 }}
        />
      </div>
      <div className="b-skeleton b-loading-visual" />
    </div>
  );
}
