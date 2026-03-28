'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils/cn';
import { Link } from '@/i18n/navigation';
import {
  Send,
  Image,
  MessageCircle,
  Trophy,
  Flame,
  Star,
  ThumbsUp,
  Search,
  Plus,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Feed data
// ---------------------------------------------------------------------------

type FeedFilter = 'company' | 'team';

const feedPosts = [
  {
    id: '1',
    name: 'Sarah Chen',
    team: 'Alpha Squad',
    time: '12 min ago',
    type: 'win',
    content: 'Just closed the Johnson Residence deal! $4,200 in revenue. The demo really sealed it -- always show the ROI breakdown!',
    reactions: { fire: 8, trophy: 3, thumbsup: 12 },
    comments: 4,
    badge: { icon: Trophy, label: 'Close', color: 'text-gold' },
  },
  {
    id: '2',
    name: 'Marcus Davis',
    team: 'Bravo Unit',
    time: '45 min ago',
    type: 'milestone',
    content: 'Hit 200 doors knocked this month! The grind never stops. Who is catching up?',
    reactions: { fire: 15, thumbsup: 8 },
    comments: 6,
    badge: { icon: Flame, label: 'Milestone', color: 'text-bronze' },
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    team: 'Alpha Squad',
    time: '2h ago',
    type: 'badge',
    content: 'Earned the "Rising Star" badge! First month and already in the top 5. Grateful for the team support.',
    reactions: { star: 10, thumbsup: 6, fire: 4 },
    comments: 3,
    badge: { icon: Star, label: 'Badge Earned', color: 'text-brand' },
  },
  {
    id: '4',
    name: 'Alex Martin',
    team: 'Bravo Unit',
    time: '4h ago',
    type: 'manual',
    content: 'Pro tip: when working the Sunset Valley territory, start from the south end. The newer builds have way better conversion rates.',
    reactions: { thumbsup: 22, fire: 5 },
    comments: 8,
  },
];

const reactionEmojis = [
  { key: 'thumbsup', icon: ThumbsUp, label: 'Like' },
  { key: 'fire', icon: Flame, label: 'Fire' },
  { key: 'trophy', icon: Trophy, label: 'Trophy' },
  { key: 'star', icon: Star, label: 'Star' },
];

// ---------------------------------------------------------------------------
// Messages data
// ---------------------------------------------------------------------------

const conversations = [
  { id: '1', name: 'Sarah Chen', lastMessage: 'Got it, I will follow up tomorrow morning.', time: '2m', unread: 2, online: true },
  { id: '2', name: 'Alpha Squad', lastMessage: 'Marcus: Great work today team!', time: '15m', unread: 0, online: false, isGroup: true },
  { id: '3', name: 'Marcus Davis', lastMessage: 'Can you send me the quote template?', time: '1h', unread: 1, online: true },
  { id: '4', name: 'Emily Rodriguez', lastMessage: 'The Patel demo went really well.', time: '3h', unread: 0, online: false },
  { id: '5', name: 'Jordan Kim', lastMessage: 'Heading to Sunset Valley now.', time: '5h', unread: 0, online: true },
];

const chatMessages = [
  { id: '1', sender: 'Sarah Chen', content: 'Hey! Just finished the demo at the Johnson residence.', time: '10:42 AM', isOwn: false },
  { id: '2', sender: 'You', content: 'Nice! How did it go?', time: '10:43 AM', isOwn: true },
  { id: '3', sender: 'Sarah Chen', content: 'Really well! They loved the ROI breakdown. I think we can close at $4,200.', time: '10:45 AM', isOwn: false },
  { id: '4', sender: 'You', content: 'Great news. Send the quote today while they are still excited.', time: '10:46 AM', isOwn: true },
  { id: '5', sender: 'Sarah Chen', content: 'Already on it. Sending within the hour.', time: '10:47 AM', isOwn: false },
  { id: '6', sender: 'You', content: 'Perfect. Keep the momentum going!', time: '10:48 AM', isOwn: true },
  { id: '7', sender: 'Sarah Chen', content: 'Got it, I will follow up tomorrow morning.', time: '10:50 AM', isOwn: false },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function FeedPage() {
  const t = useTranslations('nav');
  const [filter, setFilter] = useState<FeedFilter>('company');
  const [postContent, setPostContent] = useState('');
  const [selectedConvo, setSelectedConvo] = useState('1');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="-mx-6 -my-5 flex h-[calc(100vh-3rem)]">

      {/* ================================================================ */}
      {/* LEFT — Feed */}
      {/* ================================================================ */}
      <div className="flex flex-1 flex-col overflow-y-auto border-r border-border-subtle">
        {/* Feed header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-subtle bg-[#EBEDF0] px-5 py-2.5">
          <h2 className="text-[13px] font-semibold text-text-primary">Feed</h2>
          <div className="flex items-center rounded-md border border-border-subtle">
            {(['company', 'team'] as FeedFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-2.5 py-1 text-[10px] font-medium transition-colors',
                  filter === f
                    ? 'bg-surface-elevated text-text-primary'
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                {f === 'company' ? 'Company' : 'My Team'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-3 p-4">
          {/* Post input */}
          <Card>
            <CardContent className="p-3">
              <div className="flex gap-2.5">
                <Avatar name="Alex Martin" size="sm" />
                <div className="flex-1">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Share a win, tip, or shout-out..."
                    rows={2}
                    className="w-full resize-none bg-transparent text-[12px] text-text-primary placeholder:text-text-muted outline-none"
                  />
                  <div className="mt-1.5 flex items-center justify-between border-t border-border-subtle pt-1.5">
                    <button className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] text-text-muted transition-colors hover:bg-surface-hover hover:text-text-secondary">
                      <Image className="h-3 w-3" />
                      Photo
                    </button>
                    <Button size="sm" className="h-6 gap-1 px-2 text-[10px]" disabled={!postContent.trim()}>
                      <Send className="h-2.5 w-2.5" />
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feed posts */}
          {feedPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-3">
                <div className="flex items-start gap-2.5">
                  <Link href={`/profile/${post.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Avatar name={post.name} size="sm" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Link href={`/profile/${post.name.toLowerCase().replace(/\s+/g, '-')}`} className="text-[12px] font-semibold text-text-primary hover:text-brand transition-colors">
                        {post.name}
                      </Link>
                      {post.badge && (
                        <Badge variant="secondary" className="gap-0.5 text-[9px] px-1 py-0">
                          <post.badge.icon className={cn('h-2 w-2', post.badge.color)} />
                          {post.badge.label}
                        </Badge>
                      )}
                      <span className="text-[10px] text-text-muted">
                        {post.team} -- {post.time}
                      </span>
                    </div>

                    <p className="mt-1.5 text-[12px] leading-relaxed text-text-secondary">
                      {post.content}
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {reactionEmojis.map(({ key, icon: Icon }) => {
                          const count = (post.reactions as unknown as Record<string, number>)[key];
                          if (!count) return null;
                          return (
                            <button
                              key={key}
                              className="flex items-center gap-0.5 rounded-full border border-border-subtle bg-surface-elevated px-1.5 py-0.5 text-[10px] transition-colors hover:border-brand/20 hover:bg-brand/5"
                            >
                              <Icon className="h-2.5 w-2.5 text-text-tertiary" />
                              <span className="font-medium text-text-secondary">{count}</span>
                            </button>
                          );
                        })}
                      </div>
                      <button className="flex items-center gap-1 text-[10px] text-text-muted hover:text-text-secondary">
                        <MessageCircle className="h-2.5 w-2.5" />
                        {post.comments}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ================================================================ */}
      {/* RIGHT — Messages */}
      {/* ================================================================ */}
      <div className="flex w-[340px] shrink-0 flex-col">
        {/* Conversation list */}
        <div className="flex flex-col border-b border-border-subtle">
          <div className="flex items-center justify-between px-3 py-2">
            <h3 className="text-[13px] font-semibold text-text-primary">Messages</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="px-3 pb-2">
            <div className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-elevated px-2 py-1">
              <Search className="h-3 w-3 text-text-muted" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-[11px] text-text-primary placeholder:text-text-muted outline-none"
              />
            </div>
          </div>
        </div>

        {/* Conversation items */}
        <div className="max-h-[180px] overflow-y-auto border-b border-border-subtle">
          {conversations.map((convo) => (
            <button
              key={convo.id}
              onClick={() => setSelectedConvo(convo.id)}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-left transition-colors',
                selectedConvo === convo.id
                  ? 'bg-surface-elevated'
                  : 'hover:bg-surface-hover'
              )}
            >
              <div className="relative shrink-0">
                <Avatar name={convo.name} size="sm" className="!h-6 !w-6" />
                {convo.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white bg-success" />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-text-primary truncate">{convo.name}</p>
                  <span className="shrink-0 text-[9px] text-text-muted">{convo.time}</span>
                </div>
                <p className="truncate text-[10px] text-text-muted">{convo.lastMessage}</p>
              </div>
              {convo.unread > 0 && (
                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand text-[8px] font-bold text-white">
                  {convo.unread}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Chat thread header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2">
          <div className="flex items-center gap-2">
            <Avatar name="Sarah Chen" size="sm" className="!h-6 !w-6" />
            <div>
              <p className="text-[11px] font-medium text-text-primary">Sarah Chen</p>
              <p className="text-[9px] text-success">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button className="rounded-md p-1 text-text-muted hover:bg-surface-hover hover:text-text-secondary">
              <Phone className="h-3 w-3" />
            </button>
            <button className="rounded-md p-1 text-text-muted hover:bg-surface-hover hover:text-text-secondary">
              <Video className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={cn('flex', msg.isOwn ? 'justify-end' : 'justify-start')}
            >
              <div className={cn('flex max-w-[85%] gap-1.5', msg.isOwn && 'flex-row-reverse')}>
                {!msg.isOwn && <Avatar name={msg.sender} size="sm" className="!h-5 !w-5" />}
                <div>
                  <div
                    className={cn(
                      'rounded-lg px-2.5 py-1.5',
                      msg.isOwn
                        ? 'bg-brand text-white rounded-br-sm'
                        : 'bg-surface-elevated text-text-primary rounded-bl-sm'
                    )}
                  >
                    <p className="text-[11px] leading-relaxed">{msg.content}</p>
                  </div>
                  <p className={cn('mt-0.5 text-[9px] text-text-muted', msg.isOwn ? 'text-right' : 'text-left')}>
                    {msg.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="border-t border-border-subtle p-2">
          <div className="flex items-center gap-1.5">
            <button className="rounded-md p-1 text-text-muted hover:bg-surface-hover hover:text-text-secondary">
              <Paperclip className="h-3 w-3" />
            </button>
            <div className="flex flex-1 items-center rounded-lg border border-border-subtle bg-surface-elevated px-2.5 py-1.5">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="w-full bg-transparent text-[11px] text-text-primary placeholder:text-text-muted outline-none"
              />
            </div>
            <Button size="icon" className="h-7 w-7 rounded-lg" disabled={!messageInput.trim()}>
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
