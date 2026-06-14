import { searchService } from '@/services/marketplace.service';
import { ProductGrid } from '@/components/marketplace/ProductGrid';
import { CategoryCard } from '@/components/marketplace/CategoryCard';
import { SearchBar } from '@/components/marketplace/SearchBar';

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const query = searchParams.q || '';
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  let results = null;
  let error = null;

  if (query) {
    try {
      results = await searchService.search(query, page);
    } catch (e) {
      error = "Failed to perform search. Please try again.";
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl font-heading font-bold mb-6 text-center">Search Marketplace</h1>
        <SearchBar />
      </div>

      {!query ? (
        <div className="text-center py-16 text-muted-foreground">
          Enter a search term above to find fresh seafood, categories, and sellers.
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-500 font-medium">
          {error}
        </div>
      ) : results ? (
        <div>
          <div className="mb-8 border-b pb-4">
            <h2 className="text-xl font-medium">
              Found {results.total_results} results for <span className="font-bold">"{query}"</span>
            </h2>
          </div>

          {/* Category Matches */}
          {results.categories && results.categories.length > 0 && (
            <div className="mb-12">
              <h3 className="text-lg font-bold mb-4 text-muted-foreground">Matching Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {results.categories.map((cat: any) => (
                  <CategoryCard key={cat.id} category={cat} />
                ))}
              </div>
            </div>
          )}

          {/* Product Matches */}
          <div>
             <h3 className="text-lg font-bold mb-4 text-muted-foreground">Matching Products</h3>
             <ProductGrid 
              products={results.products.data} 
              emptyMessage={`We couldn't find any products matching "${query}". Try different keywords.`} 
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
