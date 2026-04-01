import { useState } from "react"
import { Plus } from "lucide-react"

const faqs = [
  {
    question: "В каких районах Перми вы работаете?",
    answer:
      "Работаем по всей Перми и Пермскому краю. Выезжаем в Краснокамск, Березники, Соликамск и другие города региона. Стоимость выезда за пределы Перми обсуждается индивидуально.",
  },
  {
    question: "Сколько времени займёт укладка?",
    answer:
      "Зависит от площади объекта. Частный двор площадью 50–100 м² обычно занимает 3–5 рабочих дней с учётом подготовки основания. Крупные объекты рассчитываем индивидуально на замере.",
  },
  {
    question: "Какую плитку вы используете?",
    answer:
      "Работаем с проверенными производителями. Чаще всего используем вибропрессованную плитку — она морозостойкая, прочная и хорошо держит цвет. Также предлагаем клинкер и натуральный камень по запросу.",
  },
  {
    question: "Делаете ли вы подготовку основания?",
    answer:
      "Да, подготовка основания — обязательная часть нашей работы. Без правильной подушки из щебня и песка плитка быстро просядет. Мы делаем всё по технологии, чтобы покрытие служило долгие годы.",
  },
  {
    question: "Даёте ли вы гарантию на работу?",
    answer:
      "Да, даём письменную гарантию на выполненные работы. Если в гарантийный период возникнут просадки или другие дефекты по нашей вине — устраним бесплатно.",
  },
  {
    question: "Как рассчитать стоимость и с чего начать?",
    answer:
      "Позвоните нам или оставьте заявку — мы приедем на бесплатный замер, оценим объём работ и назовём точную цену. Всё фиксируем в договоре, никаких скрытых платежей.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 md:py-29">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-16">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Вопросы</p>
          <h2 className="text-6xl font-medium leading-[1.15] tracking-tight mb-6 text-balance lg:text-7xl">
            Частые вопросы
          </h2>
        </div>

        <div>
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-border">
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full py-6 flex items-start justify-between gap-6 text-left group"
              >
                <span className="text-lg font-medium text-foreground transition-colors group-hover:text-foreground/70">
                  {faq.question}
                </span>
                <Plus
                  className={`w-6 h-6 text-foreground flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-45" : "rotate-0"
                  }`}
                  strokeWidth={1.5}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-muted-foreground leading-relaxed pb-6 pr-12">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}