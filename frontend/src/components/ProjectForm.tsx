import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { CreateProjectDto, Project } from '../types/project'

const projectFormSchema = z
  .object({
    nome: z.string().trim().min(1, 'Informe o nome do projeto'),
    dataInicio: z.string().min(1, 'Informe a data de início'),
    previsaoTermino: z.string().min(1, 'Informe a previsão de término'),
    orcamentoTotal: z
      .number({ error: 'Informe um valor numérico' })
      .positive('O orçamento deve ser maior que zero'),
    descricao: z.string().trim().min(1, 'Informe a descrição do projeto'),
  })
  .refine((data) => data.previsaoTermino >= data.dataInicio, {
    message: 'A previsão de término deve ser igual ou posterior à data de início',
    path: ['previsaoTermino'],
  })

export type ProjectFormValues = z.infer<typeof projectFormSchema>

interface ProjectFormProps {
  project?: Project | null
  isSubmitting: boolean
  submitError: string | null
  onSubmit: (values: CreateProjectDto) => void
  onCancel: () => void
}

export function ProjectForm({
  project,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      nome: '',
      dataInicio: '',
      previsaoTermino: '',
      orcamentoTotal: 0,
      descricao: '',
    },
  })

  useEffect(() => {
    if (project) {
      reset({
        nome: project.nome,
        dataInicio: project.dataInicio,
        previsaoTermino: project.previsaoTermino,
        orcamentoTotal: project.orcamentoTotal,
        descricao: project.descricao,
      })
    }
  }, [project, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
          Nome
        </label>
        <input
          id="nome"
          type="text"
          {...register('nome')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.nome && <p className="mt-1 text-xs text-red-600">{errors.nome.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700">
            Data de início
          </label>
          <input
            id="dataInicio"
            type="date"
            {...register('dataInicio')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.dataInicio && (
            <p className="mt-1 text-xs text-red-600">{errors.dataInicio.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="previsaoTermino" className="block text-sm font-medium text-gray-700">
            Previsão de término
          </label>
          <input
            id="previsaoTermino"
            type="date"
            {...register('previsaoTermino')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.previsaoTermino && (
            <p className="mt-1 text-xs text-red-600">{errors.previsaoTermino.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="orcamentoTotal" className="block text-sm font-medium text-gray-700">
          Orçamento total (R$)
        </label>
        <input
          id="orcamentoTotal"
          type="number"
          step="0.01"
          min="0"
          {...register('orcamentoTotal', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.orcamentoTotal && (
          <p className="mt-1 text-xs text-red-600">{errors.orcamentoTotal.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          id="descricao"
          rows={4}
          {...register('descricao')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.descricao && (
          <p className="mt-1 text-xs text-red-600">{errors.descricao.message}</p>
        )}
      </div>

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Salvando...' : project ? 'Salvar alterações' : 'Criar projeto'}
        </button>
      </div>
    </form>
  )
}
