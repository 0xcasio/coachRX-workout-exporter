"use client";

import Link from "next/link";
import { BentoGrid, BentoCard } from "@/components/bento-grid";
import { FeatureCard } from "@/components/feature-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sparkles,
  Database,
  Shield,
  TrendingUp,
  Upload,
  BarChart3,
  ArrowRight,
  Zap,
} from "lucide-react";

/**
 * LandingPage Component
 * 
 * Clinical Performance Brutalism landing page for non-authenticated users.
 * Showcases app features in a Bento Grid layout with high-contrast, technical aesthetic.
 */
export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar - Only visible on desktop when signed out */}
      <header className="hidden md:block border-b border-white/10 bg-card/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
              <span>🏋️ CoachRX</span>
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle variant="outline" size="sm" />
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </SignInButton>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-white/10 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-3xl space-y-8">
            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-semibold tracking-tight text-foreground">
                Own Your
                <br />
                <span className="text-primary">Workout Data</span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl">
                Extract. Analyze. Export. No limits.
              </p>
            </div>

            {/* Value Proposition */}
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Break free from data lock-in. Transform your CoachRX screenshots into
              structured, exportable workout data using AI-powered extraction. Own your
              fitness journey with complete data sovereignty.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <SignUpButton mode="modal">
                <Button size="lg">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </SignInButton>
            </div>

            {/* Stats/Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-semibold text-primary">AI</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Powered Extraction
                </div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-primary">100%</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Your Data
                </div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-primary">∞</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Export Options
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-12 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
              Features
            </h2>
            <p className="text-lg text-muted-foreground">
              Technical. Precise. Powerful.
            </p>
          </div>

          <BentoGrid>
            {/* Feature 1: AI-Powered Extraction - Large */}
            <BentoCard span="col-span-1 md:col-span-2 lg:col-span-2">
              <FeatureCard
                icon={Sparkles}
                title="AI-Powered Extraction"
                description="Harness Google Gemini 2.0 Flash to automatically extract workout data from screenshots with near-perfect accuracy. No manual data entry. No errors. Just drop your screenshots and watch the AI work."
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Zap className="w-3 h-3" />
                  <span>Multimodal AI Processing</span>
                </div>
              </FeatureCard>
            </BentoCard>

            {/* Feature 2: Own Your Data */}
            <BentoCard>
              <FeatureCard
                icon={Database}
                title="Own Your Data"
                description="Your workout data belongs to you. Export to SQL, JSON, CSV, or any format you need. No vendor lock-in. Complete data sovereignty."
              >
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-xs border border-white/10 rounded-md bg-card/40 backdrop-blur-sm px-2 py-1">
                    SQL
                  </span>
                  <span className="text-xs border border-white/10 rounded-md bg-card/40 backdrop-blur-sm px-2 py-1">
                    JSON
                  </span>
                  <span className="text-xs border border-white/10 rounded-md bg-card/40 backdrop-blur-sm px-2 py-1">
                    CSV
                  </span>
                </div>
              </FeatureCard>
            </BentoCard>

            {/* Feature 3: Visual Analytics */}
            <BentoCard>
              <FeatureCard
                icon={BarChart3}
                title="Visual Analytics"
                description="Track your progress with precise charts and data-driven insights. Identify patterns, track PRs, and optimize your training."
              />
            </BentoCard>

            {/* Feature 4: Gym Cost Tracker - Wide */}
            <BentoCard span="col-span-1 md:col-span-2">
              <FeatureCard
                icon={TrendingUp}
                title="Gym Cost Tracker"
                description="Calculate your cost per workout and see the value of your training investment over time. Make data-driven decisions about your fitness spending."
              />
            </BentoCard>

            {/* Feature 5: Privacy First */}
            <BentoCard>
              <FeatureCard
                icon={Shield}
                title="Privacy First"
                description="Row-Level Security ensures your data is yours alone. Industry-standard encryption. No data sharing. No tracking. Just your workouts."
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
                  <Shield className="w-3 h-3" />
                  <span>RLS Enabled</span>
                </div>
              </FeatureCard>
            </BentoCard>

            {/* Feature 6: Easy Upload */}
            <BentoCard>
              <FeatureCard
                icon={Upload}
                title="Easy Upload"
                description="Simply drag and drop your CoachRX screenshots. Batch processing supported. Our AI handles the rest automatically."
              />
            </BentoCard>
          </BentoGrid>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-24 border-t border-white/10 bg-card/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-12 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Three Steps. Zero Complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="space-y-4">
              <div className="text-4xl font-semibold text-primary">01</div>
              <h3 className="text-xl font-semibold">Upload</h3>
              <p className="text-muted-foreground">
                Drag and drop your CoachRX workout screenshots. Batch upload supported.
              </p>
            </Card>
            <Card className="space-y-4">
              <div className="text-4xl font-semibold text-primary">02</div>
              <h3 className="text-xl font-semibold">Extract</h3>
              <p className="text-muted-foreground">
                AI processes your screenshots and extracts structured workout data automatically.
              </p>
            </Card>
            <Card className="space-y-4">
              <div className="text-4xl font-semibold text-primary">03</div>
              <h3 className="text-xl font-semibold">Analyze</h3>
              <p className="text-muted-foreground">
                View insights, track progress, and export your data in any format you need.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 lg:py-24 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-8 text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
            Ready to Own Your Data?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join users who have liberated their workout data from app lock-in.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton mode="modal">
              <Button size="lg">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </div>
      </section>
    </div>
  );
}
