import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../api/http-client'
import { getProject } from '../api/projects.api'
import type { Project } from '../types/project'

interface UseProjectResult {
  project: Project | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useProject(id: string | null): UseProjectResult {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProject = useCallback(async () => {
    if (!id) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await getProject(id)
      setProject(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Falha ao carregar o projeto.')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchProject()
  }, [fetchProject])

  return { project, isLoading, error, refetch: fetchProject }
}
