export function ProjectCard({
  title,
  desc,
  href,
  color,
}: {
  title: string
  desc: string
  href?: string
  color: string
}) {
  return (
    <div className="card p-4" style={{ backgroundColor: color }}>
      <div>
        <h4 className="font-bold text-lg">{title}</h4>
        <p className="text-sm muted mb-3">{desc}</p>
        {href && (
          <a
            href={href}
            className="inline-block bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-3 py-1 rounded-full text-sm"
          >
            Ver proyecto
          </a>
        )}
      </div>
    </div>
  )
}
