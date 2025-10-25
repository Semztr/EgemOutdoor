import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface SearchAutocompleteProps {
  className?: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ className }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch real products from Supabase
  useEffect(() => {
    const searchProducts = async () => {
      if (query.trim().length > 1) {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('products')
            .select('id, name, brand, category')
            .eq('is_active', true)
            .or(`name.ilike.%${query}%,brand.ilike.%${query}%,category.ilike.%${query}%`)
            .limit(8);

          if (error) throw error;
          
          setSuggestions(data || []);
          setShowSuggestions(true);
          setSelectedIndex(-1);
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchProducts();
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      navigate(`/urunler?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSearch(suggestions[selectedIndex].name);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: Product) => {
    handleSearch(suggestion.name);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Ürün ara..."
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim().length > 1 && setShowSuggestions(true)}
          />
        </div>
        <Button type="submit" className="hover-scale transition-smooth">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (loading || suggestions.length > 0) && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {loading ? (
            <div className="px-4 py-3 text-center text-sm text-muted-foreground">
              Aranıyor...
            </div>
          ) : suggestions.length === 0 ? (
            <div className="px-4 py-3 text-center text-sm text-muted-foreground">
              Sonuç bulunamadı
            </div>
          ) : (
            <>
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-b-0 ${
                index === selectedIndex ? 'bg-muted' : ''
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{suggestion.name}</span>
                </div>
                <div className="text-xs text-muted-foreground pl-6">
                  {suggestion.brand} • {suggestion.category}
                </div>
              </div>
            </button>
          ))}
          </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;