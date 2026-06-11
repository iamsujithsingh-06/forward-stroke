export default function CategoryCard({ item, accentColor }) {
  return (
    <div
      className="card-hover p-5 text-center group cursor-pointer"
      style={{
        borderTopColor: accentColor || 'transparent',
        borderTopWidth: 3,
      }}
    >
      <span className="text-3xl block mb-3">{item.icon}</span>
      <h4 className="text-sm font-bold font-display uppercase tracking-wide text-surface-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {item.label}
      </h4>
    </div>
  );
}
