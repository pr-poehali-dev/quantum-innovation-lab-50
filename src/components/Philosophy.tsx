import { useEffect, useRef, useState } from "react"
import { HighlightedText } from "./HighlightedText"

const philosophyItems = [
  {
    title: "Качество материалов",
    description:
      "Используем только проверенную плитку от ведущих производителей. Каждый материал проходит проверку на морозостойкость и прочность — ваше покрытие прослужит десятки лет.",
  },
  {
    title: "Точность укладки",
    description:
      "Соблюдаем уклоны для отвода воды, готовим основание по всем правилам. Никаких перекосов, просадок и луж — только ровная, красивая поверхность.",
  },
  {
    title: "Сроки без срывов",
    description:
      "Работаем по договору с фиксированными сроками. Начали — значит закончим вовремя. Оставляем объект чистым и аккуратным после завершения работ.",
  },
  {
    title: "Гарантия на работу",
    description: "Даём письменную гарантию на все выполненные работы. Если что-то пойдёт не так — устраним за свой счёт. Ваше спокойствие важнее всего.",
  },
]

export function Philosophy() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"))
          if (entry.isIntersecting) {
            setVisibleItems((prev) => [...new Set([...prev, index])])
          }
        })
      },
      { threshold: 0.3 },
    )

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="py-32 md:py-29">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left column - Title and image */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Наш подход</p>
            <h2 className="text-6xl md:text-6xl font-medium leading-[1.15] tracking-tight mb-6 text-balance lg:text-8xl">
              Работаем
              <br />
              <HighlightedText>на совесть</HighlightedText>
            </h2>

            <div className="relative hidden lg:block">
              <img
                src="https://cdn.poehali.dev/projects/831690cf-0f7d-4d36-8282-314f9d648f4d/files/eac35ce7-2fd8-461c-bc27-fe410841688d.jpg"
                alt="Укладка тротуарной плитки"
                className="opacity-90 relative z-10 w-auto rounded-lg"
              />
            </div>
          </div>

          {/* Right column - Description and Philosophy items */}
          <div className="space-y-6 lg:pt-48">
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md mb-12">
              Укладка плитки — это не просто работа, это ваша дорожка к дому, двор, где играют дети, парковка у офиса. Делаем всё так, чтобы вам было приятно возвращаться домой каждый день.
            </p>

            {philosophyItems.map((item, index) => (
              <div
                key={item.title}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                data-index={index}
                className={`transition-all duration-700 ${
                  visibleItems.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-6">
                  <span className="text-muted-foreground/50 text-sm font-medium">0{index + 1}</span>
                  <div>
                    <h3 className="text-xl font-medium mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}