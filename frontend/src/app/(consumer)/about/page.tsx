import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Kadal2Kadaai',
  description: 'Learn about Kadal2Kadaai, our mission to connect consumers directly with local fishermen.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-heading font-bold mb-8 text-center">About Kadal2Kadaai</h1>
      
      <div className="prose prose-lg max-w-none text-slate-700">
        <section className="mb-12 text-center">
          <p className="text-xl lead">
            Kadal2Kadaai (Sea to Pan) is a revolutionary seafood marketplace designed to bridge the gap between hardworking local fishermen and seafood lovers.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-slate-50 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4 text-primary">Our Mission</h2>
            <p>
              To provide consumers with the freshest possible seafood by eliminating middlemen, while ensuring fair compensation and empowerment for local fishing communities.
            </p>
          </div>
          <div className="bg-slate-50 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4 text-primary">Our Vision</h2>
            <p>
              To build a sustainable, transparent, and digitally-enabled seafood ecosystem that honors traditional fishing methods while embracing modern technology.
            </p>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-heading font-bold mb-6">How It Works</h2>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold">1</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Fishermen Catch</h3>
                <p>Local fishermen head out to sea and bring back their daily catch using sustainable methods.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold">2</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Direct Listing</h3>
                <p>The fresh catch is immediately listed on the Kadal2Kadaai marketplace by sellers and fishermen.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold">3</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Consumer Selection</h3>
                <p>You browse and select the exact seafood you want, knowing its origin and freshness.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold">4</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Direct Delivery</h3>
                <p>The fresh seafood is delivered straight to your kitchen, maintaining the cold chain for maximum quality.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
