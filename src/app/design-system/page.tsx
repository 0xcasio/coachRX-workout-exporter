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
 * macOS/iOS Native Glassmorphism
 * Strong Blur × Generous Radius × Refined Elegance
 */
export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background p-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <header className="space-y-4 border-b border-white/10 pb-8">
          <h1 className="text-6xl lg:text-7xl font-semibold tracking-tight text-foreground">
            macOS/iOS Native
          </h1>
          <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-primary">
            Glassmorphism
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Crunch Orange × Lavender Accents × Modern Elegance
          </p>
        </header>

        {/* Color Palette */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight border-b border-white/10 pb-2">
            Color Palette
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <ColorSwatch
              name="Cascading White"
              color="bg-[#F6F6F6] border border-white/10"
              hex="#F6F6F6"
            />
            <ColorSwatch
              name="Chinese Silver"
              color="bg-[#E0DBF3]"
              hex="#E0DBF3"
            />
            <ColorSwatch
              name="Crunch (Primary)"
              color="bg-primary"
              hex="#F3BA60"
            />
            <ColorSwatch
              name="Dreamland"
              color="bg-[#B6B1C0]"
              hex="#B6B1C0"
            />
            <ColorSwatch
              name="Warm Haze"
              color="bg-[#736A6A]"
              hex="#736A6A"
            />
            <ColorSwatch
              name="Lead"
              color="bg-[#202022]"
              hex="#202022"
            />
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight border-b border-white/10 pb-2">
            Typography
          </h2>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Heading 1</p>
                <h1 className="text-6xl font-semibold tracking-tight">
                  Glassmorphism Design
                </h1>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Heading 2</p>
                <h2 className="text-4xl font-semibold tracking-tight">
                  Smooth & Elegant
                </h2>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Heading 3</p>
                <h3 className="text-3xl font-semibold tracking-tight">
                  Modern Aesthetic
                </h3>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Body Text</p>
                <p className="text-base leading-relaxed">
                  This is body text using the Inter font family. The design emphasizes
                  fitness-inspired aesthetics with vibrant purple and orange accents, strong backdrop blur,
                  and generous rounded corners. Every element feels energetic and modern.
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Monospace (Technical)</p>
                <p className="text-base font-mono">
                  const workoutData = extractFromScreenshot(image);
                  processWorkout(workoutData);
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Muted Text</p>
                <p className="text-base text-muted-foreground">
                  Secondary information and metadata displayed with reduced contrast.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Bento Grid Showcase */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight border-b border-white/10 pb-2">
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
          <h2 className="text-3xl font-semibold tracking-tight border-b border-white/10 pb-2">
            Buttons
          </h2>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <p className="text-xs text-muted-foreground mb-4">Variants</p>
                <div className="flex flex-wrap gap-4">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-4">Sizes</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-4">Interactive States</p>
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
          <h2 className="text-3xl font-semibold tracking-tight border-b border-white/10 pb-2">
            Form Elements
          </h2>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Input Field</label>
                <Input placeholder="Enter text..." />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Disabled Input</label>
                <Input placeholder="Disabled" disabled />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Focused Input</label>
                <Input placeholder="Click to focus" autoFocus />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Badges */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight border-b border-white/10 pb-2">
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
          <h2 className="text-3xl font-semibold tracking-tight border-b border-white/10 pb-2">
            Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Native macOS</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Strong backdrop blur with generous rounded corners. High transparency creates the signature macOS frosted glass effect.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Refined Polish</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Soft, diffused shadows and subtle borders. Every interaction feels smooth and native to Apple's design language.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Premium Feel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Pill-shaped buttons, smooth transitions, and elegant transparency. The design feels premium and polished.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Grid System */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight border-b border-white/10 pb-2">
            Grid System
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-12 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="col-span-1 h-12 rounded-xl border border-white/10 bg-primary/20 backdrop-blur-md flex items-center justify-center font-mono text-xs shadow-lg shadow-primary/10"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                12-column grid system for precise layouts
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
      <div className={`h-24 rounded-t-2xl ${color}`} />
      <CardContent className="p-3">
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-xs text-muted-foreground font-mono">{hex}</p>
      </CardContent>
    </Card>
  );
}
