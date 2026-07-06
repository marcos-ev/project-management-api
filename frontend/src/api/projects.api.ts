import { httpClient } from './http-client'
import type {
  CreateProjectDto,
  Project,
  ProjectStatus,
  UpdateProjectDto,
} from '../types/project'

export function listProjects(): Promise<Project[]> {
  return httpClient.get<Project[]>('/projects')
}

export function getProject(id: string): Promise<Project> {
  return httpClient.get<Project>(`/projects/${id}`)
}

export function createProject(dto: CreateProjectDto): Promise<Project> {
  return httpClient.post<Project>('/projects', dto)
}

export function updateProject(id: string, dto: UpdateProjectDto): Promise<Project> {
  return httpClient.patch<Project>(`/projects/${id}`, dto)
}

export function deleteProject(id: string): Promise<void> {
  return httpClient.delete<void>(`/projects/${id}`)
}

export function updateProjectStatus(id: string, status: ProjectStatus): Promise<Project> {
  return httpClient.patch<Project>(`/projects/${id}/status`, { status })
}
