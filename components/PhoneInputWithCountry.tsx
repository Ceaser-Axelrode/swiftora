import { useState, useMemo, useEffect } from 'react';
import { Phone, ChevronsUpDown, Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactCountryFlag from 'react-country-flag';
import countryList from 'react-select-country-list';
import {
  getCountryCallingCode,
  type Country as PhoneCountry,
} from 'react-phone-number-input';

interface Country {
  value: string;
  label: string;
  dialCode?: string;
}

// Use react-select-country-list for country data + react-phone-number-input for accurate dial codes
const countries = countryList()
  .getData()
  .map((country) => ({
    ...country,
    dialCode: (() => {
      try {
        return getCountryCallingCode(country.value as PhoneCountry);
      } catch {
        return '+1';
      }
    })(),
  }));

// Function to detect user's country from IP
async function detectUserCountry(): Promise<string> {
  try {
    // Try multiple free IP geolocation services
    const services = [
      'https://ipapi.co/json/',
      'https://api.country.is/',
      'https://ipinfo.io/json',
    ];

    for (const service of services) {
      try {
        const response = await fetch(service, {
          signal: AbortSignal.timeout(4000),
        });
        const data = await response.json();
        const countryCode =
          data.country || data.countryCode || data.country_code;
        if (countryCode && countryCode.length === 2) {
          return countryCode.toUpperCase();
        }
      } catch {
        continue; // Try next service
      }
    }
  } catch {
    console.log('Could not detect country from IP');
  }

  // Fallback to browser locale or US
  const browserLocale = navigator.language.split('-')[1]?.toUpperCase() || 'US';
  return browserLocale;
}

// Helper function to get country from dial code

const FAVORITE_COUNTRIES = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'JP', 'CN'];

interface PhoneInputWithCountryProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function PhoneInputWithCountry({
  value,
  onChange,
  placeholder = 'Enter phone number',
  className = '',
}: PhoneInputWithCountryProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Detect the user's country on mount only when no value was supplied.
  useEffect(() => {
    if (value) return;

    let cancelled = false;
    const setDefaultCountry = async () => {
      try {
        const userCountryCode = await detectUserCountry();
        const country = countries.find((c) => c.value === userCountryCode);
        if (!cancelled && country) {
          setSelectedCountry(country);
        }
      } catch {
        console.log('Using default country (US)');
      }
    };

    setDefaultCountry();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the local phone number in sync when the form resets or the parent
  // supplies a value (for example after a successful submit).
  useEffect(() => {
    if (!value) {
      setPhoneNumber('');
      return;
    }

    const matchedCountry = countries
      .filter((c) => c.dialCode && value.startsWith(c.dialCode))
      .sort(
        (a, b) => (b.dialCode?.length ?? 0) - (a.dialCode?.length ?? 0),
      )[0];

    if (matchedCountry) {
      setSelectedCountry(matchedCountry);
      setPhoneNumber(value.slice(matchedCountry.dialCode?.length ?? 0));
    } else {
      setPhoneNumber(value);
    }
  }, [value]);

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return countries;

    const term = searchTerm.toLowerCase();
    return countries.filter(
      (country) =>
        country.label.toLowerCase().includes(term) ||
        country.value.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  const favoriteCountries = useMemo(
    () => countries.filter((c) => FAVORITE_COUNTRIES.includes(c.value)),
    [],
  );

  const otherCountries = useMemo(
    () => countries.filter((c) => !FAVORITE_COUNTRIES.includes(c.value)),
    [],
  );

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setOpen(false);
    setSearchTerm('');
    const newFullNumber = `${country.dialCode || ''}${phoneNumber}`;
    onChange(newFullNumber);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhoneNumber(newPhone);
    const fullNumber = `${selectedCountry.dialCode || ''}${newPhone}`;
    onChange(fullNumber);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex">
        {/* Country Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 px-2 py-3 bg-muted/50 border border-border rounded-l-xl hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[80px] h-[50px]"
          >
            <ReactCountryFlag
              svg
              countryCode={selectedCountry.value}
              style={{
                width: '1.25em',
                height: '1.25em',
                borderRadius: '2px',
              }}
            />
            <span className="text-sm font-medium text-foreground">
              {selectedCountry.dialCode}
            </span>
            <ChevronsUpDown className="w-4 h-4 text-muted-foreground ml-1" />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute top-full left-0 mt-1 w-80 bg-card border border-border rounded-xl shadow-xl z-50 max-h-80 overflow-hidden">
              {/* Search Input */}
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                </div>
              </div>

              {/* Country List */}
              <div className="max-h-64 overflow-y-auto scrollbar-thin">
                {!searchTerm && (
                  <>
                    {/* Favorites Section */}
                    <div className="p-2">
                      <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                        ⭐ Popular
                      </div>
                      {favoriteCountries.map((country) => (
                        <button
                          key={country.value}
                          type="button"
                          onClick={() => handleCountrySelect(country)}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted/50 transition-colors text-left rounded-lg"
                        >
                          <Check
                            className={cn(
                              'w-4 h-4 text-primary',
                              selectedCountry.value === country.value
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          <ReactCountryFlag
                            svg
                            countryCode={country.value}
                            style={{
                              width: '1.25em',
                              height: '1.25em',
                              borderRadius: '2px',
                            }}
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">
                              {country.label}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {country.dialCode}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Separator */}
                    <div className="border-t border-border my-2" />
                  </>
                )}

                {/* All Countries (or filtered) */}
                <div className="p-2">
                  {!searchTerm && (
                    <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                      🌍 All countries
                    </div>
                  )}
                  {(searchTerm ? filteredCountries : otherCountries).map(
                    (country) => (
                      <button
                        key={country.value}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted/50 transition-colors text-left rounded-lg"
                      >
                        <Check
                          className={cn(
                            'w-4 h-4 text-primary',
                            selectedCountry.value === country.value
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        <ReactCountryFlag
                          svg
                          countryCode={country.value}
                          style={{
                            width: '1.25em',
                            height: '1.25em',
                            borderRadius: '2px',
                          }}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-foreground">
                            {country.label}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {country.dialCode}
                          </div>
                        </div>
                      </button>
                    ),
                  )}
                </div>

                {/* No Results */}
                {searchTerm && filteredCountries.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No country found for &quot;{searchTerm}&quot;
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Phone Input */}
        <div className="flex-1 relative">
          <Phone className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-r-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition h-[50px]"
          />
        </div>
      </div>
    </div>
  );
}
