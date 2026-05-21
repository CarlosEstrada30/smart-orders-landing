import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: '¿Cuánto tiempo toma implementar SmartOrders?',
    answer:
      '48 horas en la mayoría de casos. Nosotros cargamos tus productos, clientes y rutas. Tu equipo solo tiene que revisar y empezar a usar.',
  },
  {
    question: '¿Necesita instalación o hardware especial?',
    answer:
      'No. Funciona en cualquier navegador, computadora o celular. No necesitas instalar nada ni comprar equipo nuevo.',
  },
  {
    question: '¿Cómo funciona la integración con WhatsApp?',
    answer:
      'Conectas el número de WhatsApp de tu empresa y el sistema envía automáticamente el comprobante de cada pedido al cliente. Sin intervención manual.',
  },
  {
    question: '¿Puedo probar el sistema antes de pagar?',
    answer:
      'Sí. Hacemos una demo completa con datos parecidos a tu operación. Después tienes 14 días para probarlo sin compromiso.',
  },
  {
    question: '¿Funciona si mis clientes ya están acostumbrados a pedir por WhatsApp?',
    answer:
      'Sí. Tu equipo puede seguir recibiendo pedidos por WhatsApp y registrarlos en SmartOrders. El cambio es gradual y a tu ritmo.',
  },
  {
    question: '¿Qué pasa con mis datos si decido cancelar?',
    answer:
      'Son tuyos. Puedes exportar todo en cualquier momento, sin trabas ni costos adicionales.',
  },
  {
    question: '¿Tienen soporte en español?',
    answer:
      'Sí. Soporte 100% en español por WhatsApp y correo. Tiempo de respuesta: menos de 4 horas en horario laboral.',
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 text-[#475569] transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border border-[#e2e8f0] rounded-xl overflow-hidden"
        >
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-[#f8fafc] transition-colors"
            onClick={() => toggle(index)}
            aria-expanded={openIndex === index}
          >
            <span className="text-sm font-semibold text-[#0f172a] pr-4">
              {faq.question}
            </span>
            <ChevronIcon open={openIndex === index} />
          </button>

          <div
            className={`overflow-hidden transition-all duration-200 ease-in-out ${
              openIndex === index ? 'max-h-48' : 'max-h-0'
            }`}
          >
            <div className="px-5 pb-4 pt-1 bg-white">
              <p className="text-sm text-[#475569] leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
