'use client'

import React from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { ProjectCard } from '@/components/ProjectCard'
import { useLanguage } from '@/contexts/LanguageContext'

export function ProjectsView({ projects }: { projects: any[] }) {
  const { t } = useLanguage()

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">{t.projects.title}</h1>
           <p className="text-muted-foreground mt-1">Manage your AI-generated websites.</p>
        </div>
        <Link 
            href="/generate" 
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-transform hover:scale-105"
        >
            <Plus className="mr-2 h-4 w-4" />
            {t.projects.create}
        </Link>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
            <h3 className="text-lg font-medium">{t.projects.noSites}</h3>
            <p className="text-muted-foreground mt-2 mb-6">Start building your first website in seconds.</p>
            <Link 
                href="/generate" 
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
                {t.projects.create}
            </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((site) => (
                <ProjectCard key={site.id} site={site} />
            ))}
        </div>
      )}
    </div>
  )
}
