import { useState, useEffect, useRef } from "react"
import { ArrowUpRight } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "Частный двор на Садовой",
    category: "Частный двор",
    location: "Пермь, Свердловский район",
    year: "2024",
    image: "https://cdn.poehali.dev/projects/831690cf-0f7d-4d36-8282-314f9d648f4d/files/f1d67d5d-7d15-445a-9f88-ee1787c1ddcc.jpg",
  },
  {
    id: 2,
    title: "Парковка торгового центра",
    category: "Коммерческий объект",
    location: "Пермь, Индустриальный район",
    year: "2024",
    image: "https://cdn.poehali.dev/projects/831690cf-0f7d-4d36-8282-314f9d648f4d/files/444ecf70-1e9b-4dd5-9332-58fdfa04b4d0.jpg",
  },
  {
    id: 3,
    title: "Пешеходная дорожка в посёлке",
    category: "Загородный участок",
    location: "Пермский край, Краснокамск",
    year: "2023",
    image: "https://cdn.poehali.dev/projects/831690cf-0f7d-4d36-8282-314f9d648f4d/files/c015fdc4-6287-4396-9f10-88c6175742be.jpg",
  },
  {
    id: 4,
    title: "Территория жилого комплекса",
    category: "Многоквартирный дом",
    location: "Пермь, Кировский район",
    year: "2023",
    image: "https://cdn.poehali.dev/projects/831690cf-0f7d-4d36-8282-314f9d648f4d/files/922ed28b-b9ac-42ce-b2ce-dd439f638fdb.jpg",
  },
]

export function Projects() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [revealedImages, setRevealedImages] = useState<Set<number>>(new Set())
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = imageRefs.current.indexOf(entry.target as HTMLDivElement)
            if (index !== -1) {
              setRevealedImages((prev) => new Set(prev).add(projects[index].id))
            }
          }
        })
      },
      { threshold: 0.2 },
    )

    imageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="projects" className="py-32 md:py-29 bg-secondary/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Наши работы</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">Выполненные объекты</h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            Смотреть все проекты
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div ref={(el) => (imageRefs.current[index] = el)} className="relative overflow-hidden aspect-[4/3] mb-6">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    hoveredId === project.id ? "scale-105" : "scale-100"
                  }`}
                />
                <div
                  className="absolute inset-0 bg-primary origin-top"
                  style={{
                    transform: revealedImages.has(project.id) ? "scaleY(0)" : "scaleY(1)",
                    transition: "transform 1.5s cubic-bezier(0.76, 0, 0.24, 1)",
                  }}
                />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-medium mb-2 group-hover:underline underline-offset-4">{project.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {project.category} · {project.location}
                  </p>
                </div>
                <span className="text-muted-foreground/60 text-sm">{project.year}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}