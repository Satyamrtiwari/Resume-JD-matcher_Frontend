export default function Card({ title, children }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10">
      {title && (
        <h2 className="text-lg font-semibold mb-4 text-white">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
