import { getProjectsFromSheet } from './sheets';
import { WorkItem, WorkCategory } from './types';

export async function getAllWork(): Promise<WorkItem[]> {
  const projects = await getProjectsFromSheet();
  // Case studies tab will be wired in once GID is confirmed
  return projects.sort((a, b) => a.order - b.order);
}

export async function getWorkBySlug(slug: string): Promise<WorkItem | undefined> {
  const all = await getAllWork();
  return all.find((item) => item.slug === slug);
}

export async function getWorkByCategory(category: WorkCategory): Promise<WorkItem[]> {
  const all = await getAllWork();
  return all.filter((item) => item.category === category);
}

export async function getFeaturedWork(): Promise<WorkItem[]> {
  const all = await getAllWork();
  return all.filter((item) => item.featured);
}

export async function getAllWorkSlugs(): Promise<string[]> {
  const all = await getAllWork();
  return all.map((item) => item.slug);
}
