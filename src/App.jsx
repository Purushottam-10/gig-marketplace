import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Search, PlusCircle, CheckCircle2, XCircle, Clock, 
  User, DollarSign, Filter, Briefcase, MessageSquare, 
  ArrowRight, ShieldCheck, ChevronRight, AlertCircle, RefreshCw,
  Send, Star, UploadCloud, Download, Check, FileText, Wallet,
  Flame, Zap, Compass, Layers, CheckCircle, ExternalLink
} from 'lucide-react';

const INITIAL_GIGS = [
  {
    id: 'gig-1',
    creatorId: 'c1',
    creatorName: 'Aarav Sharma',
    creatorHandle: '@aaravcreates',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80',
    title: 'Retention-Engine TikTok & IG Reels Editing',
    category: 'Video Editing',
    rate: 65,
    deliveryDays: 2,
    description: 'Pacing, sound effects, subtitles, and high-retention storytelling hooks engineered for short-form virality.',
    rating: 4.9,
    reviewsCount: 48,
    activePendingCount: 1,
    maxPendingCapacity: 3,
    badge: 'Trending 🔥',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3
  },
  {
    id: 'gig-2',
    creatorId: 'c2',
    creatorName: 'Elena Rostova',
    creatorHandle: '@elenadesigns',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80',
    title: 'Custom Brand Identity & Stream Visual Package',
    category: 'Graphic Design',
    rate: 140,
    deliveryDays: 4,
    description: 'Complete visual identity overhaul with vector logos, stream overlays, typography kits, and 3D icons.',
    rating: 5.0,
    reviewsCount: 62,
    badge: 'Top Rated ⭐',
    activePendingCount: 2,
    maxPendingCapacity: 3,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7
  },
  {
    id: 'gig-3',
    creatorId: 'c3',
    creatorName: 'Marcus Vance',
    creatorHandle: '@marcusaudio',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
    title: 'Punchy Podcast Mastering & Vocal Clarity Polish',
    category: 'Music & Audio',
    rate: 85,
    deliveryDays: 2,
    description: 'Studio-standard EQ cleanup, noise reduction, warm tube compression, and loudness match for Spotify.',
    rating: 4.8,
    reviewsCount: 31,
    badge: 'Quick Turnaround ⚡',
    activePendingCount: 0,
    maxPendingCapacity: 4,
    createdAt: Date.now() - 1000 * 60 * 60 * 18
  }
];

const INITIAL_BOOKINGS = [
  {
    id: 'bk-101',
    gigId: 'gig-1',
    gigTitle: 'Retention-Engine TikTok & IG Reels Editing',
    clientId: 'client-me',
    clientName: 'Sarah Jenkins (You)',
    creatorId: 'c1',
    creatorName: 'Aarav Sharma',
    amount: 65,
    status: 'In Progress',
    brief: 'Need 3 video reels edited from raw podcast audio highlights. Bold captions and seamless b-roll inserts.',
    deadline: '2026-10-15',
    createdAt: new Date().toLocaleDateString(),
    declineReason: '',
    deliveryData: null,
    messages: [
      { sender: 'creator', text: 'Hey Sarah! I received your raw assets, working on draft 1 right now.', time: '10:14 AM' }
    ]
  }
];

const CATEGORIES = ['All', 'Video Editing', 'Graphic Design', 'Music & Audio', 'Copywriting', 'Voiceover'];

export default function App() {
  const [role, setRole] = useState('client'); 
  const [activeTab, setActiveTab] = useState('marketplace'); 

  // Dynamic Persisted Store
  const [gigs, setGigs] = useState(() => JSON.parse(localStorage.getItem('creator_gigs_v3')) || INITIAL_GIGS);
  const [bookings, setBookings] = useState(() => JSON.parse(localStorage.getItem('creator_bookings_v3')) || INITIAL_BOOKINGS);
  const [wallet, setWallet] = useState(() => JSON.parse(localStorage.getItem('user_wallet_v3')) || { clientBalance: 950, creatorEarnings: 420 });

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [rankingRule, setRankingRule] = useState('discovery');
  const [maxPriceFilter, setMaxPriceFilter] = useState(250);

  // Modals & Chat
  const [selectedGigForBooking, setSelectedGigForBooking] = useState(null);
  const [activeChatBooking, setActiveChatBooking] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Deliverable modal
  const [deliveryModalBooking, setDeliveryModalBooking] = useState(null);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [deliveryUrl, setDeliveryUrl] = useState('');

  // Gig Creation Form
  const [newGig, setNewGig] = useState({
    title: '', category: 'Video Editing', rate: '', deliveryDays: 2, description: '', maxPendingCapacity: 3
  });

  // Client Booking Form
  const [bookingForm, setBookingForm] = useState({ brief: '', deadline: '' });

  useEffect(() => {
    localStorage.setItem('creator_gigs_v3', JSON.stringify(gigs));
  }, [gigs]);

  useEffect(() => {
    localStorage.setItem('creator_bookings_v3', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('user_wallet_v3', JSON.stringify(wallet));
  }, [wallet]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // DP3 Discovery Ranking
  const filteredAndSortedGigs = gigs
    .filter(g => {
      const matchCat = selectedCategory === 'All' || g.category === selectedCategory;
      const matchSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.creatorName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPrice = g.rate <= maxPriceFilter;
      return matchCat && matchSearch && matchPrice;
    })
    .sort((a, b) => {
      if (rankingRule === 'discovery') {
        const scoreA = (a.rating * 20) + (a.reviewsCount * 3) - ((a.activePendingCount || 0) * 8);
        const scoreB = (b.rating * 20) + (b.reviewsCount * 3) - ((b.activePendingCount || 0) * 8);
        return scoreB - scoreA;
      }
      if (rankingRule === 'rating') return b.rating - a.rating;
      if (rankingRule === 'newest') return b.createdAt - a.createdAt;
      if (rankingRule === 'price-low') return a.rate - b.rate;
      return 0;
    });

  // Handle Gig Creation
  const handleCreateGig = (e) => {
    e.preventDefault();
    if (!newGig.title || !newGig.rate || !newGig.description) {
      showToast('Please fill all fields');
      return;
    }
    const created = {
      id: `gig-${Date.now()}`,
      creatorId: 'c-me',
      creatorName: 'You (Creator)',
      creatorHandle: '@procreator',
      creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      title: newGig.title,
      category: newGig.category,
      rate: Number(newGig.rate),
      deliveryDays: Number(newGig.deliveryDays),
      description: newGig.description,
      rating: 5.0,
      reviewsCount: 1,
      badge: 'New 🚀',
      activePendingCount: 0,
      maxPendingCapacity: Number(newGig.maxPendingCapacity) || 3,
      createdAt: Date.now()
    };
    setGigs([created, ...gigs]);
    setNewGig({ title: '', category: 'Video Editing', rate: '', deliveryDays: 2, description: '', maxPendingCapacity: 3 });
    showToast('Gig is live in the marketplace!');
    setActiveTab('creator-dash');
  };

  // Handle Booking
  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (wallet.clientBalance < selectedGigForBooking.rate) {
      alert("Insufficient client balance. Top up needed.");
      return;
    }

    if (selectedGigForBooking.activePendingCount >= selectedGigForBooking.maxPendingCapacity) {
      alert("DP2 Guard: Creator capacity full. Please try another creator.");
      return;
    }

    const newBooking = {
      id: `bk-${Date.now().toString().slice(-4)}`,
      gigId: selectedGigForBooking.id,
      gigTitle: selectedGigForBooking.title,
      clientId: 'client-me',
      clientName: 'Sarah Jenkins (You)',
      creatorId: selectedGigForBooking.creatorId,
      creatorName: selectedGigForBooking.creatorName,
      amount: selectedGigForBooking.rate,
      status: 'Pending',
      brief: bookingForm.brief,
      deadline: bookingForm.deadline,
      createdAt: new Date().toLocaleDateString(),
      declineReason: '',
      deliveryData: null,
      messages: [{ sender: 'client', text: bookingForm.brief, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
    };

    setWallet(w => ({ ...w, clientBalance: w.clientBalance - selectedGigForBooking.rate }));
    setGigs(gigs.map(g => g.id === selectedGigForBooking.id ? { ...g, activePendingCount: (g.activePendingCount || 0) + 1 } : g));
    setBookings([newBooking, ...bookings]);
    setSelectedGigForBooking(null);
    setBookingForm({ brief: '', deadline: '' });
    showToast('Funds secured in escrow! Booking submitted.');
    setActiveTab('my-bookings');
  };

  // Creator Acceptance / Decline
  const handleBookingDecision = (bookingId, decision, reason = '') => {
    const bk = bookings.find(b => b.id === bookingId);
    if (!bk) return;

    if (decision === 'Declined') {
      setWallet(w => ({ ...w, clientBalance: w.clientBalance + bk.amount }));
    }

    setBookings(bookings.map(item => {
      if (item.id === bookingId) {
        return {
          ...item,
          status: decision === 'Accepted' ? 'In Progress' : 'Declined',
          declineReason: decision === 'Declined' ? (reason || 'Creator over capacity.') : ''
        };
      }
      return item;
    }));

    if (decision === 'Declined') {
      setGigs(gigs.map(g => g.id === bk.gigId ? { ...g, activePendingCount: Math.max(0, (g.activePendingCount || 1) - 1) } : g));
    }

    showToast(`Order marked as ${decision}`);
  };

  // Work Delivery & Release
  const handleDeliverWork = (e) => {
    e.preventDefault();
    if (!deliveryUrl) return;

    setBookings(bookings.map(b => b.id === deliveryModalBooking.id ? {
      ...b,
      status: 'Delivered',
      deliveryData: { url: deliveryUrl, note: deliveryNote, deliveredAt: new Date().toLocaleDateString() }
    } : b));

    setDeliveryModalBooking(null);
    setDeliveryUrl('');
    setDeliveryNote('');
    showToast('Deliverable dispatched to client!');
  };

  const handleApproveWork = (booking) => {
    setBookings(bookings.map(b => b.id === booking.id ? { ...b, status: 'Completed' } : b));
    setWallet(w => ({ ...w, creatorEarnings: w.creatorEarnings + booking.amount }));
    setGigs(gigs.map(g => g.id === booking.gigId ? { ...g, activePendingCount: Math.max(0, (g.activePendingCount || 1) - 1) } : g));
    showToast(`Completed! $${booking.amount} released to Creator.`);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChatBooking) return;

    const newMsg = {
      sender: role === 'client' ? 'client' : 'creator',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setBookings(bookings.map(b => b.id === activeChatBooking.id ? { ...b, messages: [...(b.messages || []), newMsg] } : b));
    setActiveChatBooking({ ...activeChatBooking, messages: [...(activeChatBooking.messages || []), newMsg] });
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      
      {/* Background Radial Glow Spheres */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/3 -right-40 w-96 h-96 bg-violet-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white backdrop-blur-xl px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-indigo-500/30 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Glassmorphic Navbar */}
      <header className="sticky top-0 z-40 bg-[#0d121f]/75 backdrop-blur-xl border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('marketplace')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition duration-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">CreatorGig</span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">Live Escrow</span>
              </div>
              <p className="text-[11px] text-slate-400">The premier high-velocity creator network</p>
            </div>
          </div>

          {/* Navigation Controls */}
          <nav className="hidden md:flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
            {role === 'client' ? (
              <>
                <button 
                  onClick={() => setActiveTab('marketplace')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'marketplace' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white'}`}
                >
                  Marketplace
                </button>
                <button 
                  onClick={() => setActiveTab('my-bookings')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition relative ${activeTab === 'my-bookings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white'}`}
                >
                  My Pipeline
                  {bookings.filter(b => b.clientId === 'client-me').length > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-violet-500 text-white rounded-full">
                      {bookings.filter(b => b.clientId === 'client-me').length}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setActiveTab('creator-dash')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'creator-dash' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white'}`}
                >
                  Studio Dashboard
                </button>
                <button 
                  onClick={() => setActiveTab('post-gig')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${activeTab === 'post-gig' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white'}`}
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Post Service
                </button>
              </>
            )}
          </nav>

          {/* User Controls & Balance */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 bg-white/5 border border-white/10 px-3.5 py-2 rounded-2xl text-xs font-semibold backdrop-blur-md">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>{role === 'client' ? `Balance: $${wallet.clientBalance}` : `Earned: $${wallet.creatorEarnings}`}</span>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => { setRole('client'); setActiveTab('marketplace'); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${role === 'client' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <User className="w-3.5 h-3.5" /> Client
              </button>
              <button
                onClick={() => { setRole('creator'); setActiveTab('creator-dash'); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${role === 'creator' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <Briefcase className="w-3.5 h-3.5" /> Creator
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Showcase Header */}
      {activeTab === 'marketplace' && (
        <section className="relative pt-12 pb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-white/10 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/30 backdrop-blur-2xl shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-indigo-300">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Book Top 1% Gen-Z Digital Creators
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Supercharge your brand with <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">elite digital talent</span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base font-normal leading-relaxed">
                Zero friction, smart queue limits, transparent rejections, and instantaneous escrow transactions.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">

        {/* VIEW 1: MARKETPLACE */}
        {activeTab === 'marketplace' && (
          <div className="space-y-8">
            {/* Filter & Search Bar */}
            <div className="bg-[#101726]/80 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-white/10 shadow-2xl space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                {/* Search */}
                <div className="relative md:col-span-5">
                  <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by specialty, creator, keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>

                {/* DP3 Discovery Algorithm Selector */}
                <div className="md:col-span-4 flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">Discovery (DP3):</span>
                  <select
                    value={rankingRule}
                    onChange={(e) => setRankingRule(e.target.value)}
                    className="w-full text-xs font-semibold bg-[#161f33] border border-white/10 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="discovery">Smart Score (Rating × Trust − Queue Load)</option>
                    <option value="rating">Top Rated Only</option>
                    <option value="price-low">Most Affordable First</option>
                    <option value="newest">Recently Published</option>
                  </select>
                </div>

                {/* Price Filter */}
                <div className="md:col-span-3 flex items-center gap-3">
                  <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">Max: ${maxPriceFilter}</span>
                  <input 
                    type="range" 
                    min="20" 
                    max="300" 
                    step="10" 
                    value={maxPriceFilter}
                    onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap border ${
                      selectedCategory === cat 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-500/25' 
                        : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Gigs Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedGigs.map(gig => {
                const isAtCapacity = gig.activePendingCount >= gig.maxPendingCapacity;
                const capacityPercentage = Math.round((gig.activePendingCount / gig.maxPendingCapacity) * 100);

                return (
                  <div key={gig.id} className="group bg-[#111726]/70 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10">
                    
                    {/* Media Cover */}
                    <div className="relative h-44 w-full overflow-hidden">
                      <img 
                        src={gig.coverImage} 
                        alt={gig.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111726] via-transparent to-transparent" />
                      
                      {gig.badge && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 text-[10px] font-black text-white">
                          {gig.badge}
                        </div>
                      )}

                      <div className="absolute top-3 right-3 text-[11px] font-extrabold px-3 py-1 bg-indigo-500/20 text-indigo-300 backdrop-blur-md rounded-full border border-indigo-500/30">
                        {gig.category}
                      </div>
                    </div>

                    <div className="p-6 pt-2 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        {/* Creator Info */}
                        <div className="flex items-center gap-3 mb-3">
                          <img src={gig.creatorAvatar} alt={gig.creatorName} className="w-9 h-9 rounded-full object-cover border border-white/20" />
                          <div>
                            <h4 className="font-bold text-white text-xs">{gig.creatorName}</h4>
                            <p className="text-[11px] text-slate-400">{gig.creatorHandle}</p>
                          </div>
                        </div>

                        <h3 className="font-bold text-white text-sm line-clamp-2 leading-snug group-hover:text-indigo-300 transition">
                          {gig.title}
                        </h3>
                        <p className="text-slate-400 text-xs line-clamp-2 mt-2 leading-relaxed font-light">
                          {gig.description}
                        </p>
                      </div>

                      {/* Card Details & Capacity (DP2) */}
                      <div className="pt-3 border-t border-white/10 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="flex items-center gap-1 font-bold text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-amber-400" /> {gig.rating} <span className="text-slate-500 font-normal">({gig.reviewsCount})</span>
                          </span>
                          <span className="flex items-center gap-1 text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-slate-500" /> {gig.deliveryDays}d turnaround
                          </span>
                        </div>

                        {/* DP2 Queue Guard */}
                        <div className="bg-white/5 p-2 rounded-xl border border-white/5 space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold">
                            <span className="text-slate-400">Active Queue (DP2):</span>
                            <span className={isAtCapacity ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                              {gig.activePendingCount} / {gig.maxPendingCapacity} ({capacityPercentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${isAtCapacity ? 'bg-rose-500' : 'bg-emerald-400'}`} 
                              style={{ width: `${Math.min(capacityPercentage, 100)}%` }} 
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Fixed Price</span>
                            <p className="text-lg font-black text-white">${gig.rate}</p>
                          </div>
                          <button
                            disabled={isAtCapacity}
                            onClick={() => setSelectedGigForBooking(gig)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg ${
                              isAtCapacity 
                                ? 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/5' 
                                : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-indigo-500/20'
                            }`}
                          >
                            {isAtCapacity ? 'Slots Full' : 'Book Gig'} <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: CLIENT MY BOOKINGS */}
        {activeTab === 'my-bookings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white">My Active Bookings</h2>
              <p className="text-xs text-slate-400 mt-1">Review orders, inspect work deliverables, and coordinate directly via live chat.</p>
            </div>

            <div className="space-y-4">
              {bookings.map(bk => (
                <div key={bk.id} className="bg-[#101726]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-500">#{bk.id}</span>
                      <h3 className="font-bold text-white text-base">{bk.gigTitle}</h3>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        bk.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        bk.status === 'Delivered' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                        bk.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        bk.status === 'Declined' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {bk.status}
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveChatBooking(bk)}
                      className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl border border-white/10 flex items-center gap-1.5 transition self-start md:self-auto"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> Open Chat ({bk.messages?.length || 0})
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <span className="font-bold text-slate-400">Brief:</span> {bk.brief}
                  </p>

                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 pt-2 border-t border-white/10">
                    <div>Creator: <strong className="text-white">{bk.creatorName}</strong> • Escrow Held: <strong className="text-emerald-400 font-bold">${bk.amount}</strong></div>
                    <div>Target Date: <strong>{bk.deadline}</strong></div>
                  </div>

                  {/* Delivery Approval Box */}
                  {bk.status === 'Delivered' && (
                    <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                        <UploadCloud className="w-4 h-4 text-indigo-400" /> Finished Work Deliverable Submitted
                      </div>
                      <p className="text-xs text-slate-300">{bk.deliveryData?.note || 'No special instructions.'}</p>
                      <div className="flex items-center justify-between pt-2">
                        <a 
                          href={bk.deliveryData?.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Open Deliverable Link
                        </a>
                        <button
                          onClick={() => handleApproveWork(bk)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve & Release Escrow (${bk.amount})
                        </button>
                      </div>
                    </div>
                  )}

                  {/* DP1 Rejection Flow */}
                  {bk.status === 'Declined' && (
                    <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-2xl space-y-2">
                      <div className="flex items-center gap-1.5 text-rose-300 font-bold text-xs">
                        <XCircle className="w-4 h-4 text-rose-400" /> Reason for Decline (DP1):
                      </div>
                      <p className="text-xs text-slate-300">{bk.declineReason || 'Creator schedule unavailable.'}</p>
                      <p className="text-[11px] text-emerald-400 font-semibold">✓ Funds (${bk.amount}) refunded instantly back to balance.</p>
                      <button 
                        onClick={() => { setSelectedCategory('All'); setActiveTab('marketplace'); }}
                        className="text-xs text-indigo-400 font-bold hover:underline flex items-center gap-1 pt-1"
                      >
                        Explore other recommended creators <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: CREATOR DASHBOARD */}
        {activeTab === 'creator-dash' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-white">Creator Studio & Escrow Hub</h2>
                <p className="text-xs text-slate-400 mt-1">Accept requests, track pending earnings, and dispatch completed assets.</p>
              </div>
              <button
                onClick={() => setActiveTab('post-gig')}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                <PlusCircle className="w-4 h-4" /> Add New Service
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#101726]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Orders</span>
                <p className="text-3xl font-black text-amber-400 mt-1">{bookings.filter(b => b.status === 'In Progress' || b.status === 'Pending').length}</p>
              </div>
              <div className="bg-[#101726]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed Jobs</span>
                <p className="text-3xl font-black text-emerald-400 mt-1">{bookings.filter(b => b.status === 'Completed').length}</p>
              </div>
              <div className="bg-[#101726]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Released Revenue</span>
                <p className="text-3xl font-black text-indigo-400 mt-1">${wallet.creatorEarnings}</p>
              </div>
            </div>

            {/* Studio Job List */}
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base">Incoming Studio Inquiries</h3>
              {bookings.map(bk => (
                <div key={bk.id} className="bg-[#101726]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-500">#{bk.id}</span>
                      <h4 className="font-bold text-white text-sm">{bk.gigTitle}</h4>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300">
                        {bk.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 bg-white/5 p-3 rounded-2xl"><strong className="text-slate-400">Brief:</strong> {bk.brief}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>Client: <strong className="text-white">{bk.clientName}</strong></span>
                      <span>Target: <strong>{bk.deadline}</strong></span>
                      <span>Payment: <strong className="text-emerald-400 font-black">${bk.amount}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-center">
                    <button
                      onClick={() => setActiveChatBooking(bk)}
                      className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl border border-white/10 flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Chat
                    </button>

                    {bk.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleBookingDecision(bk.id, 'Accepted')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-lg shadow-emerald-600/30"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt("Enter specific decline reason (DP1):", "Schedule currently over capacity for this turnaround.");
                            if (reason !== null) handleBookingDecision(bk.id, 'Declined', reason);
                          }}
                          className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs font-bold border border-rose-500/30"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {bk.status === 'In Progress' && (
                      <button
                        onClick={() => setDeliveryModalBooking(bk)}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-1.5"
                      >
                        <UploadCloud className="w-3.5 h-3.5" /> Submit Work
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: POST GIG */}
        {activeTab === 'post-gig' && (
          <div className="max-w-2xl mx-auto bg-[#101726]/90 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl">
            <h2 className="text-xl font-black text-white mb-1">Publish New Service</h2>
            <p className="text-xs text-slate-400 mb-6">Set deliverables, flat rates, and queue capacity guard limits (DP2).</p>

            <form onSubmit={handleCreateGig} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gig Title</label>
                <input
                  type="text"
                  placeholder="e.g. Next-Gen 3D Motion Graphics & Unreal Engine Render"
                  value={newGig.title}
                  onChange={(e) => setNewGig({ ...newGig, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={newGig.category}
                    onChange={(e) => setNewGig({ ...newGig, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#161f33] border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    min="5"
                    value={newGig.rate}
                    onChange={(e) => setNewGig({ ...newGig, rate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Delivery Time (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={newGig.deliveryDays}
                    onChange={(e) => setNewGig({ ...newGig, deliveryDays: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Max Queue Limit (DP2)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newGig.maxPendingCapacity}
                    onChange={(e) => setNewGig({ ...newGig, maxPendingCapacity: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deliverables & Specifications</label>
                <textarea
                  rows="4"
                  placeholder="Outline expected workflow, file extensions, software used..."
                  value={newGig.description}
                  onChange={(e) => setNewGig({ ...newGig, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('creator-dash')}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-500/25"
                >
                  Publish Service
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* MODAL 1: ORDER BOOKING FORM */}
      {selectedGigForBooking && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121929] max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-white text-base">Book Gig with Escrow Hold</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedGigForBooking.title}</p>
              </div>
              <button onClick={() => setSelectedGigForBooking(null)} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] text-indigo-400 uppercase font-black">Creator</span>
                <p className="font-bold text-white text-sm">{selectedGigForBooking.creatorName}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-indigo-400 uppercase font-black">Escrow Total</span>
                <p className="font-black text-emerald-400 text-lg">${selectedGigForBooking.rate}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Project Brief</label>
                <textarea
                  rows="3"
                  placeholder="Outline links, style targets, and expectations..."
                  value={bookingForm.brief}
                  onChange={(e) => setBookingForm({ ...bookingForm, brief: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Deadline</label>
                <input
                  type="date"
                  value={bookingForm.deadline}
                  onChange={(e) => setBookingForm({ ...bookingForm, deadline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedGigForBooking(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-500/25"
                >
                  Deposit Escrow & Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: IN-APP CHAT */}
      {activeChatBooking && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121929] max-w-lg w-full rounded-3xl shadow-2xl border border-white/10 flex flex-col h-[520px]">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-3xl">
              <div>
                <h4 className="font-bold text-white text-sm">Room: #{activeChatBooking.id}</h4>
                <p className="text-[11px] text-slate-400">{activeChatBooking.gigTitle}</p>
              </div>
              <button onClick={() => setActiveChatBooking(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {activeChatBooking.messages && activeChatBooking.messages.map((m, idx) => {
                const isMe = (role === 'client' && m.sender === 'client') || (role === 'creator' && m.sender === 'creator');
                return (
                  <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-slate-500 mb-0.5">{m.sender === 'client' ? 'Client' : 'Creator'} • {m.time}</span>
                    <div className={`px-4 py-2.5 rounded-2xl text-xs max-w-xs ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/10 text-slate-200 rounded-tl-none'}`}>
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DISPATCH DELIVERABLE */}
      {deliveryModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121929] max-w-md w-full rounded-3xl p-6 shadow-2xl border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white text-base">Submit Finished Deliverable</h3>
              <button onClick={() => setDeliveryModalBooking(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleDeliverWork} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Asset Cloud URL</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={deliveryUrl}
                  onChange={(e) => setDeliveryUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Handover Notes</label>
                <textarea
                  rows="3"
                  placeholder="Specify formats, revision provisions, and download instructions..."
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeliveryModalBooking(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-500/25"
                >
                  Confirm Delivery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}