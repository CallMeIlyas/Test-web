import { useMemo } from "react";  
import type { FilterOptions } from "../types/types";  
  
interface Product {  
  id: string;  
  imageUrl: string;  
  name: string;  
  displayName?: string;
  size: string;  
  category: string;  
  subcategory: string | null;  
  fullPath: string;  
  price: number;  
  shippedFrom: string[];  
  shippedTo: string[];  
  allImages?: string[];  
}
  
const normalize = (str: string) =>  
  str.toLowerCase().replace(/[^a-z0-9]/g, "");

// Daftar kategori yang tersedia di setiap lokasi pengiriman
const locationCategories: Record<string, string[]> = {
  "Bogor": ["4R", "15cm", "6R", "20cm", "8R", "10R", "12R", "A2", "A1", "A0"],
  "Jakarta": ["4R", "15cm", "6R", "8R", "10R", "12R"],
  "Worldwide": ["4R", "15cm", "6R", "20cm", "8R", "10R", "12R", "A2", "A1", "A0"]
};

// Mapping dari nama folder ke format yang konsisten
const categoryMapping: Record<string, string> = {
  // 2D & 3D Frame digabung
  "4R": "4R",
  "15cm": "15cm", 
  "6R": "6R",
  "8R": "8R",
  "10R": "10R",
  "12R": "12R",
  "12R by AI": "12R",
  "15X15CM": "15cm",
  "20X20CM": "20cm",
  "A0-80X110CM": "A0",
  "A1-55X80CM": "A1", 
  "A2-40X55CM": "A2",
  "15x15cm": "15cm",
  "20x20cm": "20cm",
  "a0-80x110cm": "A0",
  "a1-55x80cm": "A1",
  "a2-40x55cm": "A2"
};

// Normalize category name untuk matching
const normalizeCategoryForLocation = (subcategory: string | null): string => {
  if (!subcategory) return "";
  
  const mapped = categoryMapping[subcategory];
  if (mapped) {
    return mapped.toLowerCase();
  }
  
  const lowerSub = subcategory.toLowerCase();
  for (const [key, value] of Object.entries(categoryMapping)) {
    if (key.toLowerCase() === lowerSub) {
      return value.toLowerCase();
    }
  }
  
  return lowerSub;
};

// Cek apakah produk tersedia di lokasi pengiriman yang dipilih
const isProductAvailableInLocation = (product: Product, location: string): boolean => {
  const availableCategories = locationCategories[location] || [];
  const productCategory = normalizeCategoryForLocation(product.subcategory);
  
  const isAvailable = availableCategories.some(availableCat => 
    availableCat.toLowerCase() === productCategory
  );
  
  return isAvailable;
};  

// Helper untuk parse URL parameters
const parseUrlParams = (urlParamsString?: string) => {
  const params = new URLSearchParams(urlParamsString || "");
  
  const result = {
    search: params.get("search") || "",
    type: params.get("type") || "",
    size: params.get("size") || "",
    category: params.get("category") || "",
    exclude: params.get("exclude") || "",
    special_filter: params.get("special_filter") || ""
  };
  
  console.log("=== PARSED URL PARAMS ===");
  console.log("URL String:", urlParamsString);
  console.log("Parsed params:", result);
  
  return result;
};

// Mapping untuk keyword search ke kategori produk
const keywordToCategoryMapping: Record<string, string[]> = {
  // Frame related
  'karikatur': ['2D Frame', '3D Frame'],
  'caricature': ['2D Frame', '3D Frame'],
  'pop up frame': ['3D Frame'],
  'frame': ['2D Frame', '3D Frame'],
  'bingkai': ['2D Frame', '3D Frame'],
  'foto': ['2D Frame', '3D Frame'],
  
  // Acrylic - HANYA 'acrylic' yang dapat 3D Frame (untuk A2,A1,A0)
  'acrylic': ['Acrylic Stand', '3D Frame'],
  'standee': ['Acrylic Stand'],
  'acrylic stand': ['Acrylic Stand'],
  'plakat': ['Acrylic Stand'],
  
  // Softcopy/Design
  'softcopy': ['Softcopy Design'],
  'desain aja': ['Softcopy Design'],
  'desain': ['Softcopy Design'],
  'desain saja': ['Softcopy Design'],
  
  // Additional
  'tambahan wajah': ['Additional'],
  'tambahan': ['Additional'],
  'additional': ['Additional'],
  
  // Gift/Hampers - UPDATED: Tambahkan Acrylic Stand
  'kado': ['2D Frame', '3D Frame', 'Acrylic Stand'],
  'hadiah': ['2D Frame', '3D Frame', 'Acrylic Stand'],
  'hampers': ['2D Frame', '3D Frame', 'Acrylic Stand'],
  
  // 2D/3D Type
  '2d': ['2D Frame'],
  '2d frame': ['2D Frame'],
  '3d': ['3D Frame'],
  '3d frame': ['3D Frame'],
  
  // Kaca
  'kaca': ['2D Frame', '3D Frame'],
  
  // Size keywords (A2, A1, A0)
  'a2': ['3D Frame'],
  'a1': ['3D Frame'],
  'a0': ['3D Frame'],
};

// List of special keywords that should NOT have text search applied
const SPECIAL_KEYWORDS = [
  // Acrylic & Plakat
  'acrylic', 'standee', 'acrylic stand', 'plakat',
  
  // Frame & Size - hanya yang kategori keyword, bukan nama produk
  'a2', 'a1', 'a0',
  
  // 2D/3D
  '2d', '2d frame', '3d', '3d frame',
  
  // Frame Types
  'kaca', 'bingkai', 'frame',
  
  // Karikatur/Foto
  'karikatur', 'caricature', 'pop up frame', 'foto',
  
  // Softcopy/Design
  'softcopy', 'desain aja', 'desain', 'desain saja',
  
  // Additional
  'tambahan wajah', 'tambahan', 'additional',
  
  // Gift/Hampers
  'kado', 'hadiah', 'hampers',
];

// Specific product name keywords - untuk direct product search
const PRODUCT_NAME_SEARCH: Record<string, { category?: string[], exactMatch?: boolean }> = {
  // 3D Frame Products
  '10r': { category: ['3D Frame'] },
  '12r': { category: ['2D Frame', '3D Frame'] },
  '12r by ai': { category: ['3D Frame'], exactMatch: true },
  '15x15cm': { category: ['3D Frame'] },
  '20x20cm': { category: ['3D Frame'] },
  '4r': { category: ['2D Frame', '3D Frame'] },
  '6r': { category: ['2D Frame', '3D Frame'] },
  '8r': { category: ['2D Frame', '3D Frame'] },
  'a0-80x110cm': { category: ['3D Frame'] },
  'a1-55x80cm': { category: ['3D Frame'] },
  'a2-40x55cm': { category: ['3D Frame'] },
  
  // 2D Frame Products
  '15cm': { category: ['2D Frame'] },
  
  // Acrylic Stand Products
  '2cm': { category: ['Acrylic Stand'] },
  '3mm': { category: ['Acrylic Stand'] },
  
  // Softcopy Design
  'with background catalog': { category: ['Softcopy Design'], exactMatch: true },
  'with background custom': { category: ['Softcopy Design'], exactMatch: true },
  'without background': { category: ['Softcopy Design'], exactMatch: true },
  
  // Additional - Biaya Ekspress
  'biaya ekspress': { category: ['Additional'] },
  'ekspress': { category: ['Additional'] },
  
  // Additional - Biaya Tambahan
  'background custom': { category: ['Additional'] },
  'ganti frame': { category: ['Additional'] },
  'tambahan packing': { category: ['Additional'] },
  'tambahan lainnya': { category: ['Additional'] },
  'pose custom': { category: ['Additional'] },
  'gradasi': { category: ['Additional'] },
  'foto asli': { category: ['Additional'] },
  'bold shading': { category: ['Additional'] },
};
  
export const useProductFilter = (  
  allProducts: Product[],  
  filters: FilterOptions,  
  searchQuery: string,
  urlParamsString?: string
) => {  
  const filteredProducts = useMemo(() => {  
    // Parse URL parameters
    const urlParams = parseUrlParams(urlParamsString);
    
    // Gabungkan search dari URL dan props (prioritas ke URL)
    const effectiveSearch = urlParams.search || searchQuery;
    
    let result = [...allProducts];
    
    // DEBUG: Log untuk melihat apa yang terjadi
    console.log("=== START FILTERING ===");
    console.log("Filtering products with:", {
      urlParams,
      effectiveSearch,
      totalProducts: result.length
    });
    
    // === CHECK SPECIAL FILTERS FIRST ===
    if (urlParams.special_filter === 'acrylic_plus_a_frames') {
      console.log("=== APPLYING SPECIAL ACRYLIC FILTER ===");
      console.log("Showing: Acrylic Stand + 3D Frame A2/A1/A0");
      
      result = result.filter(product => {
        const productCategory = product.category.toLowerCase();
        const productSize = product.size.toLowerCase();
        const productName = product.name.toLowerCase();
        const productSubcategory = product.subcategory?.toLowerCase() || '';
        
        // 1. Acrylic Stand
        if (productCategory === 'acrylic stand') {
          console.log(`✓ Acrylic Stand: ${product.name}`);
          return true;
        }
        
        // 2. 3D Frame dengan size A2, A1, A0
        if (productCategory.includes('3d') || productCategory === '3d frame' || productCategory === '3D Frame') {
          const isSizeA = 
            productSize.includes('a2') || productSize.includes('a1') || productSize.includes('a0') ||
            productName.includes('a2') || productName.includes('a1') || productName.includes('a0') ||
            productSubcategory.includes('a2') || productSubcategory.includes('a1') || productSubcategory.includes('a0');
          
          if (isSizeA) {
            console.log(`✓ 3D Frame A size: ${product.name} (${product.size})`);
          }
          return isSizeA;
        }
        
        return false;
      });
      
      console.log("After special acrylic filter:", result.length);
      return result; // RETURN EARLY, skip semua filter lainnya
    }
    
    // 2. Apply URL type filter
    if (urlParams.type) {
      const types = urlParams.type.split(",").map(t => t.trim().toLowerCase());
      console.log("Filtering by type:", types);
      
      result = result.filter(product => {
        const productCategory = product.category.toLowerCase();
        const productName = product.name.toLowerCase();
        const productSubcategory = product.subcategory?.toLowerCase() || '';
        
        return types.some(type => {
          if (type === '2d' || type === '2d frame') {
            return (
              productCategory.includes('2d') ||
              productCategory.includes('2d frame') ||
              productCategory === '2d frame' ||
              productName.includes('2d') ||
              productSubcategory.includes('2d') ||
              productCategory === '2D Frame' ||
              productCategory.includes('2D')
            );
          }
          if (type === '3d' || type === '3d frame') {
            return (
              productCategory.includes('3d') ||
              productCategory.includes('3d frame') ||
              productCategory === '3d frame' ||
              productName.includes('3d') ||
              productSubcategory.includes('3d') ||
              productCategory === '3D Frame' ||
              productCategory.includes('3D')
            );
          }
          return (
            productCategory.includes(type) ||
            productName.includes(type) ||
            productSubcategory.includes(type)
          );
        });
      });
      
      console.log("After type filter:", result.length);
    }
    
    // 2.5. Apply URL exclude filter
    if (urlParams.exclude) {
      const excludeCategories = urlParams.exclude.split(",").map(c => c.trim().toLowerCase());
      console.log("Applying exclude filter:", excludeCategories);
      
      result = result.filter(product => {
        const productCategory = product.category.toLowerCase();
        
        // Check if product category should be excluded
        const shouldExclude = excludeCategories.some(excludeCat => {
          // Special handling for category mappings
          if (excludeCat === 'softcopy') {
            return productCategory === 'softcopy design';
          }
          if (excludeCat === 'acrylic') {
            return productCategory === 'acrylic stand';
          }
          
          return productCategory.includes(excludeCat) || productCategory === excludeCat;
        });
        
        return !shouldExclude; // Keep product if NOT in exclude list
      });
      
      console.log("After exclude filter:", result.length);
    }
    
    // 3. Apply URL size filter - SUPPORT MULTIPLE SIZES
    if (urlParams.size) {
      console.log("Filtering by size:", urlParams.size);
      
      // Support multiple sizes separated by commas
      const sizes = urlParams.size.split(",").map(s => s.trim().toLowerCase());
      console.log("Parsed sizes:", sizes);
      
      result = result.filter(product => {
        const productSize = product.size.toLowerCase();
        const productName = product.name.toLowerCase();
        const productDisplayName = product.displayName?.toLowerCase() || '';
        const productSubcategory = product.subcategory?.toLowerCase() || '';
        
        // Check if product matches ANY of the requested sizes
        return sizes.some(size => 
          productSize.includes(size) ||
          productName.includes(size) ||
          productDisplayName.includes(size) ||
          productSubcategory.includes(size)
        );
      });
      
      console.log("After size filter:", result.length);
    }
    
    // 4. Apply URL category filter
    if (urlParams.category) {
      console.log("Filtering by URL category:", urlParams.category);
      result = result.filter(product => {
        const productCategory = product.category.toLowerCase();
        
        // Special handling untuk "softcopy" category dari URL
        if (urlParams.category.toLowerCase() === 'softcopy') {
          return productCategory === 'softcopy design';
        }
        
        // Special handling untuk "acrylic" category dari URL
        if (urlParams.category.toLowerCase() === 'acrylic') {
          return productCategory === 'acrylic stand';
        }
        
        const productSubcategory = product.subcategory?.toLowerCase() || '';
        
        return (
          productCategory === urlParams.category.toLowerCase() ||
          productSubcategory === urlParams.category.toLowerCase() ||
          productCategory.includes(urlParams.category.toLowerCase()) ||
          productSubcategory.includes(urlParams.category.toLowerCase())
        );
      });
      
      console.log("After URL category filter:", result.length);
    }
    
    // === APPLY SEARCH QUERY FILTERING ===
    
    if (effectiveSearch.trim() !== "") {  
      const queryLower = effectiveSearch.toLowerCase().trim();
      console.log("Processing search query:", queryLower);
      
      // Check if this is a special keyword search
      const isSpecialKeyword = SPECIAL_KEYWORDS.some(keyword => 
        queryLower.includes(keyword.toLowerCase())
      );
      
      if (isSpecialKeyword) {
        console.log("This is a special keyword search");
        
        // SPECIAL HANDLING UNTUK "ACRYLIC/STANDEE/PLAKAT"
        if (queryLower.includes('acrylic') || queryLower.includes('standee') || queryLower.includes('plakat')) {
          console.log("Special handling for 'acrylic/standee/plakat' keyword");
          
          // PERBEDAAN BERDASARKAN KEYWORD:
          if (queryLower.includes('acrylic') && !queryLower.includes('acrylic stand')) {
            // HANYA keyword "acrylic" (bukan "acrylic stand") yang dapat A2,A1,A0
            console.log("Keyword 'acrylic' detected - showing Acrylic Stand AND A2,A1,A0 frames");
            
            // Apply filtering secara manual, IGNORE URL type filter untuk acrylic stand
            result = result.filter(product => {
              const productCategory = product.category.toLowerCase();
              const productName = product.name.toLowerCase();
              const productSize = product.size.toLowerCase();
              const productSubcategory = product.subcategory?.toLowerCase() || '';
              
              // 1. Acrylic Stand - SELALU tampilkan
              if (productCategory === 'acrylic stand') {
                return true;
              }
              
              // 2. 3D Frame dengan size A2, A1, A0
              if (productCategory.includes('3d') || productCategory === '3d frame' || productCategory === '3D Frame') {
                // Cek size
                const isSizeA = 
                  productSize.includes('a2') || productSize.includes('a1') || productSize.includes('a0') ||
                  productName.includes('a2') || productName.includes('a1') || productName.includes('a0') ||
                  productSubcategory.includes('a2') || productSubcategory.includes('a1') || productSubcategory.includes('a0');
                
                // Jika ada URL type filter, cek apakah produk termasuk 3D
                if (urlParams.type) {
                  const types = urlParams.type.split(",").map(t => t.trim().toLowerCase());
                  const is3DType = types.some(type => 
                    type === '3d' || type === '3d frame' ||
                    productCategory.includes('3d') || productCategory.includes('3D')
                  );
                  
                  return isSizeA && is3DType;
                }
                
                return isSizeA;
              }
              
              return false;
            });
          } else {
            // Untuk "standee", "acrylic stand", "plakat" - HANYA acrylic stand
            console.log("Keyword 'standee/acrylic stand/plakat' detected - showing Acrylic Stand only");
            
            result = result.filter(product => {
              const productCategory = product.category.toLowerCase();
              return productCategory === 'acrylic stand';
            });
          }
          
          console.log("After 'acrylic/standee/plakat' filter:", result.length);
        }
        // SPECIAL HANDLING UNTUK "KACA"
        else if (queryLower.includes('kaca')) {
          console.log("Special handling for 'kaca' keyword");
          
          const glassFrameSizes = ["4r", "15cm", "6r", "20cm", "8r", "10r", "12r"];
          
          result = result.filter(product => {
            const productSize = product.size.toLowerCase();
            const productName = product.name.toLowerCase();
            const productSubcategory = product.subcategory?.toLowerCase() || '';
            
            return glassFrameSizes.some(size => 
              productSize.includes(size) ||
              productName.includes(size) ||
              productSubcategory.includes(size)
            );
          });
          
          console.log("After 'kaca' size filter:", result.length);
        }
        // SPECIAL HANDLING UNTUK "SOFTCOPY/DESAIN"
        else if (queryLower.includes('softcopy') || queryLower.includes('desain')) {
          console.log("Special handling for 'softcopy/desain' keyword");
          
          result = result.filter(product => {
            const productCategory = product.category.toLowerCase();
            return productCategory === 'softcopy design';
          });
          
          console.log("After 'softcopy/desain' filter:", result.length);
        }
        // SPECIAL HANDLING UNTUK "ADDITIONAL/TAMBAHAN"
        else if (queryLower.includes('tambahan wajah')) {
          console.log("Special handling for 'tambahan wajah' keyword - showing specific product only");
          
          result = result.filter(product => {
            const productName = product.name.toLowerCase();
            const productDisplayName = product.displayName?.toLowerCase() || '';
            
            // Hanya tampilkan produk "Additional BIAYA TAMBAHAN WAJAH KARIKATUR"
            return (
              productName.includes('biaya tambahan wajah karikatur') ||
              productName.includes('tambahan wajah karikatur') ||
              productDisplayName.includes('biaya tambahan wajah karikatur') ||
              productDisplayName.includes('tambahan wajah karikatur')
            );
          });
          
          console.log("After 'tambahan wajah' filter:", result.length);
          console.log("Filtered products:", result.map(p => p.name));
        }
        else if (queryLower.includes('tambahan') || queryLower.includes('additional')) {
          console.log("Special handling for 'tambahan/additional' keyword");
          
          result = result.filter(product => {
            const productCategory = product.category.toLowerCase();
            return productCategory === 'additional';
          });
          
          console.log("After 'tambahan/additional' filter:", result.length);
        }
        // SPECIAL HANDLING UNTUK "POP UP FRAME" - hanya 3D
        else if (queryLower.includes('pop up frame')) {
          console.log("Special handling for 'pop up frame' (3D only)");
          
          result = result.filter(product => {
            const productCategory = product.category.toLowerCase();
            return productCategory.includes('3d') || productCategory === '3d frame';
          });
          
          console.log("After 'pop up frame' filter:", result.length);
        }
        // UNTUK KEYWORD LAIN (BUKAN YANG DI ATAS)
        else {
          // Find matching keyword
          let keywordCategories: string[] = [];
          for (const [keyword, categories] of Object.entries(keywordToCategoryMapping)) {
            if (queryLower.includes(keyword.toLowerCase())) {
              keywordCategories = categories;
              console.log(`Found keyword match: ${keyword} -> categories:`, categories);
              break;
            }
          }
          
          // Apply category filter for keyword
          if (keywordCategories.length > 0) {
            console.log("Applying keyword category filter:", keywordCategories);
            result = result.filter(product => {
              return keywordCategories.some(cat => 
                product.category.toLowerCase().includes(cat.toLowerCase()) ||
                product.category === cat
              );
            });
            console.log("After keyword category filter:", result.length);
          }
        }
        
        // DO NOT apply text search for special keywords
        console.log("Skipping text search for special keyword");
        
      } else {
        // REGULAR text search (not a special keyword)
        console.log("This is a regular text search");
        
        // Check if query matches a specific product name
        let matchedProductSearch = false;
        
        for (const [productKeyword, searchConfig] of Object.entries(PRODUCT_NAME_SEARCH)) {
          const isMatch = searchConfig.exactMatch 
            ? queryLower === productKeyword.toLowerCase()
            : queryLower.includes(productKeyword.toLowerCase());
          
          if (isMatch) {
            console.log(`Found product name match: ${productKeyword}`, searchConfig);
            matchedProductSearch = true;
            
            // Filter by product name and category
            result = result.filter(product => {
              const productName = product.name.toLowerCase();
              const productCategory = product.category.toLowerCase();
              
              // Check if category matches (if specified)
              const categoryMatch = searchConfig.category 
                ? searchConfig.category.some(cat => productCategory === cat.toLowerCase() || productCategory.includes(cat.toLowerCase()))
                : true;
              
              // Check if product name contains the keyword
              const nameMatch = productName.includes(productKeyword.toLowerCase());
              
              return categoryMatch && nameMatch;
            });
            
            console.log(`After product name search '${productKeyword}':`, result.length);
            break; // Stop after first match
          }
        }
        
        // If no product name match, do regular text search
        if (!matchedProductSearch) {
          const query = normalize(effectiveSearch);  
          
          result = result.filter((product) => {
            const nameNorm = normalize(product.name);  
            const displayNameNorm = product.displayName ? normalize(product.displayName) : "";
            const categoryNorm = normalize(product.category);  
            const subcategoryNorm = normalize(product.subcategory || "");  
            const pathNorm = normalize(product.fullPath);
            const sizeNorm = normalize(product.size);

            // Khusus untuk pencarian "softcopy" atau "desain" di regular search
            if (query.includes('softcopy') || query.includes('desain')) {
              const productCategory = product.category.toLowerCase();
              return productCategory === 'softcopy design';
            }
            
            return (  
              nameNorm.includes(query) ||  
              displayNameNorm.includes(query) ||
              categoryNorm.includes(query) ||  
              subcategoryNorm.includes(query) ||  
              pathNorm.includes(query) ||
              sizeNorm.includes(query)
            );
          });
          
          console.log("After text search filter:", result.length);
        }
      }
    }
    
    // === APPLY REGULAR FILTERS (dari UI filter) ===
    // UI filters SELALU diterapkan jika ada selection dari sidebar
    
    if (filters.categories.length > 0) {  
      console.log("Applying UI category filters:", filters.categories);
      result = result.filter((product) => {
        const matchCategory = filters.categories.some((filterCat) => {  
          const normalizedProductCategory = product.category.toLowerCase();  
          const normalizedProductSub = product.subcategory?.toLowerCase() || "";  
          const normalizedFullPath = `${normalizedProductCategory}/${normalizedProductSub}`.toLowerCase();  
          const normalizedFilter = filterCat.toLowerCase();  

          console.log(`UI Filter: checking "${filterCat}" against product "${product.category}"`);
          
          // SPECIAL FIX: Jika filter adalah "softcopy", cari "softcopy design"
          if (normalizedFilter === 'softcopy') {
            console.log(`  Special handling for 'softcopy' filter`);
            const matches = normalizedProductCategory === 'softcopy design';
            console.log(`  Matches? ${matches}`);
            return matches;
          }
          
          // SPECIAL FIX: Jika filter adalah "acrylic", cari "acrylic stand"
          if (normalizedFilter === 'acrylic') {
            console.log(`  Special handling for 'acrylic' filter`);
            const matches = normalizedProductCategory === 'acrylic stand';
            console.log(`  Matches? ${matches}`);
            return matches;
          }

          const matches = (  
            normalizedProductCategory === normalizedFilter ||  
            normalizedProductSub === normalizedFilter ||  
            normalizedFullPath === normalizedFilter  
          );
          
          console.log(`  Matches? ${matches}`);
          return matches;
        });  

        return matchCategory;
      });
      console.log("After UI category filter:", result.length);
    }  
  
    // Filter Shipped From dari UI (always apply)
    if (filters.shippedFrom.length > 0) {
      console.log("Applying shipped from filters:", filters.shippedFrom);
      result = result.filter(product => {
        const matchShippedFrom = filters.shippedFrom.some(location => {
          const locationAvailable = product.shippedFrom.includes(location);
          const categoryAvailable = isProductAvailableInLocation(product, location);
          return locationAvailable && categoryAvailable;
        });
        
        return matchShippedFrom;
      });
      console.log("After shipped from filter:", result.length);
    }
  
    // Filter Shipped To dari UI (always apply)
    if (filters.shippedTo.length > 0) {  
      console.log("Applying shipped to filters:", filters.shippedTo);
      result = result.filter(product => {
        const matchShippedTo = filters.shippedTo.some(destination => {
          const destinationMatch = product.shippedTo.includes(destination);
          const categoryAvailable = isProductAvailableInLocation(product, destination);
          return destinationMatch && categoryAvailable;
        });
        
        return matchShippedTo;
      });
      console.log("After shipped to filter:", result.length);
    }
    
    console.log("=== FINAL RESULT ===");
    console.log("Final filtered products:", result.length);
    if (result.length > 0) {
      console.log("Products:", result.map(p => `${p.name} (${p.category}, size: ${p.size})`));
    } else {
      console.log("No products found");
    }
    
    return result;
  }, [filters, searchQuery, allProducts, urlParamsString]);  
  
  return filteredProducts;  
};