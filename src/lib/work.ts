import { getProjectsFromSheet, getCaseStudiesFromSheet } from './sheets';
import { WorkItem, WorkCategory } from './types';

export async function getAllWork(): Promise<WorkItem[]> {
  const [projects, caseStudies] = await Promise.all([
    getProjectsFromSheet(),
    getCaseStudiesFromSheet(),
  ]);
  // Sort each type independently — case study order values (1, 2, 3…) are
  // relative to each other, not to projects, so merging then sorting would
  // interleave them incorrectly.
  const sortedProjects = [...projects].sort((a, b) => a.order - b.order);
  const sortedCaseStudies = [...caseStudies].sort((a, b) => a.order - b.order);
  return [...sortedProjects, ...sortedCaseStudies];
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
