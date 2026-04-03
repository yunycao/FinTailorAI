import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Wallet, 
  Target, 
  CheckCircle2, 
  Loader2,
  ChevronRight,
  RefreshCcw,
  ExternalLink,
  MessageSquare,
  Send,
  User,
  Bot,
  X
} from 'lucide-react';
import { UserProfile, MarketingMaterial, Step } from './types';
import { generateMarketingMaterial } from './services/geminiService';
import { createFinancialChat } from './services/chatService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function App() {
  const [step, setStep] = useState<Step>('intro');
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: undefined,
    financialGoals: [],
    riskTolerance: 'medium',
    currentSituation: '',
    communicationStyle: 'professional',
  });
  const [result, setResult] = useState<MarketingMaterial | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleStart = () => setStep('profile');

  const handleGenerate = async () => {
    setLoading(true);
    setStep('generating');
    setError(null);
    try {
      const data = await generateMarketingMaterial(profile);
      setResult(data);
      setStep('result');
    } catch (err) {
      console.error(err);
      setError('Failed to generate your personalized plan. Please try again.');
      setStep('profile');
    } finally {
      setLoading(false);
    }
  };

  const startChat = (withProfile = false) => {
    chatRef.current = createFinancialChat(withProfile ? profile : undefined);
    setStep('chat');
    if (messages.length === 0) {
      const initialMessage = withProfile 
        ? `Hello ${profile.name}! I've reviewed your profile. How can I help you with your goals for ${profile.financialGoals.join(', ')} today?`
        : "Hello! I'm your FinTailor AI assistant. How can I help you with your financial questions today?";
      setMessages([{ role: 'model', text: initialMessage }]);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMessage });
      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const reset = () => {
    setStep('intro');
    setResult(null);
    setMessages([]);
    chatRef.current = null;
    setProfile({
      name: '',
      age: undefined,
      financialGoals: [],
      riskTolerance: 'medium',
      currentSituation: '',
      communicationStyle: 'professional',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 flex items-center px-6 justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <span className="font-semibold text-slate-900 tracking-tight">FinTailor AI</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
          <button onClick={() => setStep('intro')} className="hover:text-slate-900 transition-colors">How it works</button>
          <button onClick={() => startChat(false)} className="flex items-center gap-2 hover:text-slate-900 transition-colors">
            <MessageSquare className="w-4 h-4" />
            AI Assistant
          </button>
          <a href="#" className="hover:text-slate-900 transition-colors">Support</a>
        </nav>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8 py-12"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium uppercase tracking-wider"
                >
                  <Sparkles className="w-3 h-3" />
                  AI-Powered Financial Guidance
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-light tracking-tight text-slate-900">
                  Your Financial Future, <br />
                  <span className="font-semibold">Tailored to You.</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
                  Discover the best financial services and strategies personalized for your unique goals. Simple, secure, and completely free.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={handleStart}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-medium hover:bg-slate-800 transition-all flex items-center gap-2 group shadow-xl shadow-slate-200"
                >
                  Start Your Journey
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => startChat(false)}
                  className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-medium hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat with AI Assistant
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
                {[
                  { icon: Wallet, title: 'Smart Savings', desc: 'Find high-yield accounts that work for you.' },
                  { icon: TrendingUp, title: 'Growth Strategies', desc: 'Personalized investment paths for any risk level.' },
                  { icon: Target, title: 'Goal Focused', desc: 'Retirement, home buying, or debt freedom.' }
                ].map((feature, i) => (
                  <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 card-shadow text-left space-y-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-slate-900">Tell us about yourself</h2>
                <p className="text-slate-500">This helps our AI tailor the perfect financial strategy for you.</p>
              </div>

              <div className="space-y-6 bg-white p-8 rounded-3xl border border-slate-100 card-shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Age (Optional)</label>
                    <input
                      type="number"
                      value={profile.age || ''}
                      onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || undefined })}
                      placeholder="25"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">What are your financial goals?</label>
                  <div className="flex flex-wrap gap-2">
                    {['Emergency Fund', 'Retirement', 'Home Buying', 'Investing', 'Debt Repayment', 'Travel Fund'].map((goal) => (
                      <button
                        key={goal}
                        onClick={() => {
                          const goals = profile.financialGoals.includes(goal)
                            ? profile.financialGoals.filter(g => g !== goal)
                            : [...profile.financialGoals, goal];
                          setProfile({ ...profile, financialGoals: goals });
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          profile.financialGoals.includes(goal)
                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Risk Tolerance</label>
                  <div className="grid grid-cols-3 gap-4">
                    {(['low', 'medium', 'high'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setProfile({ ...profile, riskTolerance: level })}
                        className={`py-3 rounded-xl text-sm font-medium border transition-all capitalize ${
                          profile.riskTolerance === level
                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Preferred Communication Style</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(['professional', 'casual', 'educational', 'direct'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => setProfile({ ...profile, communicationStyle: style })}
                        className={`py-3 rounded-xl text-sm font-medium border transition-all capitalize ${
                          profile.communicationStyle === style
                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Current Financial Situation</label>
                  <textarea
                    value={profile.currentSituation}
                    onChange={(e) => setProfile({ ...profile, currentSituation: e.target.value })}
                    placeholder="e.g., I have some savings but want to start investing for the long term..."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={!profile.name || !profile.currentSituation || profile.financialGoals.length === 0}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-medium hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
                >
                  Generate My Plan
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'generating' && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 space-y-6"
            >
              <div className="relative">
                <div className="w-24 h-24 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-slate-900 animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">Crafting your personalized strategy...</h3>
                <p className="text-slate-500">Our AI is analyzing thousands of financial options for you.</p>
              </div>
            </motion.div>
          )}

          {step === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto"
                >
                  <CheckCircle2 className="w-8 h-8" />
                </motion.div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-bold text-slate-900">{result.title}</h2>
                  <p className="text-xl text-slate-500 italic">"{result.tagline}"</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                  <section className="bg-white p-8 rounded-3xl border border-slate-100 card-shadow space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                      <Target className="w-5 h-5 text-slate-400" />
                      Executive Summary
                    </h3>
                    <p className="text-slate-600 leading-relaxed">{result.summary}</p>
                  </section>

                  <section className="space-y-6">
                    <h3 className="text-xl font-semibold text-slate-900 px-2">Recommended Services</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {result.recommendedServices.map((service, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-white p-6 rounded-3xl border border-slate-100 card-shadow flex flex-col md:flex-row gap-6 group hover:border-slate-300 transition-colors"
                        >
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <h4 className="text-lg font-bold text-slate-900">{service.name}</h4>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{service.provider}</p>
                              </div>
                              {service.link && (
                                <a 
                                  href={service.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                  <ExternalLink className="w-4 h-4 text-slate-400 hover:text-slate-900 transition-colors" />
                                </a>
                              )}
                            </div>
                            <p className="text-sm text-slate-500">{service.description}</p>
                            <div className="pt-2 flex items-start gap-2">
                              <div className="mt-1 w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                              <p className="text-xs font-medium text-slate-700 italic">
                                <span className="text-slate-400 not-italic">Why it fits: </span>
                                {service.whyItFits}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="space-y-8">
                  <section className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl shadow-slate-200 space-y-6 sticky top-24">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Key Benefits
                    </h3>
                    <ul className="space-y-4">
                      {result.keyBenefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 border-t border-slate-800 space-y-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Top Recommendation</p>
                        <h4 className="text-sm font-bold text-white">{result.topProductRecommendation.name}</h4>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">{result.topProductRecommendation.provider}</p>
                      </div>
                      <a 
                        href={result.topProductRecommendation.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                      >
                        {result.topProductRecommendation.actionLabel}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </section>

                  <div className="space-y-4">
                    <button
                      onClick={() => startChat(true)}
                      className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-semibold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Ask a Question
                    </button>
                    <button
                      onClick={() => setStep('profile')}
                      className="w-full py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCcw className="w-4 h-4" />
                      Refine My Profile
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {step === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white rounded-3xl border border-slate-100 card-shadow overflow-hidden"
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">FinTailor Assistant</h3>
                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Always Online</p>
                  </div>
                </div>
                <button 
                  onClick={() => setStep(result ? 'result' : 'intro')}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Messages */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
              >
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-slate-900 text-white'
                      }`}>
                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-slate-900 text-white rounded-tr-none' 
                          : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask a question about your plan..."
                    className="w-full pl-4 pr-12 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all shadow-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isTyping}
                    className="absolute right-2 p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center">
              <ShieldCheck className="text-white w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-900 text-sm">FinTailor AI</span>
          </div>
          <div className="flex gap-8 text-xs font-medium text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
          </div>
          <p className="text-xs text-slate-400">© 2026 FinTailor AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
