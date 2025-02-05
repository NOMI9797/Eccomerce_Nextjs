// components/LandingPage.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header"; // Import Header component
import Link from "next/link"; // Import Link for navigation

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Image */}
      <Image
        src="/images/pexels-shattha-pilabut-38930-135620.jpg"
        alt="Background"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 text-white flex flex-col min-h-screen">
        {/* Header */}
        <Header /> {/* Use the Header component */}

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center justify-center text-center">
          {/* Website Name */}
          <h1 className="text-8xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 tracking-widest shadow-lg">
            Outfitters
          </h1>

          {/* Call to Action Buttons */}
          <div className="flex space-x-6">
            {/* Shop Now Button */}
            <Button size="lg" className="bg-white text-black hover:bg-gray-200">
              Shop Now
            </Button>

            {/* Dashboard Button */}
            <Link href="/Dashboard">
              <Button size="lg" className="bg-teal-500 text-white hover:bg-teal-600">
                Dashboard
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
