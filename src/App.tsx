/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, FormEvent } from 'react';
import { 
  ShoppingBag as StoreIcon, 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle,
  Cpu,
  MemoryStick as Ram,
  HardDrive,
  Monitor,
  ArrowRight,
  Camera,
  Battery
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from './constants';
import { Product, CartItem } from './types';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginData, setLoginData] = useState({ name: '', phone: '', email: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Hammasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const categories = ['Hammasi', ...new Set(PRODUCTS.map(l => l.category))];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesCategory = selectedCategory === 'Hammasi' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ') + ' so\'m';
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setIsLoginOpen(true);
      return;
    }
    setCheckoutSuccess(true);
    setCart([]);
    setTimeout(() => {
      setCheckoutSuccess(false);
      setIsCartOpen(false);
    }, 3000);
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (loginData.name && loginData.phone && loginData.email) {
      setIsLoggedIn(true);
      setIsLoginOpen(false);
    }
  };

  const scrollToCatalog = () => {
    const element = document.getElementById('catalog');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#E2E8F0] font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0F1115]/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setSelectedCategory('Hammasi'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm">P</div>
              <span className="text-xl font-bold tracking-tight text-white uppercase">Pro<span className="text-blue-600">Savdo</span></span>
            </div>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Mahsulot qidirish..."
                  className="w-full bg-gray-900 border border-gray-800 rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-600 transition-all outline-none text-sm text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden lg:flex gap-8 text-sm font-medium text-gray-400">
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-blue-500 hover:text-blue-400 transition-colors">Asosiy</button>
                <button onClick={scrollToCatalog} className="hover:text-white transition-colors">Katalog</button>
                <button onClick={() => setIsHelpOpen(true)} className="hover:text-white transition-colors">Yordam</button>
              </div>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="bg-white text-black px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition-all"
              >
                {isLoggedIn ? loginData.name : 'Kirish'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative h-[500px] md:h-[600px] overflow-hidden flex items-center pt-20">
          <div className="absolute inset-x-0 top-0 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-[40px] border border-gray-800 shadow-2xl relative overflow-hidden flex items-center p-10 md:p-20">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541806757476-eb969f649219?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
              
              <div className="relative z-10 max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                    Hafta Tanlovi
                  </span>
                  <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-4 leading-tight mb-6">
                    Lenovo IdeaPad <br/> <span className="text-blue-500">Slim 5 Gen 8</span>
                  </h1>
                  <p className="text-gray-400 mt-4 max-w-md text-lg font-light leading-relaxed mb-10">
                    O'qish va ofis ishlari uchun eng qulay va hamyonbop tanlov. Yuqori unumdorlik va nafis dizayn.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={scrollToCatalog}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                    >
                      Xarid qilish <ArrowRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={scrollToCatalog}
                      className="bg-gray-800/50 border border-gray-700 text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all backdrop-blur-sm"
                    >
                      Katalogga o'tish
                    </button>
                  </div>
                </motion.div>
              </div>

              <div className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 w-1/2 h-full">
                 <img 
                  src="https://images.unsplash.com/photo-1544244015-0df4b3afc6b0?auto=format&fit=crop&q=80&w=1200" 
                  alt="Feature Laptop" 
                  className="w-full h-full object-contain -mr-20 drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                 />
              </div>
            </div>
          </div>
        </section>

        {/* Categories & Filter */}
        <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Katalog</h2>
              <p className="text-gray-500">Eng so'nggi va hamyonbop texnikalar to'plami</p>
            </div>
            <div className="flex bg-gray-900/50 p-1 rounded-2xl border border-gray-800 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === cat 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={product.id}
                  className="group bg-gray-800/30 border border-gray-800 rounded-3xl overflow-hidden hover:border-gray-600 hover:bg-gray-800/50 transition-all shadow-xl"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-900 border-b border-gray-800">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-gray-900/90 backdrop-blur-md text-gray-300 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-gray-700">
                        {product.brand}
                      </span>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                       <h3 className="text-xl font-bold text-white leading-tight">
                        {product.name}
                      </h3>
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-600/10 px-2.5 py-1.5 rounded-lg uppercase tracking-tight">
                        {product.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      {product.specs.cpu && (
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <Cpu className="w-4 h-4 text-gray-500" />
                          <span className="truncate">{product.specs.cpu}</span>
                        </div>
                      )}
                      {product.specs.ram && (
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <Ram className="w-4 h-4 text-gray-500" />
                          <span>{product.specs.ram}</span>
                        </div>
                      )}
                      {product.specs.camera && (
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <Camera className="w-4 h-4 text-gray-500" />
                          <span className="truncate">{product.specs.camera}</span>
                        </div>
                      )}
                      {product.specs.storage && (
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <HardDrive className="w-4 h-4 text-gray-500" />
                          <span>{product.specs.storage}</span>
                        </div>
                      )}
                      {product.specs.display && (
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <Monitor className="w-4 h-4 text-gray-500" />
                          <span>{product.specs.display.split(' ')[0]}</span>
                        </div>
                      )}
                      {product.specs.battery && (
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <Battery className="w-4 h-4 text-gray-500" />
                          <span>{product.specs.battery}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-800">
                      <div>
                        {product.originalPrice && (
                          <div className="text-gray-500 text-xs line-through flex items-center gap-1 mb-1">
                            {formatPrice(product.originalPrice)}
                          </div>
                        )}
                        <div className="text-xl font-bold text-white tracking-tight">
                          {formatPrice(product.price)}
                        </div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase mt-1">
                          Qolgan: <span className={product.stock < 5 ? 'text-red-500' : 'text-green-500'}>{product.stock} dona</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-gray-900 border border-gray-700 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all shadow-md active:scale-90"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-32 bg-gray-900/30 rounded-[40px] border border-gray-800 border-dashed">
              <div className="bg-gray-800/50 inline-block p-8 rounded-full mb-6 border border-gray-700">
                <Search className="w-12 h-12 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-300">Hech narsa topilmadi</h3>
              <p className="text-gray-500 mt-2 max-w-sm mx-auto">Siz qidirayotgan mahsulot hozircha mavjud emas. Iltimos, boshqa kalit so'zlar bilan qidirib ko'ring.</p>
              <button 
                onClick={() => {setSelectedCategory('Hammasi'); setSearchQuery('');}}
                className="mt-8 px-8 py-3 bg-gray-800 rounded-full text-white font-semibold hover:bg-gray-700 transition-all border border-gray-700"
              >
                Filtrlarni tozalash
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Trust & Brands Section */}
      <section className="bg-[#0F1115] py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xl font-bold text-gray-400 uppercase tracking-[0.3em]">Ishonchli hamkorlarimiz</h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 hover:opacity-100 transition-opacity duration-500">
            {['Apple', 'HP', 'Dell', 'Asus', 'Lenovo', 'Razer', 'Samsung', 'MSI'].map((brand) => (
              <button 
                key={brand} 
                onClick={() => {
                  setSearchQuery(brand);
                  setSelectedCategory('Hammasi');
                  scrollToCatalog();
                }}
                className="text-3xl font-black text-white tracking-tighter grayscale hover:grayscale-0 transition-all cursor-pointer hover:scale-110 active:scale-95"
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0F1115] z-[101] shadow-2xl flex flex-col border-l border-gray-800"
            >
              <div className="p-8 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-blue-600" /> Savatcha
                </h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors bg-gray-800 rounded-full border border-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="bg-gray-900 p-10 rounded-full mb-8 border border-gray-800">
                      <ShoppingCart className="w-16 h-16 text-gray-700" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Savatchangiz bo'sh</h3>
                    <p className="text-gray-500 mt-3 text-sm max-w-xs leading-relaxed">
                      Hali hech qanday mahsulot qo'shmadingiz. Katalog bo'limidan o'zingizga yoqqanini tanlang.
                    </p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="mt-10 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all"
                    >
                      Xaridni boshlash
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-6 group">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-900 flex-shrink-0 border border-gray-800">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-bold text-white text-base">{item.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-600 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-gray-500 text-xs mb-4 uppercase tracking-tighter">{item.brand}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 bg-gray-900 rounded-xl p-1.5 border border-gray-800">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-bold min-w-[20px] text-center text-white">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-bold text-blue-400">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-gray-900/50 border-t border-gray-800 space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-400 text-sm">
                      <span>Mahsulotlar ({cartCount})</span>
                      <span className="text-white">{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 text-sm">
                      <span>Yetkazib berish</span>
                      <span className="text-green-500 font-bold uppercase tracking-widest text-[10px]">Tekin</span>
                    </div>
                    <div className="flex justify-between text-white text-xl font-bold pt-4 border-t border-gray-800">
                      <span>Jami:</span>
                      <span className="text-blue-400">{formatPrice(cartTotal)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    disabled={checkoutSuccess}
                    className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50"
                  >
                    {checkoutSuccess ? (
                      <>
                        <CheckCircle className="w-6 h-6" /> Qabul qilindi!
                      </>
                    ) : (
                      <>Buyurtmani tasdiqlash</>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Help Modal */}
      <AnimatePresence>
        {isHelpOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHelpOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0F1115] z-[201] shadow-2xl rounded-3xl border border-gray-800 p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Yordam Markazi</h2>
                <button 
                  onClick={() => setIsHelpOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors bg-gray-800 rounded-full border border-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8 text-gray-300">
                <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                  <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Saytga qanday kirish mumkin?
                  </h3>
                  <p className="leading-relaxed">
                    Saytimizdan to'liq foydalanish va xaridlarni amalga oshirish uchun ro'yxatdan o'tishingiz kerak:
                  </p>
                  <ul className="list-disc list-inside mt-4 space-y-2 text-sm text-gray-400">
                    <li>Yuqori o'ng burchakdagi <span className="text-white font-bold">"Kirish"</span> tugmasini bosing.</li>
                    <li>Ismingiz, telefon raqamingiz va email manzilingizni kiriting.</li>
                    <li>"Tizimga kirish" tugmasini bosing va siz tayyorsiz!</li>
                  </ul>
                </div>

                <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                  <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                    <StoreIcon className="w-5 h-5" /> Pro Savdo tarixi va ochilishi
                  </h3>
                  <p className="leading-relaxed">
                    Pro Savdo - O'zbekiston bozorida 2024-yildan buyon faoliyat yuritib kelmoqda. Bizning asosiy maqsadimiz har bir xonadonga zamonaviy va hamyonbop texnologiyalarni yetkazib berishdir.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6 text-center">
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                      <div className="text-2xl font-bold text-white">2024</div>
                      <div className="text-xs text-gray-500 uppercase mt-1">Ochilgan yil</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                      <div className="text-2xl font-bold text-white">10,000+</div>
                      <div className="text-xs text-gray-500 uppercase mt-1">Mijozlar</div>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => { setIsHelpOpen(false); setIsLoginOpen(true); }}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold mt-8 hover:bg-blue-500 transition-all shadow-lg"
              >
                Tushunarli, hoziroq kirish
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0F1115] z-[201] shadow-2xl rounded-3xl border border-gray-800 p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Xush kelibsiz</h2>
                <button 
                  onClick={() => setIsLoginOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors bg-gray-800 rounded-full border border-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Ismingiz</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-600 transition-all outline-none text-white"
                    placeholder="Ismingizni kiriting"
                    value={loginData.name}
                    onChange={(e) => setLoginData({...loginData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Telefon raqamingiz</label>
                  <input 
                    type="tel" 
                    required
                    className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-600 transition-all outline-none text-white"
                    placeholder="+998 (__) ___-__-__"
                    value={loginData.phone}
                    onChange={(e) => setLoginData({...loginData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Email manzilingiz</label>
                  <input 
                    type="email" 
                    required
                    className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-600 transition-all outline-none text-white"
                    placeholder="example@mail.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95 mt-4"
                >
                  Tizimga kirish
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-24 pb-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-lg">P</div>
                <span className="text-2xl font-bold tracking-tight uppercase">Pro<span className="text-blue-500">Savdo</span></span>
              </div>
              <p className="text-gray-400 max-w-sm leading-relaxed text-base italic">
                "Orzungizdagi texnologiyalarni hamyonbop narxlarda taqdim etamiz. Biz bilan kelajakni bugun yarating."
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-8 text-white">Yordam</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Yetkazib berish</li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">To'lov usullari</li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Kafolat shartlari</li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Biz bilan aloqa</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-8 text-white">Xizmatlar</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-blue-500 text-xs">●</span>
                  <span>O'zbekiston bo'ylab yetkazib berish</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500 text-xs">●</span>
                  <span>1 yil rasmiy kafolat</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500 text-xs">●</span>
                  <span>0% muddatli to'lov</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-[10px] uppercase tracking-[0.2em] font-medium">
            <p>© 2026 ProSavdo — Barcha huquqlar himoyalangan.</p>
            <div className="flex gap-10">
              <span className="hover:text-white cursor-pointer transition-colors">Maxfiylik</span>
              <span className="hover:text-white cursor-pointer transition-colors">Foydalanish</span>
              <span className="hover:text-white cursor-pointer transition-colors">Kukilar</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
