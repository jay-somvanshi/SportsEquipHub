"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Package, TrendingUp, Shield, Zap, ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function HomePage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-md bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Package className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
             SportsEquip Hub
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              Features
            </Link>
            <Link
              href="#about"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              About
            </Link>
            <Link
              href="#contact"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Trusted by sports facilities worldwide</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance leading-tight">
              Manage Your Sports Inventory Like a{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Champion</span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground mb-12 text-pretty leading-relaxed max-w-2xl mx-auto">
              The ultimate sports instrument management system designed for efficiency, accuracy, and peak performance.
              Track, manage, and optimize your sports equipment inventory with ease.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/login/admin" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
                >
                  Admin Login
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login/user" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full text-lg px-8 py-6 border-2 border-primary/30 hover:bg-primary/5 bg-transparent"
                >
                  User Login
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Why Choose SportsEquip Hub?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage sports equipment efficiently and effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Package,
                title: "Real-Time Tracking",
                description:
                  "Monitor your sports equipment inventory in real-time with instant updates and notifications.",
              },
              {
                icon: TrendingUp,
                title: "Analytics Dashboard",
                description: "Get insights into usage patterns, maintenance schedules, and inventory optimization.",
              },
              {
                icon: Shield,
                title: "Secure Access",
                description: "Role-based access control ensures your data is protected with enterprise-grade security.",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Optimized performance ensures quick access to your inventory data whenever you need it.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-card border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer group"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardContent className="p-6">
                  <div
                    className={`h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-accent/30 transition-all ${
                      hoveredFeature === index ? "scale-110" : ""
                    }`}
                  >
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-card-foreground mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Built for Sports Professionals</h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  SportsEquip Hub is designed specifically for sports facilities, schools, clubs, and organizations that
                  need to manage their sports equipment efficiently.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  From tracking inventory levels to scheduling maintenance, we've got you covered. Our system helps you
                  reduce equipment loss, optimize purchasing decisions, and ensure your athletes always have access to
                  the gear they need.
                </p>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
                <div className="space-y-4">
                  {[
                    "Real-time inventory tracking",
                    "Automated request management",
                    "Complete audit history",
                    "Role-based access control",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-foreground font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="py-20 md:py-32 bg-gradient-to-r from-primary/10 to-accent/10 border-y border-primary/20"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Ready to Get Started?</h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Join sports facilities worldwide using SportGear Pro to transform their equipment management.
            </p>
            <Link href="/login/admin">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
              >
                Start Managing Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">SportsEquip Hub</span>
              </div>
              <p className="text-sm text-muted-foreground">Professional sports equipment management system.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Access</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/login/admin" className="hover:text-foreground transition-colors">
                    Admin Login
                  </Link>
                </li>
                <li>
                  <Link href="/login/user" className="hover:text-foreground transition-colors">
                    User Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2025 SportsEquip Hub. All rights reserved.</p>
            <p className="text-sm text-muted-foreground">Designed for excellence in sports management</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
