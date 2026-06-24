"use client";

import { useState } from "react";

import { BusinessInfoForm } from "@/components/onboarding/business-info-form";
import { KnowledgeForm } from "@/components/onboarding/knowledge-form";
import { ServicesForm } from "@/components/onboarding/services-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import type { Workspace, Service } from "@prisma/client";

type WorkspaceWithServices = Workspace & { services: Service[] };

export function SettingsTabs({ workspace }: { workspace: WorkspaceWithServices }) {
  const [tab, setTab] = useState("profile");

  const socialLinks = (workspace.socialLinks as {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  }) ?? {};

  const faq = (workspace.faq as { question: string; answer: string }[]) ?? [];

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="profile">Business profile</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="knowledge">AI knowledge</TabsTrigger>
        <TabsTrigger value="page">Conversion page</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <BusinessInfoForm
          defaultValues={{
            name: workspace.name,
            logoUrl: workspace.logoUrl ?? "",
            description: workspace.description ?? "",
            location: workspace.location ?? "",
            phone: workspace.phone ?? "",
            website: workspace.website ?? "",
            socialLinks,
          }}
          settingsMode
        />
      </TabsContent>

      <TabsContent value="services">
        <ServicesForm
          defaultServices={workspace.services.map((s) => ({
            name: s.name,
            description: s.description ?? "",
            price: s.price ?? "",
            duration: s.duration ?? "",
          }))}
          settingsMode
        />
      </TabsContent>

      <TabsContent value="knowledge">
        <KnowledgeForm
          defaultValues={{
            faq,
            policies: workspace.policies ?? "",
            workingHours: workspace.workingHours ?? "",
            knowledgeNotes: workspace.knowledgeNotes ?? "",
          }}
          settingsMode
        />
      </TabsContent>

      <TabsContent value="page">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div>
              <p className="text-sm text-slate-400">Public URL</p>
              <code className="mt-1 block rounded-lg bg-black/30 px-3 py-2 text-sm text-accent">
                /b/{workspace.slug}
              </code>
            </div>
            <div>
              <p className="text-sm text-slate-400">Working hours</p>
              <p className="mt-1 text-sm text-white">
                {workspace.workingHours ?? "Not set"}
              </p>
            </div>
            <a
              href={`/b/${workspace.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-accent hover:underline"
            >
              Preview conversion page →
            </a>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
