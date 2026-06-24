import { notFound } from "next/navigation";
import { MapPin, Phone, Globe } from "lucide-react";

import { ConversionChat } from "@/components/conversion/conversion-chat";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { CATEGORY_LABELS } from "@/lib/constants";

export default async function ConversionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const workspace = await prisma.workspace.findUnique({
    where: { slug, onboardingComplete: true },
    include: { services: { orderBy: { sortOrder: "asc" } } },
  });

  if (!workspace) {
    notFound();
  }

  const socialLinks = workspace.socialLinks as Record<string, string> | null;

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 -z-10 hero-glow" />
      <header className="border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="section-container flex items-center gap-4 py-6">
          {workspace.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={workspace.logoUrl}
              alt={workspace.name}
              className="h-14 w-14 rounded-xl object-cover ring-1 ring-white/10"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">{workspace.name}</h1>
            {workspace.category && (
              <p className="text-sm text-slate-400">
                {CATEGORY_LABELS[workspace.category]}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="section-container py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-8">
            {workspace.description && (
              <p className="text-slate-300">{workspace.description}</p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              {workspace.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  {workspace.location}
                </span>
              )}
              {workspace.phone && (
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-accent" />
                  {workspace.phone}
                </span>
              )}
              {workspace.website && (
                <a
                  href={workspace.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white"
                >
                  <Globe className="h-4 w-4 text-accent" />
                  Website
                </a>
              )}
            </div>

            <div>
              <h2 className="mb-4 text-lg font-semibold text-white">Our services</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {workspace.services.map((service) => (
                  <Card key={service.id}>
                    <CardContent className="p-5">
                      <h3 className="font-medium text-white">{service.name}</h3>
                      {service.description && (
                        <p className="mt-1 text-sm text-slate-400">
                          {service.description}
                        </p>
                      )}
                      <div className="mt-3 flex gap-3 text-xs text-slate-500">
                        {service.price && <span>{service.price}</span>}
                        {service.duration && <span>{service.duration}</span>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div>
            <ConversionChat slug={slug} businessName={workspace.name} />
          </div>
        </div>
      </main>

      <footer className="mt-16 border-t border-white/5 py-8">
        <div className="section-container space-y-4 text-sm text-slate-500">
          {workspace.workingHours && (
            <p>
              <span className="font-medium text-slate-400">Hours: </span>
              {workspace.workingHours}
            </p>
          )}
          {workspace.policies && (
            <p>
              <span className="font-medium text-slate-400">Policies: </span>
              {workspace.policies.slice(0, 200)}
              {workspace.policies.length > 200 ? "..." : ""}
            </p>
          )}
          {socialLinks && Object.keys(socialLinks).length > 0 && (
            <div className="flex gap-4">
              {Object.entries(socialLinks).map(
                ([key, value]) =>
                  value && (
                    <span key={key} className="capitalize">
                      {key}: {value}
                    </span>
                  )
              )}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
