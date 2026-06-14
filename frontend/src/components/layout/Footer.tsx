import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="bg-primary font-bold p-1 rounded">K2K</div>
              <span className="font-heading font-bold text-xl">Kadal2Kadaai</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Fresh catch directly from local fishermen to your kitchen. Premium seafood marketplace.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="hover:text-white transition-colors text-sm">Facebook</a>
              <a href="#" className="hover:text-white transition-colors text-sm">Twitter</a>
              <a href="#" className="hover:text-white transition-colors text-sm">Instagram</a>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="text-white font-bold mb-4">Marketplace</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/categories/fresh-fish" className="hover:text-primary transition-colors">Fresh Fish</Link></li>
              <li><Link href="/categories/prawns" className="hover:text-primary transition-colors">Prawns & Crabs</Link></li>
              <li><Link href="/products/featured" className="hover:text-primary transition-colors">Featured Catch</Link></li>
              <li><Link href="/sellers" className="hover:text-primary transition-colors">Our Fishermen</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>123 Coastal Road, Chennai<br />Tamil Nadu 600001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>support@kadal2kadaai.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs">
          <p>&copy; {new Date().getFullYear()} Kadal2Kadaai. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="text-slate-500">Made with ❤️ for local fishermen</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
