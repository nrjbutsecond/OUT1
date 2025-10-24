import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CheckCircle, Users, TrendingUp, Award, Globe, Target } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 tedx-gradient text-white overflow-hidden">
          <div className="centered-content relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                <span className="text-red-500">TEDx</span>{" "}
                <span className="text-white">Organizer Network</span>
              </h1>
              <p className="text-xl md:text-2xl font-light text-gray-300">
                Connecting and enhancing the quality of TEDx events
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" variant="outline" asChild className="px-8 py-4 rounded-xl font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1">
                  <Link href="/services">Explore Services →</Link>
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-4 rounded-xl font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1" asChild>
                  <a href="https://www.tiktok.com/@tedxorganizernetwork?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer">
                    Watch Our Story →
                  </a>
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
        </section>

                {/* Features Section */}
                <section className="section-padding bg-gray-900">
                  <div className="centered-content">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                        Why Choose TON?
                      </h2>
                      <p className="text-xl md:text-2xl font-light text-gray-200 max-w-2xl mx-auto">
                        We provide comprehensive solutions for TEDx organizations in Vietnam
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <Card className="high-contrast-card hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/50">
                        <CardHeader>
                          <Users className="h-12 w-12 text-red-500 mb-4" />
                          <CardTitle className="high-contrast-text">Connected Community</CardTitle>
                          <CardDescription className="high-contrast-muted">
                            Connect with 100+ TEDx organizations and thousands of organizers nationwide
                          </CardDescription>
                        </CardHeader>
                      </Card>

                      <Card className="high-contrast-card hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/50">
                        <CardHeader>
                          <TrendingUp className="h-12 w-12 text-red-500 mb-4" />
                          <CardTitle className="high-contrast-text">Professional Services</CardTitle>
                          <CardDescription className="high-contrast-muted">
                            Comprehensive service packages from consulting, training to mentoring to enhance event quality
                          </CardDescription>
                        </CardHeader>
                      </Card>

                      <Card className="high-contrast-card hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/50">
                        <CardHeader>
                          <Award className="h-12 w-12 text-red-500 mb-4" />
                          <CardTitle className="high-contrast-text">Management Tools</CardTitle>
                          <CardDescription className="high-contrast-muted">
                            Modern workspace to manage projects, track progress and store documents
                          </CardDescription>
                        </CardHeader>
                      </Card>

                      <Card className="high-contrast-card hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/50">
                        <CardHeader>
                          <Globe className="h-12 w-12 text-red-500 mb-4" />
                          <CardTitle className="high-contrast-text">Ticket & Merchandise Sales</CardTitle>
                          <CardDescription className="high-contrast-muted">
                            Integrated platform for selling event tickets and branded merchandise
                          </CardDescription>
                        </CardHeader>
                      </Card>

                      <Card className="high-contrast-card hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/50">
                        <CardHeader>
                          <Target className="h-12 w-12 text-red-500 mb-4" />
                          <CardTitle className="high-contrast-text">Marketing & Outreach</CardTitle>
                          <CardDescription className="high-contrast-muted">
                            Tools and strategies to expand your event's reach and attract more audience
                          </CardDescription>
                        </CardHeader>
                      </Card>

                      <Card className="high-contrast-card hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/50">
                        <CardHeader>
                          <CheckCircle className="h-12 w-12 text-red-500 mb-4" />
                          <CardTitle className="high-contrast-text">24/7 Support</CardTitle>
                          <CardDescription className="high-contrast-muted">
                            Our support team is always ready to assist you throughout your event organizing journey
                          </CardDescription>
                        </CardHeader>
                      </Card>
            </div>

            <div className="text-center mt-12">
              <Button size="lg" asChild>
                <Link href="/about">About TON</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">100+</div>
                <div className="text-gray-300">TEDx Organizations</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">500+</div>
                <div className="text-gray-300">Events</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">2000+</div>
                <div className="text-gray-300">Members</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">50+</div>
                <div className="text-gray-300">Mentors</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 tedx-gradient text-white">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Join the TON community today to enhance the quality of your TEDx events
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" asChild className="px-8 py-4 rounded-xl font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 shadow-lg shadow-black/20 transition-all duration-300">
                <Link href="/register">Sign Up Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 rounded-xl font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 shadow-lg shadow-black/20 transition-all duration-300" asChild>
                <Link href="/services">View Services</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
