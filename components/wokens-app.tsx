'use client'

import { useState, useEffect, useCallback } from 'react'
import { Menu, X, Users, Wallet, Droplets, Home, Compass, TrendingUp, CreditCard, ArrowRight, Mail, Instagram, Twitter, Bell, Eye, EyeOff, ArrowUp, Plus, RefreshCw, FileText, MessageCircle, Headphones } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import Image from 'next/image'

interface Droplet {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: 'small' | 'medium' | 'large' | 'time';
  value: number;
}

export function WokensApp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [activeQuestTab, setActiveQuestTab] = useState('invite')
  const [email, setEmail] = useState('')
  const [isBalanceHidden, setIsBalanceHidden] = useState(true)
  const [activePool, setActivePool] = useState('running')
  const [selectedCask, setSelectedCask] = useState(null)
  const [userWokens, setUserWokens] = useState(50000)
  const [userWokensPoints, setUserWokensPoints] = useState(1000)
  const [userTickets, setUserTickets] = useState(10)
  const [isGameActive, setIsGameActive] = useState(false)
  const [droplets, setDroplets] = useState<Droplet[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isFrozen, setIsFrozen] = useState(false)
  const [popAnimations, setPopAnimations] = useState<{id: number, x: number, y: number, value: number | string}[]>([])
  const [speedMultiplier, setSpeedMultiplier] = useState(0.02)

  const navItems = [
    { name: 'home', icon: Home },
    { name: 'quest', icon: Compass },
    { name: 'game', icon: Droplets },
    { name: 'investment', icon: TrendingUp },
    { name: 'card', icon: CreditCard }
  ]

  const pools = {
    upcoming: [
      { name: "Macallan Rare Cask", apy: 26, progress: 0, minStake: 10000 },
      { name: "Yamazaki 18 Years", apy: 25, progress: 0, minStake: 15000 },
    ],
    running: [
      { name: "Lagavulin Special Malt", apy: 23, progress: 75, minStake: 5000 },
      { name: "Martin Wayne's Purist", apy: 24, progress: 50, minStake: 7500 },
      { name: "Highland Park 18 Years", apy: 24, progress: 25, minStake: 6000 },
    ],
    ended: [
      { name: "Glenfiddich 21 Year", apy: 22, progress: 100, minStake: 0 },
      { name: "Balvenie DoubleWood", apy: 21, progress: 100, minStake: 0 },
    ],
  }

  const assets = [
    { name: 'USDT', amount: 500.00 },
    { name: 'USDC', amount: 750.50 },
    { name: 'WOKENS', amount: 10000 },
    { name: 'BTC', amount: 0.05 },
    { name: 'ETH', amount: 1.2 },
    { name: 'SOL', amount: 25 },
  ]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = Math.round((clientX / window.innerWidth) * 100);
      const y = Math.round((clientY / window.innerHeight) * 100);
      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const createDroplet = useCallback(() => {
    const sizes = ['small', 'medium', 'large', 'time'] as const
    const size = sizes[Math.floor(Math.random() * (sizes.length - 1))]
    const value = size === 'small' ? 3 : size === 'medium' ? 2 : size === 'large' ? 1 : 0
    return {
      id: Math.random(),
      x: Math.random() * 100,
      y: -10,
      speed: Math.random() * 2 + 1,
      size,
      value
    }
  }, [])

  const createTimeDroplet = useCallback(() => {
    return {
      id: Math.random(),
      x: Math.random() * 100,
      y: -10,
      speed: 1,
      size: 'time' as const,
      value: 0
    }
  }, [])

  useEffect(() => {
    if (isGameActive && !isFrozen) {
      const gameLoop = setInterval(() => {
        setDroplets(prevDroplets => {
          const updatedDroplets = prevDroplets.map(d => ({
            ...d,
            y: d.y + d.speed * 6 * speedMultiplier
          })).filter(d => d.y < 110)

          while (updatedDroplets.length < 10) {
            updatedDroplets.push(createDroplet())
          }

          return updatedDroplets
        })
      }, 16)

      const timeDropletInterval = setInterval(() => {
        if (Math.random() < 0.1) {
          setDroplets(prevDroplets => [...prevDroplets, createTimeDroplet()])
        }
      }, 2000)

      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(gameLoop)
            clearInterval(timeDropletInterval)
            clearInterval(timer)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)

      return () => {
        clearInterval(gameLoop)
        clearInterval(timeDropletInterval)
        clearInterval(timer)
      }
    }
  }, [isGameActive, isFrozen, createDroplet, createTimeDroplet, speedMultiplier])

  const handleDropletClick = (droplet: Droplet) => {
    if (droplet.size === 'time') {
      setIsFrozen(true)
      setTimeout(() => setIsFrozen(false), 3000)
      setPopAnimations(prevAnims => [...prevAnims, {id: droplet.id, x: droplet.x, y: droplet.y, value: 'FREEZE!'}])
    } else {
      setScore(prevScore => prevScore + droplet.value)
      setPopAnimations(prevAnims => [...prevAnims, {id: droplet.id, x: droplet.x, y: droplet.y, value: droplet.value}])
    }
    setDroplets(prevDroplets => prevDroplets.filter(d => d.id !== droplet.id))
    setTimeout(() => {
      setPopAnimations(prevAnims => prevAnims.filter(a => a.id !== droplet.id))
    }, 1000)
  }

  const startGame = () => {
    if (userTickets > 0) {
      setIsGameActive(true)
      setUserTickets(prevTickets => prevTickets - 1)
      setTimeLeft(30)
      setScore(0)
      setDroplets([])
      setPopAnimations([])
      setSpeedMultiplier(0.02)
    }
  }

  const endGame = () => {
    setIsGameActive(false)
    setUserWokensPoints(prevPoints => prevPoints + score)
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white relative overflow-hidden font-['Faunces']">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#FFD700] opacity-5"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, #FFD700 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          opacity: 0.1
        }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center">
          <Image 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wokens-o68rFzxYkoGd5jII8GYSHBC7gnbGOh.png" 
            alt="Wokens Logo" 
            width={40} 
            height={40} 
            className="mr-2"
          />
          <h1 className="text-2xl font-thin tracking-wider text-[#df6a29]">WOKENS</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="text-[#df6a29] w-6 h-6" /> : <Menu className="text-[#df6a29] w-6 h-6" />}
        </Button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-y-auto p-4">
        {activeTab === 'home' && (
          <div className="space-y-16">
            {/* Hero Section */}
            <section className="text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#df6a29]">RISE WITH WOKENS</h1>
              <p className="text-xl md:text-2xl mb-4 text-[#df6a29]">PURE UTILITY TOKEN BACKED BY REAL-WORLD ASSETS</p>
              <p className="text-lg md:text-xl mb-8 text-white">DISTILL YOUR WEALTH - JOIN THE PUREST WHISKY INVESTMENT</p>
            </section>

            {/* Key Features */}
            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-center mb-8 text-[#df6a29]">KEY FEATURES</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#df6a29]/30 backdrop-blur-sm rounded-lg p-6 border border-[#df6a29]/20">
                  <h3 className="text-2xl font-semibold mb-4 text-[#df6a29]">Whisky Investment Opportunities</h3>
                  <ul className="space-y-4 text-white">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 bg-[#df6a29] rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span><strong className="text-[#df6a29]">Real-World Assets:</strong> Invest in tangible whisky casks, securing your spot in the world of whisky investments with guaranteed authenticity.</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 bg-[#df6a29] rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span><strong className="text-[#df6a29]">High ROI Potential:</strong> Benefit from the appreciation of aged  whisky, a historically strong-performing asset class.</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 bg-[#df6a29] rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span><strong className="text-[#df6a29]">Global Community:</strong> Join a network of investors who share a passion for quality and transparency.</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-[#df6a29]/30 backdrop-blur-sm rounded-lg p-6 border border-[#df6a29]/20">
                  <h3 className="text-2xl font-semibold mb-4 text-[#df6a29]">DCASKS Crypto Card</h3>
                  <div className="mb-4">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/card%20images-w0aPvmaghmwiPDqtcb8RqsO2afR7kn.png"
                      alt="DCASKS Crypto Cards"
                      width={600}
                      height={200}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                  <ul className="space-y-4 text-white">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 bg-[#df6a29] rounde d-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span><strong className="text-[#df6a29]">Global Spending:</strong> Use your crypto seamlessly at over 1 million merchants worldwide, just like a regular debit card.</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 bg-[#df6a29] rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span><strong className="text-[#df6a29]">Exclusive Access:</strong> Gain entry to exclusive whisky tastings, private events, and raffles for luxury items.</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 bg-[#df6a29] rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span><strong className="text-[#df6a29]">Unique Privileges:</strong> The DCASKS Crypto Card also acts as your membership card, offering unique experiences and privileges reserved for our community.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Team Section */}
            <section>
              <h2 className="text-3xl font-bold text-center mb-8 text-[#df6a29]">Our Team</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {[
                  { name: 'MENG', role: 'Founder' },
                  { name: 'SAM', role: 'Co-Founder' },
                  { name: 'DAVID NGUYEN', role: 'Blockchain Developer' },
                  { name: 'BABAHAJIM', role: 'Growth Tactician' },
                  { name: 'RORA AKIRA', role: 'Chief Designer' },
                  { name: 'MARCUS HOANG', role: 'Product Manager' }
                ].map((member) => (
                  <div key={member.name} className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-[#df6a29]/20 rounded-full flex items-center justify-center">
                      <span className="text-3xl text-[#df6a29]">{member.name[0]}</span>
                    </div>
                    <h3 className="font-semibold text-[#df6a29]">{member.name}</h3>
                    <p className="text-sm text-white">{member.role}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Newsletter Signup */}
            <section className="bg-[#df6a29]/30 backdrop-blur-sm rounded-lg p-8 border border-[#df6a29]/20">
              <h2 className="text-3xl font-bold mb-4 text-center text-[#df6a29]">NEVER MISS A DROP!</h2>
              <p className="mb-6 text-center text-white">SIGN UP AND STAY INFORMED</p>
              <p className="mb-6 text-center text-white">Stay ahead in the whisky investment world. Subscribe now to receive weekly updates on investment opportunities and the latest news from WOKENS.</p>
              <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#df6a29]/10 border-[#df6a29]/20 text-white flex-grow"
                />
                <Button className="bg-[#df6a29] text-white hover:bg-[#c55b23] whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
            </section>

            {/* Community Section */}
            <section className="text-center">
              <h2 className="text-3xl font-bold mb-4 text-[#df6a29]">JOIN OUR COMMUNITY</h2>
              <p className="mb-8 text-white">STEP UP YOUR WHISKY REVOLUTION TOGETHER</p>
              <p className="mb-8 text-white">Connect with us on our social media channels to be part of the WOKENS journey:</p>
              <div className="flex justify-center gap-6">
                <Button className="bg-[#df6a29] hover:bg-[#c55b23] text-white">
                  <Twitter className="mr-2 h-4 w-4" /> Twitter
                </Button>
                <Button className="bg-[#df6a29] hover:bg-[#c55b23] text-white">
                  <MessageCircle className="mr-2 h-4 w-4" /> Telegram
                </Button>
                <Button className="bg-[#df6a29] hover:bg-[#c55b23] text-white">
                  <Headphones className="mr-2 h-4 w-4" /> Discord
                </Button>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'quest' && (
          <div className="space-y-6">
            <div className="flex justify-center mb-4">
              <Button
                className={`mr-2 ${activeQuestTab === 'invite' ? 'bg-[#df6a29] text-white' : 'bg-[#df6a29]/20 text-white'}`}
                onClick={() => setActiveQuestTab('invite')}
              >
                Invitation
              </Button>
              <Button
                className={`${activeQuestTab === 'task' ? 'bg-[#df6a29] text-white' : 'bg-[#df6a29]/20 text-white'}`}
                onClick={() => setActiveQuestTab('task')}
              >
                Task
              </Button>
            </div>
            
            {activeQuestTab === 'invite' && (
              <div>
                <div className="text-center mb-6">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-D2oZQXCPNYBgtUHI3hCeqF3y7M13KH.png"
                    alt="Cute Dragon"
                    width={240}
                    height={240}
                    className="mx-auto mb-4"
                  />
                  <h2 className="text-3xl font-bold mb-2 text-[#df6a29]">Invite friends. Earn WokensPoints</h2>
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-[#df6a29]">How it works</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-[#df6a29] mr-4 mt-1"></div>
                    <div>
                      <h4 className="font-bold mb-1 text-[#df6a29]">Share your invitation link</h4>
                      <p className="text-white">Get a 🎟️ play pass for each friend</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-[#df6a29] mr-4 mt-1"></div>
                    <div>
                      <h4 className="font-bold mb-1 text-[#df6a29]">Your friends join Wokens</h4>
                      <p className="text-white">And start farming WokensPoints</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-[#df6a29] mr-4 mt-1"></div>
                    <div>
                      <h4 className="font-bold mb-1 text-[#df6a29]">Score 10% from buddies</h4>
                      <p className="text-white">Plus an extra 2.5% from their referrals</p>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-6 bg-[#df6a29] text-white hover:bg-[#c55b23]">
                  Invite a friend
                </Button>
              </div>
            )}
            
            {activeQuestTab === 'task' && (
              <div>
                <h2 className="text-3xl font-bold mb-2 text-[#df6a29]">Wokens socials 13</h2>
                <p className="mb-6 text-white">Join Wokens community, be aware of new and following updates, find your tribe in Wokens</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Instagram className="mr-2 text-[#df6a29]" />
                      <div>
                        <p className="font-semibold text-[#df6a29]">Follow Wokens CEO on IG</p>
                        <p className="text-sm text-white">+90 WP</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-[#df6a29] text-[#df6a29]">Start</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Instagram className="mr-2 text-[#df6a29]" />
                      <div>
                        <p className="font-semibold text-[#df6a29]">Follow Wokens CMO on IG</p>
                        <p className="text-sm text-white">+90 WP</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-[#df6a29] text-[#df6a29]">Start</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Instagram className="mr-2 text-[#df6a29]" />
                      <div>
                        <p className="font-semibold text-[#df6a29]">Follow VP of Design on IG</p>
                        <p className="text-sm text-white">+90 WP</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-[#df6a29] text-[#df6a29]">Start</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Droplets className="mr-2 text-[#df6a29]" />
                      <div>
                        <p className="font-semibold text-[#df6a29]">Boost Wokens</p>
                        <p className="text-sm text-white">+200 WP</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-[#df6a29] text-[#df6a29]">Start</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Instagram className="mr-2 text-[#df6a29]" />
                      <div>
                        <p className="font-semibold text-[#df6a29]">Join Wokens&apos;s Instagram</p>
                        <p className="text-sm text-white">+90 WP</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-[#df6a29] text-[#df6a29]">Start</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Twitter className="mr-2 text-[#df6a29]" />
                      <div>
                        <p className="font-semibold text-[#df6a29]">Follow Wokens on X</p>
                        <p className="text-sm text-white">+90 WP</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-[#df6a29] text-[#df6a29]">Start</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'game' && (
          <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
            {!isGameActive ? (
              <div className="p-4 w-full max-w-md">
                <div className="bg-[#df6a29]/10 rounded-lg p-8 text-center mb-8">
                  <h3 className="text-xl font-semibold mb-2 text-[#df6a29]">Total WokensPoints</h3>
                  <p className="text-4xl font-bold text-white">{userWokensPoints} WP</p>
                </div>
                
                <div className="aspect-square w-48 h-48 bg-[#df6a29]/10 rounded-lg flex items-center justify-center mb-8 mx-auto">
                  <Droplets className="w-24 h-24 text-[#df6a29]" />
                </div>
                
                <Button 
                  className="w-full bg-[#df6a29] text-white hover:bg-[#c55b23] mb-4"
                  onClick={startGame}
                  disabled={userTickets === 0}
                >
                  Start Droplet Game ({userTickets} 🎟️)
                </Button>
                
                <p className="text-sm text-[#df6a29] text-center">
                  {userTickets === 0 ? "No more tickets! Complete quests to earn more." : `You have ${userTickets} ticket${userTickets !== 1 ? 's' : ''} remaining.`}
                </p>
              </div>
            ) : (
              <div className="w-full h-screen bg-black relative overflow-hidden">
                <div className="absolute top-4 left-4 bg-[#df6a29]/20 text-[#df6a29] px-3 py-1 rounded-full font-mono text-xl z-10">
                  {String(timeLeft).padStart(2, '0')}s
                </div>
                <div className="absolute top-4 right-4 bg-[#df6a29]/20 text-[#df6a29] px-3 py-1 rounded-full font-mono text-xl z-10">
                  {score} WP
                </div>
                {droplets.map(droplet => (
                  <div
                    key={droplet.id}
                    className={`absolute cursor-pointer ${
                      droplet.size === 'small' ? 'w-10 h-10' :
                      droplet.size === 'medium' ? 'w-12 h-12' :
                      droplet.size === 'large' ? 'w-16 h-16' :
                      'w-12 h-12'
                    } ${isFrozen ? 'opacity-50' : ''}`}
                    style={{
                      left: `${droplet.x}%`,
                      top: `${droplet.y}%`,
                    }}
                    onClick={() => handleDropletClick(droplet)}
                  >
                    {droplet.size === 'time' ? (
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/time%20freeze-gQktjTuJbiaaTNUHiujl2vTs6IqHIB.png"
                        alt="Time Freeze"
                        width={48}
                        height={48}
                        className="w-full h-full"
                      />
                    ) : (
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/droplet-1JkrT4x1KOki0mRODSVVQzwKDUoKjE.png"
                        alt="Droplet"
                        width={64}
                        height={64}
                        className="w-full h-full"
                      />
                    )}
                  </div>
                ))}
                {popAnimations.map(anim => (
                  <div
                    key={anim.id}
                    className="absolute text-white font-bold animate-bounce z-20"
                    style={{left: `${anim.x}%`, top: `${anim.y}%`}}
                  >
                    +{anim.value}
                  </div>
                ))}
                {timeLeft === 0 && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center flex-col z-30">
                    <h2 className="text-4xl font-bold text-[#df6a29] mb-4">Game Over!</h2>
                    <p className="text-2xl text-white mb-4">You collected {score} WP</p>
                    <Button
                      className="bg-[#df6a29] text-white hover:bg-[#c55b23]"
                      onClick={endGame}
                    >
                      Done
                    </Button>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4 bg-[#df6a29]/20 p-4 rounded-lg z-10">
                  <p className="text-white mb-2">Droplet Speed: {Math.round(speedMultiplier * 1000) / 10}%</p>
                  <Slider
                    value={[speedMultiplier]}
                    onValueChange={(value) => setSpeedMultiplier(value[0])}
                    min={0.001}
                    max={1}
                    step={0.001}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'investment' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#df6a29] mb-4">WOKENS Staking</h2>
            <p className="text-xl mb-6">Invest in premium whisky and earn rewards</p>
            
            <div className="bg-[#df6a29]/10 rounded-lg p-4 mb-8 flex items-center justify-between">
              <div className="flex items-center">
                <Wallet className="text-[#df6a29] mr-2" />
                <span className="font-bold">Your $WOKENS:</span>
              </div>
              <span className="text-2xl font-bold text-[#df6a29]">{userWokens.toLocaleString()}</span>
            </div>

            <nav className="flex justify-center mb-8 bg-[#df6a29]/10 rounded-lg p-2">
              {['upcoming', 'running', 'ended'].map((pool) => (
                <Button
                  key={pool}
                  className={`mx-2 ${
                    activePool === pool ? 'bg-[#df6a29] text-white' : 'bg-transparent text-[#df6a29]'
                  }`}
                  onClick={() => {
                    setActivePool(pool)
                    setSelectedCask(null)
                  }}
                >
                  {pool.charAt(0).toUpperCase() + pool.slice(1)}
                </Button>
              ))}
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pools[activePool].map((c, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${
                    selectedCask === index
                      ? 'from-[#df6a29] to-[#df6a29]/70'
                      : 'from-[#df6a29]/20 to-[#df6a29]/5'
                  } rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[#df6a29]/30`}
                >
                  <h3 className="text-xl font-bold mb-2">{c.name}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm">APY: {c.apy}%</span>
                    <span className="text-sm">Progress: {c.progress}%</span>
                  </div>
                  <Progress value={c.progress} className="h-2 mb-4" />
                  {activePool !== 'ended' && (
                    <p className="text-sm mb-4">Min. Stake: {c.minStake.toLocaleString()} $WOKENS</p>
                  )}
                  {selectedCask === index ? (
                    <>
                      <div className="mt-4">
                        <p className="text-sm mb-2">Estimated earnings: {c.apy * 10} $WOKENS per 1,000 staked</p>
                        <Progress value={c.progress} className="h-2 mb-1" />
                        <div className="flex justify-between text-xs mb-4">
                          <span>0 $WOKENS</span>
                          <span>1,000,000 $WOKENS</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full bg-white text-black hover:bg-[#c55b23] hover:text-white mt-2"
                        disabled={activePool === 'ended' || userWokens < c.minStake}
                      >
                        {activePool === 'upcoming' ? 'Join Waitlist' : activePool === 'running' ? 'Stake $WOKENS' : 'Staking Ended'}
                      </Button>
                      {userWokens < c.minStake && activePool !== 'ended' && (
                        <p className="text-xs text-red-500 mt-2">
                          You need {(c.minStake - userWokens).toLocaleString()} more $WOKENS to join this pool
                        </p>
                      )}
                      <Button
                        className="w-full mt-2 bg-transparent border border-white text-white hover:bg-white hover:text-black"
                        onClick={() => setSelectedCask(null)}
                      >
                        <X className="mr-2 h-4 w-4" /> Close Details
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="w-full bg-white text-black hover:bg-[#df6a29] hover:text-white transition-colors"
                      onClick={() => setSelectedCask(index)}
                    >
                      View Details
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'card' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#df6a29]">DCASKS CRYPTO CARD</h2>
              <Bell className="text-[#df6a29]" />
            </div>

            <div className="w-full h-48 relative mb-6">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WOKENS%20TWITTER%20CONTENT-dIcX1ZT6I5goFgntH547XQE4zLsrJ1.png"
                alt="DCASKS Gold Card"
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>

            <div className="space-y-6">
              <div className="bg-[#df6a29]/10 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[#df6a29] font-bold">USD</span>
                  <button onClick={() => setIsBalanceHidden(!isBalanceHidden)}>
                    {isBalanceHidden ? <EyeOff className="text-[#df6a29]" /> : <Eye className="text-[#df6a29]" />}
                  </button>
                </div>
                <h3 className="text-xl font-bold text-[#df6a29] mb-2">Total Balance</h3>
                <p className="text-3xl font-bold text-white mb-6">
                  {isBalanceHidden ? '$ *****' : '$ 123.40'}
                </p>
                <div className="flex justify-between text-white mb-6">
                  <button className="flex flex-col items-center">
                    <ArrowUp className="mb-1" />
                    <span>Send</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <Plus className="mb-1" />
                    <span>Add Crypto</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <RefreshCw className="mb-1" />
                    <span>SWAP</span>
                  </button>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-[#df6a29] mb-2">Your Assets</h4>
                  {assets.map((asset, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-white">{asset.name}</span>
                      <span className="text-[#df6a29] font-semibold">{asset.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-full bg-[#df6a29] text-white hover:bg-[#c55b23] flex items-center justify-center">
                <FileText className="mr-2" />
                Transaction History
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="relative z-10 bg-black/50 backdrop-blur-sm p-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <motion.div
              key={item.name}
              className="relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={activeTab === item.name ? 'secondary' : 'ghost'}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.name 
                    ? 'bg-[#df6a29] text-white shadow-lg shadow-[#df6a29]/50' 
                    : 'text-[#df6a29] hover:bg-[#df6a29]/20'
                }`}
                onClick={() => setActiveTab(item.name)}
              >
                <item.icon className={`w-6 h-6 mb-1 ${activeTab === item.name ? 'animate-pulse' : ''}`} />
                <span className="text-[8px] leading-none font-semibold">{item.name}</span>
              </Button>
              {activeTab === item.name && (
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-[#df6a29]"
                  layoutId="activeTab"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </nav>
    </div>
  )
}