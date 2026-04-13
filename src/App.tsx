import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronRight,
  Cpu,
  CreditCard,
  Droplets,
  Heart,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Minus,
  Package,
  Phone,
  Play,
  Plus,
  RefreshCw,
  Shield,
  ShoppingCart,
  Star,
  Trash2,
  X,
} from 'lucide-react';

type ProductCategory = 'all' | 'device' | 'refill' | 'bundle';
type PaymentMethod = 'card' | 'upi' | 'cod';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  features: string[];
  category: Exclude<ProductCategory, 'all'>;
  badge: string;
  rating: number;
  reviews: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  paymentMethod: PaymentMethod;
  cardNumber: string;
  expiry: string;
  cvv: string;
  upiId: string;
}

interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  customer: CheckoutForm;
}

const STORAGE = {
  cart: 'odorzero-cart',
  orders: 'odorzero-orders',
  favorites: 'odorzero-favorites',
};

const products: Product[] = [
  {
    id: 1,
    name: 'OdorZero Pro',
    price: 2999,
    originalPrice: 3999,
    image: '/images/product-main.jpg',
    description: 'Flagship smart neutralizer with adaptive VOC sensing, whisper-quiet micro-dispensing, and premium whole-room coverage.',
    features: ['VOC-triggered automation', 'Up to 400 sq.ft coverage', 'Low-noise operation'],
    category: 'device',
    badge: 'Best Seller',
    rating: 4.9,
    reviews: 482,
  },
  {
    id: 2,
    name: 'OdorZero Mini',
    price: 1999,
    originalPrice: 2499,
    image: '/images/feature-1.jpg',
    description: 'A compact version for bathrooms, shoe cabinets, utility areas, and studio apartments.',
    features: ['Small-space optimized', 'USB-C powered', 'Simple snap-in refills'],
    category: 'device',
    badge: 'Compact Pick',
    rating: 4.7,
    reviews: 267,
  },
  {
    id: 3,
    name: 'Enzyme Refill Trio',
    price: 999,
    originalPrice: 1299,
    image: '/images/feature-2.jpg',
    description: 'Three refill cartridges using plant-forward enzyme compounds that neutralize organic odor molecules.',
    features: ['3-cartridge pack', 'Fragrance-free neutralization', 'Safe for everyday home use'],
    category: 'refill',
    badge: 'Popular Refill',
    rating: 4.9,
    reviews: 738,
  },
  {
    id: 4,
    name: 'Family Coverage Duo',
    price: 9999,
    originalPrice: 12999,
    image: '/images/subscription.jpg',
    description: 'Two OdorZero Pro units with six refill cartridges for multi-room homes and recurring odor zones.',
    features: ['2 premium devices', '6 refill cartridges', 'Ideal for kitchen + bathroom'],
    category: 'bundle',
    badge: 'Value Bundle',
    rating: 4.8,
    reviews: 194,
  },
  {
    id: 5,
    name: 'Pet Zone Bundle',
    price: 6499,
    originalPrice: 7999,
    image: '/images/gallery-3.jpg',
    description: 'Designed for homes with pets, litter areas, and soft furnishing odor build-up.',
    features: ['OdorZero Mini included', 'Pet-area enzyme pack', 'Longer trigger sensitivity profile'],
    category: 'bundle',
    badge: 'Pet Homes',
    rating: 4.8,
    reviews: 156,
  },
  {
    id: 6,
    name: 'Auto Refill Annual Plan',
    price: 999,
    originalPrice: 1199,
    image: '/images/how-it-works.jpg',
    description: 'Scheduled refill delivery every 45 days so your device stays ready without manual reordering.',
    features: ['8 scheduled refills', 'Priority support', 'Pause anytime'],
    category: 'refill',
    badge: 'Subscription',
    rating: 4.9,
    reviews: 311,
  },
];

const featureCards = [
  {
    icon: Cpu,
    title: 'Senses odor spikes instantly',
    text: 'OdorZero continuously monitors VOC fluctuations and reacts only when indoor air quality drops below your threshold.',
  },
  {
    icon: Droplets,
    title: 'Neutralizes, not masks',
    text: 'The enzyme-based formula breaks down organic odor compounds into simpler, odorless particles.',
  },
  {
    icon: RefreshCw,
    title: 'Refill and go',
    text: 'The cartridge system snaps in within seconds and supports a recurring refill program for effortless upkeep.',
  },
  {
    icon: Shield,
    title: 'Built for everyday indoor use',
    text: 'Smart dispensing means reduced chemical usage compared with timer-based fresheners and unnecessary sprays.',
  },
];

const useCases = [
  {
    title: 'Kitchen waste zones',
    text: 'Neutralizes organic smells before they spread into dining and living areas.',
    image: '/images/gallery-1.jpg',
    stat: '94% faster response in odor-prone kitchens',
  },
  {
    title: 'Bathrooms and wash areas',
    text: 'Compact enough for tight layouts with sensor-led activation and quiet operation.',
    image: '/images/gallery-2.jpg',
    stat: 'Designed for moisture-adjacent placement',
  },
  {
    title: 'Pet corners and litter spaces',
    text: 'Works where recurring odor usually returns, without filling the room with heavy perfume.',
    image: '/images/gallery-3.jpg',
    stat: 'Preferred by 9 in 10 pet households in user trials',
  },
  {
    title: 'Shoe racks and closed cabinets',
    text: 'Portable coverage for enclosed smell zones and poorly ventilated storage spaces.',
    image: '/images/hero.jpg',
    stat: 'Portable format for flexible placement',
  },
];

const testimonials = [
  {
    name: 'Aarav Mehta',
    role: 'Apartment owner, Mumbai',
    quote: 'The biggest difference is that the room feels clean instead of perfumed. It reacts when needed and stays quiet the rest of the day.',
  },
  {
    name: 'Ritika Sharma',
    role: 'Pet parent, Bengaluru',
    quote: 'We tried sprays, candles, and plug-ins. OdorZero is the first product that actually reduces the smell around our pet area.',
  },
  {
    name: 'Nihal Joseph',
    role: 'Early access customer, Kochi',
    quote: 'The refill model is convenient, and the design looks premium enough to leave out in the open instead of hiding it away.',
  },
];

const faqs = [
  {
    question: 'How is OdorZero different from air fresheners?',
    answer:
      'Traditional fresheners mostly cover smells with fragrances. OdorZero uses a sensor and enzyme-based solution to identify odor events and neutralize them at the molecular level.',
  },
  {
    question: 'Where can I place the device?',
    answer:
      'OdorZero is designed for residential use in kitchens, bathrooms, shoe racks, pet corners, utility spaces, and other low-ventilation odor zones.',
  },
  {
    question: 'How long does one refill last?',
    answer:
      'A single cartridge typically lasts around 45 days under average household use, depending on how often odor events trigger dispensing.',
  },
  {
    question: 'Is the solution safe for indoor use?',
    answer:
      'The neutralizing formulation is designed to use enzyme-based compounds rather than synthetic perfume masking, making it a cleaner everyday choice for modern homes.',
  },
];

const defaultCheckout: CheckoutForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  pincode: '',
  paymentMethod: 'card',
  cardNumber: '',
  expiry: '',
  cvv: '',
  upiId: '',
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);
  const [toast, setToast] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [checkout, setCheckout] = useState<CheckoutForm>(defaultCheckout);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(STORAGE.cart);
      const storedOrders = localStorage.getItem(STORAGE.orders);
      const storedFavorites = localStorage.getItem(STORAGE.favorites);

      if (storedCart) setCart(JSON.parse(storedCart));
      if (storedOrders) setOrders(JSON.parse(storedOrders));
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    } catch {
      setCart([]);
      setOrders([]);
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE.cart, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE.orders, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE.favorites, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  const shipping = subtotal === 0 ? 0 : subtotal >= 10000 ? 0 : 399;
  const total = subtotal + shipping;

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((product) => product.category === activeCategory);

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
    setToast(`${product.name} added to cart`);
  };

  const updateQuantity = (id: number, nextQuantity: number) => {
    if (nextQuantity <= 0) {
      setCart((current) => current.filter((item) => item.id !== id));
      return;
    }

    setCart((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: nextQuantity } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const handleCheckoutChange = (field: keyof CheckoutForm, value: string) => {
    setCheckout((current) => ({ ...current, [field]: value }));
  };

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (cart.length === 0) return;

    const status = checkout.paymentMethod === 'cod' ? 'Confirmed' : 'Paid';

    const newOrder: Order = {
      id: `OZ-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      items: cart,
      subtotal,
      shipping,
      total,
      status,
      customer: checkout,
    };

    setOrders((current) => [newOrder, ...current]);
    setCart([]);
    setCheckout(defaultCheckout);
    setCheckoutOpen(false);
    setOrdersOpen(true);
    setToast('Order placed successfully');
  };

  const navItems = [
    { label: 'Overview', id: 'overview' },
    { label: 'Technology', id: 'technology' },
    { label: 'Use Cases', id: 'use-cases' },
    { label: 'Store', id: 'store' },
    { label: 'Subscription', id: 'subscription' },
  ];

  return (
    <div className="min-h-screen bg-[#040914] text-white">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled
          ? 'border-b border-white/10 bg-[#061120]/85 shadow-2xl shadow-black/20 backdrop-blur-xl'
          : 'bg-transparent'
          }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => scrollToSection('top')}
            className="flex items-center gap-3 text-left"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-semibold tracking-tight">OdorZero</div>
              <div className="text-xs text-white/55">Smart Odor Neutralization</div>
              <div className="text-xs text-white/55">Product of VayuTech Innovations</div>
            </div>
          </button>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-medium text-white/75 transition hover:text-cyan-300"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              onClick={() => setOrdersOpen(true)}
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-cyan-300/40 hover:text-white"
            >
              View Orders
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative rounded-full border border-white/15 p-3 text-white transition hover:border-cyan-300/40"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-400 px-1 text-[11px] font-bold text-slate-950">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => scrollToSection('store')}
              className="rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              Pre-order
            </button>
          </div>

          <button
            onClick={() => setMenuOpen((current) => !current)}
            className="rounded-full border border-white/15 p-3 lg:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-white/10 bg-[#061120]/95 backdrop-blur-xl lg:hidden"
            >
              <div className="mx-auto max-w-7xl space-y-2 px-4 py-4 sm:px-6">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setMenuOpen(false);
                      scrollToSection(item.id);
                    }}
                    className="block w-full rounded-2xl px-4 py-3 text-left text-white/85 transition hover:bg-white/5"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setOrdersOpen(true);
                    }}
                    className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-white/85"
                  >
                    View Orders
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setCartOpen(true);
                    }}
                    className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950"
                  >
                    Cart ({cartCount})
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section
          id="top"
          className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.22),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(59,130,246,0.22),_transparent_22%),linear-gradient(180deg,_#07101f_0%,_#040914_100%)] pt-28"
        >
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ y: [0, -18, 0], x: [0, 14, 0] }}
              transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-[8%] top-28 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl"
            />
            <motion.div
              animate={{ y: [0, 18, 0], x: [0, -18, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute right-[10%] top-40 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl"
            />
            {Array.from({ length: 18 }).map((_, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0.15 + (index % 3) * 0.08 }}
                animate={{ y: [0, -12, 0], opacity: [0.18, 0.45, 0.18] }}
                transition={{ duration: 4 + index * 0.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute h-1.5 w-1.5 rounded-full bg-cyan-300/60"
                style={{
                  left: `${6 + ((index * 11) % 88)}%`,
                  top: `${12 + ((index * 7) % 70)}%`,
                }}
              />
            ))}
          </div>

          <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-14 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-28">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-cyan-200 backdrop-blur-xl">
                <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  New
                </span>
                Smarter home hygiene, engineered for real odor zones
              </div>
              <h1 className="mt-8 text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-8xl">
                Detect odor.
                <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                  Restore clean air.
                </span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                OdorZero is a smart, sensor-based odor neutralizer that monitors VOC levels and releases an enzyme-powered solution only when your home actually needs it.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => scrollToSection('store')}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-7 py-4 text-base font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  Reserve yours now
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => scrollToSection('technology')}
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 px-7 py-4 text-base font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
                >
                  <Play className="h-5 w-5" />
                  See how it works
                </button>
              </div>

              <div className="mt-14 grid gap-4 sm:grid-cols-3">
                {[
                  ['2.3 sec', 'Average trigger response'],
                  ['45 days', 'Typical cartridge life'],
                  ['400 sq.ft', 'Coverage on OdorZero Pro'],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                  >
                    <div className="text-2xl font-semibold text-white">{value}</div>
                    <div className="mt-2 text-sm text-slate-300">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="relative mx-auto w-full max-w-xl"
            >
              <div className="absolute -inset-6 rounded-[2.5rem] bg-cyan-400/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-5 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                <img
                  src="/images/device-lifestyle.jpg"
                  alt="OdorZero premium device showcase"
                  className="h-[620px] w-full rounded-[2rem] object-cover"
                />
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-0 top-10 rounded-3xl border border-slate-200/60 bg-white/90 px-5 py-4 text-slate-900 shadow-2xl backdrop-blur-xl"
                >
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">VOC Sensor</div>
                  <div className="mt-1 text-2xl font-semibold">Active</div>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -right-2 bottom-24 rounded-3xl border border-slate-200/60 bg-white/90 px-5 py-4 text-slate-900 shadow-2xl backdrop-blur-xl"
                >
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Air Quality</div>
                  <div className="mt-1 text-2xl font-semibold">Excellent</div>
                </motion.div>
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-8 left-10 max-w-[240px] rounded-3xl border border-white/10 bg-slate-950/75 px-5 py-4 text-white shadow-2xl backdrop-blur-xl"
                >
                  <div className="text-xs uppercase tracking-[0.22em] text-cyan-300">Adaptive Dispensing</div>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    Releases only what is needed, cutting waste versus timer sprays.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-[#08101d]">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 text-sm text-slate-300 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {[
              'Designed for kitchens, bathrooms, shoe racks, pet areas, and compact rooms',
              'Enzyme-based odor control instead of perfume-heavy masking',
              'Premium refill model built for recurring household use',
              'Modern device aesthetic inspired by smart home electronics',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/6 bg-white/5 px-4 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="overview" className="bg-slate-50 py-24 text-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
              className="mx-auto max-w-3xl text-center"
            >
              <div className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-sky-700 shadow-sm">
                Why people notice the difference
              </div>
              <h2 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
                A premium product story, grounded in everyday odor problems.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                OdorZero combines sensing, automation, and sustainable neutralization into a home product people can actually understand, trust, and leave on display.
              </p>
            </motion.div>

            <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7 }}
                className="overflow-hidden rounded-[2rem] bg-[#08101d] p-4 text-white shadow-2xl"
              >
                <img
                  src="/images/product-main.jpg"
                  alt="OdorZero product"
                  className="h-full min-h-[580px] w-full rounded-[1.5rem] object-cover"
                />
              </motion.div>

              <div className="grid gap-5">
                {featureCards.map((card, index) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={card.title}
                      initial={{ opacity: 0, x: 24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{ duration: 0.65, delay: index * 0.08 }}
                      className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="flex items-start gap-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 text-sky-700">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="text-2xl font-semibold tracking-tight">{card.title}</div>
                          <p className="mt-3 text-base leading-7 text-slate-600">{card.text}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="technology" className="bg-[#050c18] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-cyan-200">
                  Technology that feels invisible
                </div>
                <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Odor control, automated from sensing to solution.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                  The ESP32-driven system reads VOC activity, compares it with configured odor thresholds, and activates a micro-dispensing mechanism only when conditions require intervention.
                </p>

                <div className="mt-10 space-y-5">
                  {[
                    ['01', 'Sense the air', 'A VOC gas sensor monitors the environment continuously for odor-causing compounds.'],
                    ['02', 'Decide with logic', 'The controller evaluates intensity so the solution is never sprayed on a fixed timer.'],
                    ['03', 'Release with precision', 'The device dispenses a measured amount of enzyme solution for efficient neutralization.'],
                  ].map(([step, title, text]) => (
                    <div
                      key={step}
                      className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                    >
                      <div className="flex items-start gap-5">
                        <div className="text-3xl font-semibold text-cyan-300">{step}</div>
                        <div>
                          <div className="text-xl font-semibold text-white">{title}</div>
                          <p className="mt-2 text-base leading-7 text-slate-300">{text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="relative"
              >
                <div className="absolute -inset-8 rounded-[2.5rem] bg-blue-500/10 blur-3xl" />
                <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <img
                    src="/images/how-it-works.jpg"
                    alt="OdorZero technology illustration"
                    className="h-[640px] w-full rounded-[2rem] object-cover"
                  />
                  <div className="absolute left-8 right-8 top-8 grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/65 p-5 backdrop-blur-xl">
                      <div className="text-xs uppercase tracking-[0.24em] text-cyan-300">Sensor Intelligence</div>
                      <div className="mt-3 text-3xl font-semibold text-white">24/7</div>
                      <div className="mt-2 text-sm leading-6 text-slate-300">Continuous monitoring for odor spikes and poor air events.</div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/90 p-5 text-slate-900 shadow-xl">
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Efficiency</div>
                      <div className="mt-3 text-3xl font-semibold">Only when needed</div>
                      <div className="mt-2 text-sm leading-6 text-slate-600">Smarter than interval-based sprays that waste liquid when air is already clean.</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="use-cases" className="bg-white py-24 text-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
            >
              <div className="max-w-2xl">
                <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-sky-700">
                  Real home placement, not lab-only promises
                </div>
                <h2 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
                  Built around the spaces where odor returns again and again.
                </h2>
              </div>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                Portable, compact, and designed to fit naturally into different corners of the home without looking like industrial equipment.
              </p>
            </motion.div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {useCases.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.6, delay: index * 0.06 }}
                  className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-sm"
                >
                  <div className="overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-xl font-semibold">{item.title}</div>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                    <div className="mt-5 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-sky-700 shadow-sm">
                      {item.stat}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="store" className="bg-slate-100 py-24 text-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
            >
              <div className="max-w-3xl">
                <div className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-sky-700 shadow-sm">
                  Premium storefront
                </div>
                <h2 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
                  Choose your setup, then scale with refills and bundles.
                </h2>
                <p className="mt-5 text-lg leading-8 text-slate-600">
                  Everything from starter devices to recurring refill plans has been designed for a clean checkout flow and repeat usage model.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {[
                  ['all', 'All'],
                  ['device', 'Devices'],
                  ['refill', 'Refills'],
                  ['bundle', 'Bundles'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setActiveCategory(value as ProductCategory)}
                    className={`rounded-full px-5 py-3 text-sm font-medium transition ${activeCategory === value
                      ? 'bg-slate-950 text-white shadow-lg'
                      : 'bg-white text-slate-600 shadow-sm hover:text-slate-950'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product, index) => {
                const isFavorite = favorites.includes(product.id);
                const discount = product.originalPrice
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : 0;

                return (
                  <motion.article
                    key={product.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.55, delay: index * 0.06 }}
                    className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative overflow-hidden bg-slate-950">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-72 w-full object-cover transition duration-700 hover:scale-105"
                      />
                      <div className="absolute left-5 top-5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm">
                        {product.badge}
                      </div>
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className={`absolute right-5 top-5 rounded-full border p-3 backdrop-blur-xl transition ${isFavorite
                          ? 'border-rose-200 bg-rose-50 text-rose-500'
                          : 'border-white/20 bg-black/20 text-white'
                          }`}
                        aria-label="Toggle wishlist"
                      >
                        <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-semibold tracking-tight">{product.name}</h3>
                          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            {product.rating} · {product.reviews} reviews
                          </div>
                        </div>
                        {discount > 0 && (
                          <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Save {discount}%
                          </div>
                        )}
                      </div>

                      <p className="mt-4 text-sm leading-7 text-slate-600">{product.description}</p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {product.features.map((feature) => (
                          <span
                            key={feature}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      <div className="mt-6 flex items-end justify-between gap-4">
                        <div>
                          <div className="text-2xl font-semibold">{formatCurrency(product.price)}</div>
                          {product.originalPrice && (
                            <div className="text-sm text-slate-400 line-through">
                              {formatCurrency(product.originalPrice)}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => addToCart(product)}
                          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          Add to cart
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="subscription" className="relative overflow-hidden bg-[#07101f] py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,_rgba(34,211,238,0.18),_transparent_25%),radial-gradient(circle_at_80%_80%,_rgba(59,130,246,0.12),_transparent_20%)]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-cyan-200">
                  Subscription-led recurring revenue model
                </div>
                <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Refill delivery that keeps the device working without extra effort.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                  OdorZero supports a refillable cartridge system that is easy for households to maintain and ideal for a reliable subscription program with repeat engagement.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {[
                    'Scheduled cartridge delivery every 45 days',
                    'Pause, skip, or swap delivery from your account',
                    'Priority customer support for active subscribers',
                    'Lower long-term cost than repetitive disposable sprays',
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm leading-6 text-slate-200 backdrop-blur-xl"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <button
                    onClick={() => addToCart(products[5])}
                    className="rounded-full bg-white px-6 py-4 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
                  >
                    Add annual plan
                  </button>
                  <button
                    onClick={() => setOrdersOpen(true)}
                    className="rounded-full border border-white/15 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/5"
                  >
                    Manage orders
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="grid gap-5"
              >
                <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                  <img
                    src="/images/subscription.jpg"
                    alt="OdorZero refill subscription"
                    className="h-[320px] w-full rounded-[1.6rem] object-cover"
                  />
                </div>
                <div className="rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 p-7 backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm uppercase tracking-[0.22em] text-cyan-300">OdorZero Care+</div>
                      <div className="mt-2 text-3xl font-semibold text-white">{formatCurrency(4999)}/year</div>
                    </div>
                    <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                      Most convenient
                    </div>
                  </div>
                  <div className="mt-6 space-y-3 text-sm text-slate-200">
                    <div>• 8 refill shipments per year</div>
                    <div>• Support for one primary device</div>
                    <div>• Priority delivery and reorder reminders</div>
                    <div>• Easy replacement in under 30 seconds</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="reviews" className="bg-white py-24 text-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
            >
              <div className="max-w-2xl">
                <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-sky-700">
                  Customer sentiment
                </div>
                <h2 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
                  A product people describe as cleaner, calmer, and smarter.
                </h2>
              </div>
              <div className="rounded-[2rem] bg-slate-950 px-7 py-5 text-white shadow-xl">
                <div className="text-sm uppercase tracking-[0.22em] text-cyan-300">Average product rating</div>
                <div className="mt-2 flex items-center gap-3 text-4xl font-semibold">
                  4.8
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {testimonials.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className="rounded-[2rem] border border-slate-200 bg-slate-50 p-7 shadow-sm"
                >
                  <div className="flex gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star key={starIndex} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="mt-5 text-lg leading-8 text-slate-700">“{item.quote}”</p>
                  <div className="mt-8 border-t border-slate-200 pt-5">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-slate-500">{item.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="bg-[#050c18] py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-cyan-200">
                Frequently asked questions
              </div>
              <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Everything a buyer wants to know before checkout.
              </h2>
            </motion.div>

            <div className="mt-14 space-y-4">
              {faqs.map((item, index) => (
                <motion.div
                  key={item.question}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 backdrop-blur-xl"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-lg font-medium text-white">{item.question}</span>
                    {activeFaq === index ? (
                      <Minus className="h-5 w-5 text-cyan-300" />
                    ) : (
                      <Plus className="h-5 w-5 text-cyan-300" />
                    )}
                  </button>
                  <AnimatePresence initial={false}>
                    {activeFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-base leading-8 text-slate-300">{item.answer}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/8 bg-[#040914]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr]">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-semibold">OdorZero</div>
                  <div className="text-sm text-slate-400">Smart odor neutralization for modern homes</div>
                </div>
              </div>
              <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
                OdorZero sits between low-cost fresheners and high-end purifiers, delivering a more intelligent, efficient, and eco-conscious answer to recurring odor problems indoors.
              </p>
              <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
                ©️ 2026 OdorZero - A product of VayuTech Innovations. All rights reserved.
              </p>
            </div>

            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Navigate</div>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block transition hover:text-white"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Store</div>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <button onClick={() => setCartOpen(true)} className="block transition hover:text-white">
                  Cart
                </button>
                <button onClick={() => setOrdersOpen(true)} className="block transition hover:text-white">
                  View orders
                </button>
                <button
                  onClick={() => {
                    scrollToSection('subscription');
                  }}
                  className="block transition hover:text-white"
                >
                  Refill plans
                </button>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Contact</div>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-cyan-300" />
                  hello@odorzero.com
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-cyan-300" />
                  +91 98765 43210
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 text-cyan-300" />
                  <span>Amaravati, India · Shipping nationwide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 rounded-full border border-white/10 bg-slate-950/85 p-2 shadow-2xl backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOrdersOpen(true)}
            className="flex-1 rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-white/80"
          >
            Orders
          </button>
          <button
            onClick={() => setCartOpen(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 text-sm font-semibold text-slate-950"
          >
            <ShoppingCart className="h-4 w-4" />
            Cart ({cartCount})
          </button>
        </div>
      </div>

      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm"
              onClick={() => setCartOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed right-0 top-0 z-[61] flex h-full w-full max-w-xl flex-col bg-white text-slate-950 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <div>
                  <div className="text-2xl font-semibold">Your cart</div>
                  <div className="text-sm text-slate-500">{cartCount} items ready for checkout</div>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="rounded-full border border-slate-200 p-3 text-slate-600"
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                {cart.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 px-8 text-center">
                    <ShoppingCart className="h-10 w-10 text-slate-400" />
                    <div className="mt-4 text-xl font-semibold">Your cart is empty</div>
                    <p className="mt-2 text-sm leading-7 text-slate-500">
                      Add a device, refill pack, or subscription plan to continue.
                    </p>
                    <button
                      onClick={() => {
                        setCartOpen(false);
                        scrollToSection('store');
                      }}
                      className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
                    >
                      Explore products
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="rounded-[1.75rem] border border-slate-200 p-4">
                        <div className="flex gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-24 w-24 rounded-2xl object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="font-semibold">{item.name}</div>
                                <div className="mt-1 text-sm text-slate-500">{item.badge}</div>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-rose-500"
                                aria-label="Remove item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="mt-4 flex items-center justify-between gap-4">
                              <div className="inline-flex items-center rounded-full border border-slate-200">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="px-3 py-2 text-slate-600"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="min-w-10 text-center text-sm font-semibold">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="px-3 py-2 text-slate-600"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="text-lg font-semibold">{formatCurrency(item.price * item.quantity)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 px-6 py-6">
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-950">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span className="font-medium text-slate-950">
                      {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-950">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
                <button
                  disabled={cart.length === 0}
                  onClick={() => {
                    setCartOpen(false);
                    setCheckoutOpen(true);
                  }}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Secure checkout
                  <CreditCard className="h-4 w-4" />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {checkoutOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
              onClick={() => setCheckoutOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="fixed inset-0 z-[71] flex items-center justify-center overflow-y-auto p-4"
            >
              <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white text-slate-950 shadow-2xl">
                <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                  <form onSubmit={submitOrder} className="p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm uppercase tracking-[0.22em] text-sky-700">Secure checkout</div>
                        <h3 className="mt-2 text-3xl font-semibold tracking-tight">Payment & shipping</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCheckoutOpen(false)}
                        className="rounded-full border border-slate-200 p-3 text-slate-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      <input
                        required
                        value={checkout.name}
                        onChange={(event) => handleCheckoutChange('name', event.target.value)}
                        placeholder="Full name"
                        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                      />
                      <input
                        required
                        type="email"
                        value={checkout.email}
                        onChange={(event) => handleCheckoutChange('email', event.target.value)}
                        placeholder="Email address"
                        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                      />
                      <input
                        required
                        value={checkout.phone}
                        onChange={(event) => handleCheckoutChange('phone', event.target.value)}
                        placeholder="Phone number"
                        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                      />
                      <input
                        required
                        value={checkout.city}
                        onChange={(event) => handleCheckoutChange('city', event.target.value)}
                        placeholder="City"
                        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                      />
                      <input
                        required
                        value={checkout.address}
                        onChange={(event) => handleCheckoutChange('address', event.target.value)}
                        placeholder="Shipping address"
                        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 sm:col-span-2"
                      />
                      <input
                        required
                        value={checkout.pincode}
                        onChange={(event) => handleCheckoutChange('pincode', event.target.value)}
                        placeholder="Pincode"
                        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 sm:col-span-2"
                      />
                    </div>

                    <div className="mt-8">
                      <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Choose payment method
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {[
                          ['card', 'Card'],
                          ['upi', 'UPI'],
                          ['cod', 'Cash on Delivery'],
                        ].map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleCheckoutChange('paymentMethod', value)}
                            className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${checkout.paymentMethod === value
                              ? 'border-slate-950 bg-slate-950 text-white'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
                              }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4">
                      {checkout.paymentMethod === 'card' && (
                        <>
                          <input
                            required
                            value={checkout.cardNumber}
                            onChange={(event) => handleCheckoutChange('cardNumber', event.target.value)}
                            placeholder="Card number"
                            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                          />
                          <div className="grid gap-4 sm:grid-cols-2">
                            <input
                              required
                              value={checkout.expiry}
                              onChange={(event) => handleCheckoutChange('expiry', event.target.value)}
                              placeholder="MM/YY"
                              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                            />
                            <input
                              required
                              value={checkout.cvv}
                              onChange={(event) => handleCheckoutChange('cvv', event.target.value)}
                              placeholder="CVV"
                              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                            />
                          </div>
                        </>
                      )}

                      {checkout.paymentMethod === 'upi' && (
                        <input
                          required
                          value={checkout.upiId}
                          onChange={(event) => handleCheckoutChange('upiId', event.target.value)}
                          placeholder="yourname@bank"
                          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                        />
                      )}

                      {checkout.paymentMethod === 'cod' && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-800">
                          Pay when the order arrives. COD availability depends on delivery location.
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Place order
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>

                  <div className="bg-slate-950 p-6 text-white sm:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm uppercase tracking-[0.22em] text-cyan-300">Order summary</div>
                        <div className="mt-2 text-3xl font-semibold">{formatCurrency(total)}</div>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                        256-bit secure flow
                      </div>
                    </div>

                    <div className="mt-8 space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                          <img src={item.image} alt={item.name} className="h-16 w-16 rounded-2xl object-cover" />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-white">{item.name}</div>
                            <div className="text-sm text-slate-300">Qty {item.quantity}</div>
                          </div>
                          <div className="font-semibold">{formatCurrency(item.price * item.quantity)}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 space-y-3 text-sm text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold text-white">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>

                    <div className="mt-8 rounded-[1.75rem] border border-cyan-400/20 bg-cyan-400/10 p-5 text-sm leading-7 text-cyan-50">
                      Your checkout supports devices, refill packs, and subscriptions in one order for a cleaner direct-to-consumer buying flow.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ordersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] bg-black/55 backdrop-blur-sm"
              onClick={() => setOrdersOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed right-0 top-0 z-[81] flex h-full w-full max-w-2xl flex-col bg-[#07101f] text-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div>
                  <div className="text-2xl font-semibold">Orders</div>
                  <div className="text-sm text-slate-300">Track purchases and reorder essentials</div>
                </div>
                <button
                  onClick={() => setOrdersOpen(false)}
                  className="rounded-full border border-white/10 p-3 text-slate-300"
                  aria-label="Close orders"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                {orders.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/15 bg-white/5 px-8 text-center">
                    <Package className="h-10 w-10 text-cyan-300" />
                    <div className="mt-4 text-xl font-semibold">No orders yet</div>
                    <p className="mt-2 max-w-sm text-sm leading-7 text-slate-300">
                      Once you complete checkout, your orders will appear here with totals, items, and delivery details.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {orders.map((order) => (
                      <div key={order.id} className="rounded-[1.9rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="text-sm uppercase tracking-[0.18em] text-cyan-300">{order.id}</div>
                            <div className="mt-1 text-sm text-slate-300">{order.createdAt}</div>
                          </div>
                          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-200">
                            {order.status}
                          </div>
                        </div>

                        <div className="mt-5 space-y-3">
                          {order.items.map((item) => (
                            <div key={`${order.id}-${item.id}`} className="flex items-center justify-between gap-4 text-sm text-slate-200">
                              <div>
                                {item.name} × {item.quantity}
                              </div>
                              <div>{formatCurrency(item.price * item.quantity)}</div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-5 grid gap-4 rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4 text-sm text-slate-300 sm:grid-cols-2">
                          <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Deliver to</div>
                            <div className="mt-2 leading-7 text-slate-200">
                              {order.customer.name}
                              <br />
                              {order.customer.address}, {order.customer.city} {order.customer.pincode}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Payment</div>
                            <div className="mt-2 capitalize text-slate-200">{order.customer.paymentMethod}</div>
                            <div className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-400">Total</div>
                            <div className="mt-2 text-xl font-semibold text-white">{formatCurrency(order.total)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="fixed right-4 top-24 z-[90] rounded-full border border-cyan-400/20 bg-slate-950/90 px-5 py-3 text-sm font-medium text-cyan-100 shadow-2xl backdrop-blur-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
