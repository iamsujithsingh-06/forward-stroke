export default function PlayerCard({ name, index, accentColor }) {
  return (
    <div className="card-hover p-5 flex items-center gap-4 group">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold font-display shrink-0 transition-transform group-hover:scale-110"
        style={{ backgroundColor: accentColor || '#0ea5e9' }}
      >
        {index}
      </div>
      <div>
        <h4 className="font-semibold text-surface-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {name}
        </h4>
        <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">Legend</p>
      </div>
    </div>
  );
}
