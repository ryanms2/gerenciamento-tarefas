'use client'

import React, { useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, BarChart2, Zap } from "lucide-react"
import Link from 'next/link'

const FeatureCard = ({ icon, title, description }: {
    icon: React.ReactNode
    title: string
    description: string
}) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle className="flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription>{description}</CardDescription>
    </CardContent>
  </Card>
)

const AnimatedSection = ({ children }: Readonly<{
    children: React.ReactNode;
  }>) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const controls = useAnimation()

  React.useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
      }}
    >
      {children}
    </motion.div>
  )
}

export function HomePage() {
  const featuresRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b ">
      <header className=" bg-background shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Manager Tasks</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link
                  href="#features"
                  className='hover:text-primary'
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(featuresRef)
                  }}
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className='hover:text-primary'
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(aboutRef)
                  }}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className='hover:text-primary'
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(contactRef)
                  }}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <AnimatedSection>
          <section className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Welcome to Manager Tasks</h2>
            <p className="text-xl text-gray-600 mb-4">Streamline your workflow and boost productivity with ease.</p>
            <p className="text-2xl font-bold text-primary mb-8">100% Free, Forever!</p>
            <Button size="lg">
                <Link href={"/auth"}>Get Started for Free</Link>
            </Button>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section ref={featuresRef} id="features" className="mb-16 pt-16 -mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FeatureCard
                icon={<CheckCircle className="text-primary" />}
                title="Task Management"
                description="Create, assign, and track tasks effortlessly with our intuitive interface."
              />
              <FeatureCard
                icon={<Clock className="text-primary" />}
                title="Time Tracking"
                description="Monitor time spent on tasks and projects to improve productivity."
              />
              <FeatureCard
                icon={<BarChart2 className="text-primary" />}
                title="Analytics"
                description="Gain insights into your performance with detailed analytics and reports."
              />
              <FeatureCard
                icon={<Zap className="text-primary" />}
                title="Completely Free"
                description="Enjoy all features without any cost. No hidden fees, no premium plans - just pure productivity."
              />
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section ref={aboutRef} id="about" className="mb-16 pt-16 -mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">About Manager Tasks</h2>
            <Card>
              <CardContent className="prose max-w-none p-6">
                <p className="mb-4">
                  Manager Tasks is a powerful, free task management solution designed to help individuals boost their productivity. We believe that effective task management should be accessible to everyone, which is why we&apos;ve made our platform completely free, with no hidden costs or premium features.
                </p>
                <p className="mb-4">
                  Our mission is to empower users with robust tools that streamline workflows and provide valuable insights into productivity patterns. Whether you&apos;re a freelancer, student, or professional, Manager Tasks adapts to your needs without any financial barriers.
                </p>
                <p>
                  Join thousands of satisfied users who have transformed their productivity with Manager Tasks. Experience the full power of efficient task management and time tracking - all at zero cost.
                </p>
              </CardContent>
            </Card>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section ref={contactRef} id="contact" className="text-center mb-16 pt-16 -mt-16">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600 mb-8">Have questions? We&apos;re here to help!</p>
            <Button variant="outline" size="lg">
                <Link 
                href={"mailto:riansantos355@gmail.com"}
                target='_blank'
                rel='noopener noreferrer'
                >Contact Us</Link>
            </Button>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="text-center">
            <h2 className="text-3xl font-bold mb-4">Start Boosting Your Productivity Today</h2>
            <p className="text-xl text-gray-600 mb-8">Join Manager Tasks and experience premium task management features, absolutely free!</p>
            <Button size="lg">
                <Link href={"/auth/signup"}>Sign Up Now - It&apos;s Free!</Link>
            </Button>
          </section>
        </AnimatedSection>
      </main>

      <footer className="mt-16">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">&copy; 2024 Manager Tasks. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}