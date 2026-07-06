import { useState } from 'react'
import { ApiError } from '../api/http-client'
import {
  createProject,
  deleteProject,
  updateProject,
  updateProjectStatus,
} from '../api/projects.api'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { Modal } from '../components/Modal'
import { ProjectDetail } from '../components/ProjectDetail'
import { ProjectForm } from '../components/ProjectForm'
import { ProjectList } from '../components/ProjectList'
import { useToast } from '../components/Toast'
import { useProjects } from '../hooks/useProjects'
import type { CreateProjectDto, Project, ProjectStatus } from '../types/project'

type FormModalState = { mode: 'create' } | { mode: 'edit'; project: Project } | null

interface DetailModalState {
  project: Project
  autoGenerateAnalysis: boolean
}

function extractErrorMessage(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback
}

export function ProjectsPage() {
  const { projects, isLoading, error, refetch } = useProjects()
  const { showSuccess, showError } = useToast()

  const [formModal, setFormModal] = useState<FormModalState>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [detailModal, setDetailModal] = useState<DetailModalState | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const [projectPendingDeletion, setProjectPendingDeletion] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleFormSubmit(values: CreateProjectDto) {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      if (formModal?.mode === 'edit') {
        await updateProject(formModal.project.id, values)
        showSuccess('Projeto atualizado com sucesso.')
      } else {
        await createProject(values)
        showSuccess('Projeto criado com sucesso.')
      }
      setFormModal(null)
      await refetch()
    } catch (err) {
      setSubmitError(extractErrorMessage(err, 'Falha ao salvar o projeto.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleConfirmDelete() {
    if (!projectPendingDeletion) return
    setIsDeleting(true)
    try {
      await deleteProject(projectPendingDeletion.id)
      showSuccess('Projeto removido com sucesso.')
      setProjectPendingDeletion(null)
      await refetch()
    } catch (err) {
      showError(extractErrorMessage(err, 'Falha ao remover o projeto.'))
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleAdvanceStatus(nextStatus: ProjectStatus) {
    if (!detailModal) return
    setIsUpdatingStatus(true)
    try {
      const updated = await updateProjectStatus(detailModal.project.id, nextStatus)
      setDetailModal({ ...detailModal, project: updated, autoGenerateAnalysis: false })
      showSuccess(
        nextStatus === 'CANCELADO'
          ? 'Projeto cancelado com sucesso.'
          : 'Status do projeto atualizado com sucesso.',
      )
      await refetch()
    } catch (err) {
      showError(extractErrorMessage(err, 'Falha ao atualizar o status do projeto.'))
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  async function handleCancelProject() {
    await handleAdvanceStatus('CANCELADO')
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Projetos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie o portfólio de projetos e acompanhe status, risco e orçamento.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSubmitError(null)
            setFormModal({ mode: 'create' })
          }}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Novo projeto
        </button>
      </div>

      {isLoading && <LoadingState label="Carregando projetos..." />}

      {!isLoading && error && <ErrorState message={error} onRetry={refetch} />}

      {!isLoading && !error && projects.length === 0 && (
        <EmptyState
          action={
            <button
              type="button"
              onClick={() => setFormModal({ mode: 'create' })}
              className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Novo projeto
            </button>
          }
        />
      )}

      {!isLoading && !error && projects.length > 0 && (
        <ProjectList
          projects={projects}
          onView={(project) => setDetailModal({ project, autoGenerateAnalysis: false })}
          onEdit={(project) => {
            setSubmitError(null)
            setFormModal({ mode: 'edit', project })
          }}
          onDelete={setProjectPendingDeletion}
          onRequestAiAnalysis={(project) =>
            setDetailModal({ project, autoGenerateAnalysis: true })
          }
        />
      )}

      {formModal && (
        <Modal
          title={formModal.mode === 'edit' ? 'Editar projeto' : 'Novo projeto'}
          onClose={() => setFormModal(null)}
        >
          <ProjectForm
            project={formModal.mode === 'edit' ? formModal.project : null}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onSubmit={handleFormSubmit}
            onCancel={() => setFormModal(null)}
          />
        </Modal>
      )}

      {detailModal && (
        <ProjectDetail
          project={detailModal.project}
          onClose={() => setDetailModal(null)}
          onAdvanceStatus={handleAdvanceStatus}
          onCancelProject={handleCancelProject}
          isUpdatingStatus={isUpdatingStatus}
          autoGenerateAnalysis={detailModal.autoGenerateAnalysis}
        />
      )}

      {projectPendingDeletion && (
        <ConfirmDialog
          title="Remover projeto"
          message={`Tem certeza que deseja remover o projeto "${projectPendingDeletion.nome}"? Essa ação não pode ser desfeita.`}
          confirmLabel="Remover"
          isDanger
          isConfirming={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setProjectPendingDeletion(null)}
        />
      )}
    </div>
  )
}
