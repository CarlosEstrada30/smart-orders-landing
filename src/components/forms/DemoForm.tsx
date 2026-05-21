import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  empresa: z.string().min(2, 'El nombre de la empresa es requerido'),
  whatsapp: z
    .string()
    .min(8, 'Ingresa un número de WhatsApp válido')
    .regex(/^[\+\d\s\-()]+$/, 'Formato de número inválido'),
  email: z.string().email('Ingresa un correo electrónico válido'),
  mensaje: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const WHATSAPP_NUMBER = '50200000000';
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%2C%20quiero%20una%20demo%20de%20SmartOrders`;

export default function DemoForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Hubo un error al enviar tu solicitud.');
      }

      window.location.href = '/gracias';
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : 'Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-[#0f172a] mb-1">Agenda tu demo gratuita</h3>
      <p className="text-sm text-[#475569] mb-6">Te contactamos en menos de 24 horas.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Nombre completo */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-[#0f172a] mb-1">
            Nombre completo <span className="text-red-500">*</span>
          </label>
          <input
            id="nombre"
            type="text"
            placeholder="Juan García"
            className={`w-full px-3 py-2.5 text-sm rounded-lg border transition-colors outline-none focus:ring-2 focus:ring-[#2563EB]/20 ${
              errors.nombre
                ? 'border-red-400 bg-red-50'
                : 'border-[#e2e8f0] bg-white hover:border-[#2563EB]/50 focus:border-[#2563EB]'
            }`}
            {...register('nombre')}
          />
          {errors.nombre && (
            <p className="mt-1 text-xs text-red-500">{errors.nombre.message}</p>
          )}
        </div>

        {/* Empresa */}
        <div>
          <label htmlFor="empresa" className="block text-sm font-medium text-[#0f172a] mb-1">
            Empresa / Fábrica de lácteos <span className="text-red-500">*</span>
          </label>
          <input
            id="empresa"
            type="text"
            placeholder="Lácteos San José"
            className={`w-full px-3 py-2.5 text-sm rounded-lg border transition-colors outline-none focus:ring-2 focus:ring-[#2563EB]/20 ${
              errors.empresa
                ? 'border-red-400 bg-red-50'
                : 'border-[#e2e8f0] bg-white hover:border-[#2563EB]/50 focus:border-[#2563EB]'
            }`}
            {...register('empresa')}
          />
          {errors.empresa && (
            <p className="mt-1 text-xs text-red-500">{errors.empresa.message}</p>
          )}
        </div>

        {/* WhatsApp */}
        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-[#0f172a] mb-1">
            WhatsApp <span className="text-red-500">*</span>
          </label>
          <input
            id="whatsapp"
            type="tel"
            placeholder="+502 1234-5678"
            className={`w-full px-3 py-2.5 text-sm rounded-lg border transition-colors outline-none focus:ring-2 focus:ring-[#2563EB]/20 ${
              errors.whatsapp
                ? 'border-red-400 bg-red-50'
                : 'border-[#e2e8f0] bg-white hover:border-[#2563EB]/50 focus:border-[#2563EB]'
            }`}
            {...register('whatsapp')}
          />
          {errors.whatsapp && (
            <p className="mt-1 text-xs text-red-500">{errors.whatsapp.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#0f172a] mb-1">
            Correo electrónico <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="juan@lacteos.com"
            className={`w-full px-3 py-2.5 text-sm rounded-lg border transition-colors outline-none focus:ring-2 focus:ring-[#2563EB]/20 ${
              errors.email
                ? 'border-red-400 bg-red-50'
                : 'border-[#e2e8f0] bg-white hover:border-[#2563EB]/50 focus:border-[#2563EB]'
            }`}
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Mensaje opcional */}
        <div>
          <label htmlFor="mensaje" className="block text-sm font-medium text-[#0f172a] mb-1">
            ¿Cuántos pedidos manejan al día aprox.?{' '}
            <span className="text-[#475569] font-normal">(opcional)</span>
          </label>
          <textarea
            id="mensaje"
            rows={3}
            placeholder="Ej: unos 30-40 pedidos diarios..."
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#e2e8f0] bg-white hover:border-[#2563EB]/50 focus:border-[#2563EB] transition-colors outline-none focus:ring-2 focus:ring-[#2563EB]/20 resize-none"
            {...register('mensaje')}
          />
        </div>

        {/* Server error */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-600">{serverError}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#059669] hover:bg-[#047857] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm"
        >
          {isSubmitting ? 'Enviando...' : 'Agendar demo gratis'}
        </button>
      </form>

      {/* WhatsApp alternative */}
      <div className="mt-6 pt-5 border-t border-[#e2e8f0] text-center">
        <p className="text-sm text-[#475569] mb-3">¿Prefieres WhatsApp?</p>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border-2 border-[#059669] text-[#059669] hover:bg-[#059669] hover:text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Escríbenos directo →
        </a>
      </div>
    </div>
  );
}
