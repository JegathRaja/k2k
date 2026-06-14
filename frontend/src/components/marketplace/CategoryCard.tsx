import Link from 'next/link';
import { Category } from '@/types/marketplace.types';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link 
      href={`/categories/${category.slug}`}
      className="relative flex flex-col items-center p-8 bg-card rounded-3xl border border-border/50 shadow-sm hover:shadow-xl transition-all duration-500 group text-center overflow-hidden"
    >
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 z-0"></div>
      
      <div className="relative z-10 w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary text-4xl mb-5 group-hover:-translate-y-2 group-hover:shadow-lg transition-all duration-300">
        {category.icon || '🌊'}
      </div>
      
      <h3 className="relative z-10 font-heading font-bold text-xl mb-1.5 text-foreground group-hover:text-primary transition-colors">
        {category.name}
      </h3>
      
      {category.products_count !== undefined && (
        <p className="relative z-10 text-sm font-medium text-muted-foreground/80 bg-muted px-3 py-1 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          {category.products_count} Fresh Catch
        </p>
      )}
    </Link>
  );
}
