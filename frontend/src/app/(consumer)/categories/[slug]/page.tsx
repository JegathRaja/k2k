import { categoryService, productService } from '@/services/marketplace.service';
import { ProductGrid } from '@/components/marketplace/ProductGrid';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const category = await categoryService.getBySlug(params.slug);
    return {
      title: `${category.name} | Kadal2Kadaai`,
      description: category.description || `Browse our fresh selection of ${category.name}`,
    };
  } catch (e) {
    return { title: 'Category Not Found' };
  }
}

export default async function CategoryDetailPage({ params }: { params: { slug: string } }) {
  try {
    const [category, productsData] = await Promise.all([
      categoryService.getBySlug(params.slug),
      productService.getAll({ category: params.slug, per_page: 24 })
    ]);

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8 border-b pb-8">
          <div className="h-20 w-20 flex items-center justify-center rounded-full bg-primary/10 text-primary text-4xl shrink-0">
            {category.icon || '🐟'}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">{category.name}</h1>
            {category.description && (
              <p className="text-muted-foreground max-w-3xl">{category.description}</p>
            )}
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <p className="text-sm text-muted-foreground font-medium">
            Showing {productsData.data.length} of {productsData.total} products
          </p>
        </div>

        <ProductGrid products={productsData.data} emptyMessage={`No products found in ${category.name}.`} />
      </div>
    );
  } catch (e) {
    notFound();
  }
}
