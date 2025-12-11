import { HeroSection } from "@/components/ui/hero-section-dark"

function HeroSectionDemo() {
  return (
    <div className="w-full min-h-screen bg-background dark:bg-black">
      <HeroSection
        title="Welcome to Our Platform"
        subtitle={{
          regular: "Transform your ideas into ",
          gradient: "beautiful digital experiences",
        }}
        description="Transform your ideas into reality with our comprehensive suite of development tools and resources."
        ctaText="Get Started"
        ctaHref="/register"
        bottomImage={{
          light: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
          dark: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
        }}
        gridOptions={{
          angle: 65,
          opacity: 0.4,
          cellSize: 50,
          lightLineColor: "#4a4a4a",
          darkLineColor: "#2a2a2a",
        }}
      />
    </div>
  )
}
export default HeroSectionDemo
