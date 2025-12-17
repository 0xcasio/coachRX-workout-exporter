"use client";

import { BentoGrid, BentoCard } from "@/components/bento-grid";
import { FeatureCard } from "@/components/feature-card";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Database,
  Shield,
  TrendingUp,
  Upload,
  BarChart3,
} from "lucide-react";

/**
 * Design System Showcase Page
 * 
 * Clinical Performance Brutalism
 * Neo-Brutalism × Medical/Clinical × Tech Utility
 */
export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background p-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <header className="space-y-4 border-b-2 border-border pb-8">
          <h1 className="text-6xl lg:text-7xl font-bold uppercase tracking-tight text-foreground">
            Clinical Performance
          </h1>
          <h2 className="text-4xl lg:text-5xl font-bold uppercase tracking-tight text-primary">
            Brutalism
          </h2>
          <p className="text-lg text-muted-foreground font-mono uppercase tracking-wider max-w-2xl">
            Neo-Brutalism × Medical/Clinical × Tech Utility
          </p>
        </header>

        {/* Color Palette */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold uppercase tracking-tight border-b-2 border-border pb-2">
            Color Palette
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <ColorSwatch
              name="Background"
              color="bg-background border-2 border-foreground"
              hex="#0D0D0D"
            />
            <ColorSwatch
              name="Foreground"
              color="bg-foreground"
              hex="#FAFAFA"
            />
            <ColorSwatch
              name="Primary (Cyan)"
              color="bg-primary"
              hex="#00D9FF"
            />
            <ColorSwatch
              name="Accent (Green)"
              color="bg-accent"
              hex="#00FF88"
            />
            <ColorSwatch
              name="Destructive"
              color="bg-destructive"
              hex="#FF4444"
            />
            <ColorSwatch
              name="Card"
              color="bg-card border-2 border-border"
              hex="#141414"
            />
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold uppercase tracking-tight border-b-2 border-border pb-2">
            Typography
          </h2>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase mb-2">Heading 1</p>
                <h1 className="text-6xl font-bold uppercase tracking-tight">
                  CLINICAL PERFORMANCE
                </h1>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase mb-2">Heading 2</p>
                <h2 className="text-4xl font-bold uppercase tracking-tight">
                  BRUTALIST DESIGN
                </h2>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase mb-2">Heading 3</p>
                <h3 className="text-3xl font-bold uppercase tracking-tight">
                  HIGH CONTRAST
                </h3>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase mb-2">Body Text</p>
                <p className="text-base leading-relaxed">
                  This is body text using the Inter font family. The design emphasizes
                  functionality, clarity, and technical precision. Every element serves
                  a purpose.
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase mb-2">Monospace (Technical)</p>
                <p className="text-base font-mono">
                  const workoutData = extractFromScreenshot(image);
                  processWorkout(workoutData);
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase mb-2">Muted Text</p>
                <p className="text-base text-muted-foreground">
                  Secondary information and metadata displayed with reduced contrast.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Bento Grid Showcase */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold uppercase tracking-tight border-b-2 border-border pb-2">
            Bento Grid Layout
          </h2>
          <BentoGrid>
            <BentoCard span="col-span-1 md:col-span-2 lg:col-span-2">
              <FeatureCard
                icon={Sparkles}
                title="AI-Powered Extraction"
                description="Harness the power of Google Gemini 2.0 Flash to automatically extract workout data from screenshots with near-perfect accuracy."
              />
            </BentoCard>
            <BentoCard>
              <FeatureCard
                icon={Database}
                title="Own Your Data"
                description="Your workout data belongs to you. Export, analyze, and use it however you want."
              />
            </BentoCard>
            <BentoCard>
              <FeatureCard
                icon={BarChart3}
                title="Visual Analytics"
                description="Track your progress with precise charts and data-driven insights into your training patterns."
              />
            </BentoCard>
            <BentoCard span="col-span-1 md:col-span-2">
              <FeatureCard
                icon={TrendingUp}
                title="Gym Cost Tracker"
                description="Calculate your cost per workout and see the value of your training investment over time."
              />
            </BentoCard>
            <BentoCard>
              <FeatureCard
                icon={Shield}
                title="Privacy First"
                description="Row-Level Security ensures your data is yours alone. Industry-standard encryption and privacy practices."
              />
            </BentoCard>
            <BentoCard>
              <FeatureCard
                icon={Upload}
                title="Easy Upload"
                description="Simply drag and drop your CoachRX screenshots. Our AI handles the rest automatically."
              />
            </BentoCard>
          </BentoGrid>
        </section>

        {/* Buttons */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold uppercase tracking-tight border-b-2 border-border pb-2">
            Buttons
          </h2>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase mb-4">Variants</p>
                <div className="flex flex-wrap gap-4">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase mb-4">Sizes</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase mb-4">Interactive States</p>
                <div className="flex flex-wrap gap-4">
                  <Button>Normal</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Form Elements */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold uppercase tracking-tight border-b-2 border-border pb-2">
            Form Elements
          </h2>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="text-sm font-bold uppercase mb-2 block">Input Field</label>
                <Input placeholder="Enter text..." />
              </div>
              <div>
                <label className="text-sm font-bold uppercase mb-2 block">Disabled Input</label>
                <Input placeholder="Disabled" disabled />
              </div>
              <div>
                <label className="text-sm font-bold uppercase mb-2 block">Focused Input</label>
                <Input placeholder="Click to focus" autoFocus />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Badges */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold uppercase tracking-tight border-b-2 border-border pb-2">
            Badges
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cards */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold uppercase tracking-tight border-b-2 border-border pb-2">
            Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sharp edges, bold borders, high contrast. Functional over decorative.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Technical</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Data-driven design with clinical precision and utility.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Brutalist</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Raw, unpolished, honest. No unnecessary decoration.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Grid System */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold uppercase tracking-tight border-b-2 border-border pb-2">
            Grid System
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-12 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="col-span-1 h-12 border-2 border-primary bg-primary/10 flex items-center justify-center font-mono text-xs"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4 font-mono">
                // 12-column grid system for precise layouts
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

/**
 * ColorSwatch Component
 * 
 * Displays a color swatch with name and hex value
 */
function ColorSwatch({
  name,
  color,
  hex,
}: {
  name: string;
  color: string;
  hex: string;
}) {
  return (
    <Card>
      <div className={`h-24 ${color}`} />
      <CardContent className="p-3">
        <p className="text-sm font-bold uppercase">{name}</p>
        <p className="text-xs text-muted-foreground font-mono">{hex}</p>
      </CardContent>
    </Card>
  );
}
