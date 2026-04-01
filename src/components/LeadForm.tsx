import { useState } from "react"
import Icon from "@/components/ui/icon"

const SUBMIT_URL = "https://functions.poehali.dev/abb03e1a-b3f8-4848-b237-f928bf7e8cc2"

export function LeadForm() {
  const [form, setForm] = useState({ name: "", phone: "", address: "", area: "", message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus("success")
        setForm({ name: "", phone: "", address: "", area: "", message: "" })
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id="lead-form" className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-12">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Бесплатно</p>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground">
            Заявка на замер
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Оставьте заявку — приедем, замерим и рассчитаем стоимость бесплатно
          </p>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
              <Icon name="CheckCheck" size={32} className="text-orange-500" />
            </div>
            <h3 className="text-2xl font-medium text-foreground">Заявка принята!</h3>
            <p className="text-muted-foreground max-w-sm">
              Мы перезвоним вам в течение 30 минут и согласуем удобное время выезда.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 text-sm text-orange-500 hover:text-orange-600 underline underline-offset-4"
            >
              Отправить ещё одну заявку
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">Ваше имя *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Иван Иванов"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">Телефон *</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+7 (___) ___-__-__"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Адрес объекта</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Пермь, ул. Ленина 5"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Примерная площадь (м²)</label>
              <input
                name="area"
                value={form.area}
                onChange={handleChange}
                placeholder="Например: 50"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Комментарий</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={3}
                placeholder="Что нужно сделать, пожелания по плитке..."
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition resize-none"
              />
            </div>

            {status === "error" && (
              <p className="text-red-500 text-sm">Что-то пошло не так. Позвоните нам: +7 (958) 882-89-84</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-4 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium text-base tracking-wide transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <Icon name="Loader2" size={18} className="animate-spin" />
                  Отправляем...
                </>
              ) : (
                <>
                  <Icon name="CalendarCheck" size={18} />
                  Записаться на бесплатный замер
                </>
              )}
            </button>

            <p className="text-xs text-center text-muted-foreground">
              Нажимая кнопку, вы соглашаетесь на обработку персональных данных
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
