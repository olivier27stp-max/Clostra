'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { getRepAvatar } from '@/lib/constants/avatars';
import { cn } from '@/lib/utils/cn';
import {
  Send,
  Search,
  Plus,
  ImageIcon,
  Phone,
  Video,
  Users,
  X,
  Check,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Stacked avatars for groups
// ---------------------------------------------------------------------------

function StackedAvatars({ memberIds, max = 3, size = 'sm' }: { memberIds: string[]; max?: number; size?: 'sm' | 'md' }) {
  const shown = memberIds.slice(0, max);
  const extra = memberIds.length - max;
  const px = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8';
  const offset = size === 'sm' ? 'ml-[-8px]' : 'ml-[-10px]';
  const textSize = size === 'sm' ? 'text-[8px]' : 'text-[9px]';

  return (
    <div className="flex items-center">
      {shown.map((id, i) => {
        const contact = allContacts.find((c) => c.id === id);
        if (!contact) return null;
        return (
          <div key={id} className={cn(i > 0 && offset)} style={{ zIndex: shown.length - i }}>
            <Avatar
              name={contact.name}
              src={getRepAvatar(contact.name)}
              size={size}
              className={cn(px, 'ring-2 ring-white')}
            />
          </div>
        );
      })}
      {extra > 0 && (
        <div
          className={cn(
            offset,
            px,
            textSize,
            'flex items-center justify-center rounded-full bg-surface-elevated text-text-muted font-medium ring-2 ring-white',
          )}
          style={{ zIndex: 0 }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const allContacts = [
  { id: 'c1', name: 'Sarah Chen', online: true },
  { id: 'c2', name: 'Marcus Davis', online: true },
  { id: 'c3', name: 'Emily Rodriguez', online: false },
  { id: 'c4', name: 'Jordan Kim', online: true },
  { id: 'c5', name: 'Alex Martin', online: true },
];

const initialConversations = [
  { id: '1', name: 'Sarah Chen', lastMessage: 'Got it, I will follow up tomorrow morning.', time: '2m', unread: 2, online: true, isGroup: false, members: ['c1'] },
  { id: '2', name: 'Alpha Squad', lastMessage: 'Marcus: Great work today team!', time: '15m', unread: 0, online: false, isGroup: true, members: ['c1', 'c2', 'c3'] },
  { id: '3', name: 'Marcus Davis', lastMessage: 'Can you send me the quote template?', time: '1h', unread: 1, online: true, isGroup: false, members: ['c2'] },
  { id: '4', name: 'Emily Rodriguez', lastMessage: 'The Patel demo went really well.', time: '3h', unread: 0, online: false, isGroup: false, members: ['c3'] },
  { id: '5', name: 'Jordan Kim', lastMessage: 'Heading to Sunset Valley now.', time: '5h', unread: 0, online: true, isGroup: false, members: ['c4'] },
];

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  time: string;
  isOwn: boolean;
  image?: string;
}

const chatMessagesData: Record<string, ChatMessage[]> = {
  '1': [
    { id: '1', sender: 'Sarah Chen', content: 'Hey! Just finished the demo at the Johnson residence.', time: '10:42 AM', isOwn: false },
    { id: '2', sender: 'You', content: 'Nice! How did it go?', time: '10:43 AM', isOwn: true },
    { id: '3', sender: 'Sarah Chen', content: 'Really well! They loved the ROI breakdown. I think we can close at $4,200.', time: '10:45 AM', isOwn: false },
    { id: '4', sender: 'You', content: 'Great news. Send the quote today while they are still excited.', time: '10:46 AM', isOwn: true },
    { id: '5', sender: 'Sarah Chen', content: 'Already on it. Sending within the hour.', time: '10:47 AM', isOwn: false },
    { id: '6', sender: 'You', content: 'Perfect. Keep the momentum going!', time: '10:48 AM', isOwn: true },
    { id: '7', sender: 'Sarah Chen', content: 'Got it, I will follow up tomorrow morning.', time: '10:50 AM', isOwn: false },
  ],
  '2': [
    { id: '1', sender: 'Marcus Davis', content: 'Great work today team!', time: '9:30 AM', isOwn: false },
    { id: '2', sender: 'Sarah Chen', content: 'Thanks! The new territory is really paying off.', time: '9:35 AM', isOwn: false },
    { id: '3', sender: 'You', content: 'Keep it up everyone. Let\'s hit our targets this week.', time: '9:40 AM', isOwn: true },
  ],
  '3': [
    { id: '1', sender: 'Marcus Davis', content: 'Hey, can you send me the quote template?', time: '2:00 PM', isOwn: false },
  ],
  '4': [
    { id: '1', sender: 'Emily Rodriguez', content: 'The Patel demo went really well.', time: '11:00 AM', isOwn: false },
    { id: '2', sender: 'You', content: 'Awesome! What was their main concern?', time: '11:05 AM', isOwn: true },
  ],
  '5': [
    { id: '1', sender: 'Jordan Kim', content: 'Heading to Sunset Valley now.', time: '8:00 AM', isOwn: false },
  ],
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function FeedPage() {
  const t = useTranslations('nav');
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConvo, setSelectedConvo] = useState('1');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Edit group name
  const [editingGroupName, setEditingGroupName] = useState(false);
  const [editGroupNameValue, setEditGroupNameValue] = useState('');

  function startEditGroupName() {
    if (!selectedConversation?.isGroup) return;
    setEditGroupNameValue(selectedConversation.name);
    setEditingGroupName(true);
  }

  function saveGroupName() {
    if (!editGroupNameValue.trim()) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === selectedConvo ? { ...c, name: editGroupNameValue.trim() } : c)),
    );
    setEditingGroupName(false);
  }

  // Create group modal
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [memberSearch, setMemberSearch] = useState('');

  // Chat messages state (moved from static object to reactive state)
  const [allMessages, setAllMessages] = useState(chatMessagesData);
  const [notifications, setNotifications] = useState<{ id: string; sender: string; content: string; convoId: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const selectedConversation = conversations.find((c) => c.id === selectedConvo);
  const chatMessages = allMessages[selectedConvo] || [];

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length]);

  // Dismiss notification after 4s
  useEffect(() => {
    if (notifications.length === 0) return;
    const timer = setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 4000);
    return () => clearTimeout(timer);
  }, [notifications]);

  // Auto-replies
  const autoReplies: Record<string, string[]> = {
    'Sarah Chen': [
      'Parfait, je m\'en occupe!',
      'Bonne idée, je vais voir ça.',
      'Super, merci pour l\'info!',
      'Je suis dessus, je te tiens au courant.',
      'Ok! J\'ai un rendez-vous dans 30 min, on en reparle après?',
    ],
    'Marcus Davis': [
      'Reçu! Je fais le suivi maintenant.',
      'Merci chef, je m\'y mets.',
      'Nickel, je te reviens là-dessus.',
      'C\'est noté, je bouge.',
    ],
    'Emily Rodriguez': [
      'Super, je note ça.',
      'Ok je vais checker tout de suite!',
      'Merci! Le prospect était vraiment intéressé.',
      'Je t\'envoie les détails par email aussi.',
    ],
    'Jordan Kim': [
      'Compris! Je suis en route.',
      'Parfait, je fais le point ce soir.',
      'Noté, merci!',
    ],
  };

  function getAutoReply(convoId: string): { sender: string; content: string } | null {
    const convo = conversations.find((c) => c.id === convoId);
    if (!convo) return null;
    if (convo.isGroup) {
      // Pick a random member to reply in group
      const memberId = convo.members[Math.floor(Math.random() * convo.members.length)];
      const contact = allContacts.find((c) => c.id === memberId);
      if (!contact) return null;
      const replies = autoReplies[contact.name] || ['Ok!'];
      return { sender: contact.name, content: replies[Math.floor(Math.random() * replies.length)] };
    }
    const replies = autoReplies[convo.name] || ['Ok!'];
    return { sender: convo.name, content: replies[Math.floor(Math.random() * replies.length)] };
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  }

  function sendMessage() {
    if ((!messageInput.trim() && !imagePreview) || !selectedConvo) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'You',
      content: messageInput.trim(),
      time: timeStr,
      isOwn: true,
      image: imagePreview || undefined,
    };

    // Add message to chat
    setAllMessages((prev) => ({
      ...prev,
      [selectedConvo]: [...(prev[selectedConvo] || []), newMsg],
    }));

    // Update conversation preview
    const previewText = imagePreview ? (messageInput.trim() || '📷 Photo') : messageInput.trim();
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConvo
          ? { ...c, lastMessage: previewText, time: 'now', unread: 0 }
          : c,
      ),
    );

    setMessageInput('');
    setImagePreview(null);

    // Simulate auto-reply after 1-3s
    const delay = 1000 + Math.random() * 2000;
    setTimeout(() => {
      const reply = getAutoReply(selectedConvo);
      if (!reply) return;

      const replyTime = new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
      const replyMsg = {
        id: crypto.randomUUID(),
        sender: reply.sender,
        content: reply.content,
        time: replyTime,
        isOwn: false,
      };

      setAllMessages((prev) => ({
        ...prev,
        [selectedConvo]: [...(prev[selectedConvo] || []), replyMsg],
      }));

      // Update conversation preview
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConvo
            ? { ...c, lastMessage: `${reply.sender}: ${reply.content}`, time: 'now' }
            : c,
        ),
      );

      // Show notification
      setNotifications((prev) => [
        ...prev,
        { id: crypto.randomUUID(), sender: reply.sender, content: reply.content, convoId: selectedConvo },
      ]);

      // Play notification sound
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRl9vT19teleXRlbXQAAAABAAEARKwAAIhYAQACABAAZGF0YQ==');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch {}
    }, delay);
  }

  function toggleMember(id: string) {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  }

  function createGroup() {
    if (!groupName.trim() || selectedMembers.length < 2) return;
    const newGroup = {
      id: crypto.randomUUID(),
      name: groupName.trim(),
      lastMessage: 'Groupe créé',
      time: 'now',
      unread: 0,
      online: false,
      isGroup: true,
      members: selectedMembers,
    };
    setConversations((prev) => [newGroup, ...prev]);
    chatMessagesData[newGroup.id] = [];
    setSelectedConvo(newGroup.id);
    setShowCreateGroup(false);
    setGroupName('');
    setSelectedMembers([]);
    setMemberSearch('');
  }

  const filteredContacts = allContacts.filter((c) =>
    c.name.toLowerCase().includes(memberSearch.toLowerCase()),
  );

  return (
    <div className="-mx-6 -my-5 flex h-[calc(100vh-3rem)] relative">

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="flex items-center gap-2.5 rounded-lg border border-border-subtle bg-white px-4 py-3 shadow-lg animate-in slide-in-from-right duration-300"
            onClick={() => {
              setSelectedConvo(notif.convoId);
              setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
            }}
            style={{ cursor: 'pointer' }}
          >
            <Avatar name={notif.sender} src={getRepAvatar(notif.sender)} size="sm" className="!h-8 !w-8" />
            <div className="max-w-[220px]">
              <p className="text-[11px] font-semibold text-text-primary">{notif.sender}</p>
              <p className="truncate text-[11px] text-text-muted">{notif.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ================================================================ */}
      {/* LEFT — Conversation list */}
      {/* ================================================================ */}
      <div className="flex w-[300px] shrink-0 flex-col border-r border-border-subtle">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2.5">
          <h2 className="text-[13px] font-semibold text-text-primary">Messages</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setShowCreateGroup(true)}
            title="Créer un groupe"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* Search */}
        <div className="px-3 py-2">
          <div className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-elevated px-2 py-1">
            <Search className="h-3 w-3 text-text-muted" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-[11px] text-text-primary placeholder:text-text-muted outline-none"
            />
          </div>
        </div>

        {/* Conversation items */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((convo) => (
            <button
              key={convo.id}
              onClick={() => {
                setSelectedConvo(convo.id);
                setConversations((prev) => prev.map((c) => c.id === convo.id ? { ...c, unread: 0 } : c));
              }}
              className={cn(
                'flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors',
                selectedConvo === convo.id
                  ? 'bg-surface-elevated'
                  : 'hover:bg-surface-hover',
              )}
            >
              <div className="relative shrink-0">
                {convo.isGroup ? (
                  <StackedAvatars memberIds={convo.members} max={3} size="sm" />
                ) : (
                  <Avatar name={convo.name} src={getRepAvatar(convo.name)} size="sm" />
                )}
                {convo.online && !convo.isGroup && (
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
      </div>

      {/* ================================================================ */}
      {/* RIGHT — Chat */}
      {/* ================================================================ */}
      <div className="flex flex-1 flex-col">
        {/* Chat header */}
        {selectedConversation && (
          <div className="flex items-center justify-between border-b border-border-subtle px-4 py-2.5">
            <div className="flex items-center gap-2.5">
              {selectedConversation.isGroup ? (
                <StackedAvatars memberIds={selectedConversation.members} max={3} size="sm" />
              ) : (
                <Avatar name={selectedConversation.name} src={getRepAvatar(selectedConversation.name)} size="sm" />
              )}
              <div>
                {editingGroupName && selectedConversation.isGroup ? (
                  <input
                    autoFocus
                    value={editGroupNameValue}
                    onChange={(e) => setEditGroupNameValue(e.target.value)}
                    onBlur={saveGroupName}
                    onKeyDown={(e) => { if (e.key === 'Enter') saveGroupName(); if (e.key === 'Escape') setEditingGroupName(false); }}
                    className="w-40 rounded border border-brand bg-transparent px-1 py-0 text-[12px] font-semibold text-text-primary outline-none"
                  />
                ) : (
                  <p
                    className={cn('text-[12px] font-semibold text-text-primary', selectedConversation.isGroup && 'cursor-pointer hover:text-brand transition-colors')}
                    onClick={selectedConversation.isGroup ? startEditGroupName : undefined}
                  >
                    {selectedConversation.name}
                  </p>
                )}
                {selectedConversation.isGroup ? (
                  <p className="text-[10px] text-text-muted">
                    {selectedConversation.members.length} membres
                  </p>
                ) : (
                  <p className={cn('text-[10px]', selectedConversation.online ? 'text-success' : 'text-text-muted')}>
                    {selectedConversation.online ? 'En ligne' : 'Hors ligne'}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!selectedConversation.isGroup && (
                <>
                  <button className="rounded-md p-1.5 text-text-muted hover:bg-surface-hover hover:text-text-secondary">
                    <Phone className="h-3.5 w-3.5" />
                  </button>
                  <button className="rounded-md p-1.5 text-text-muted hover:bg-surface-hover hover:text-text-secondary">
                    <Video className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={cn('flex', msg.isOwn ? 'justify-end' : 'justify-start')}
            >
              <div className={cn('flex max-w-[65%] gap-2', msg.isOwn && 'flex-row-reverse')}>
                {!msg.isOwn && (
                  <Avatar name={msg.sender} src={getRepAvatar(msg.sender)} size="sm" className="!h-6 !w-6 mt-0.5" />
                )}
                <div>
                  {!msg.isOwn && selectedConversation?.isGroup && (
                    <p className="mb-0.5 text-[9px] font-medium text-text-muted">{msg.sender}</p>
                  )}
                  <div
                    className={cn(
                      'rounded-lg',
                      msg.image ? 'overflow-hidden' : 'px-3 py-2',
                      msg.isOwn
                        ? 'bg-brand text-white rounded-br-sm'
                        : 'bg-surface-elevated text-text-primary rounded-bl-sm',
                    )}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Photo"
                        className="max-h-[240px] max-w-full rounded-t-lg object-cover cursor-pointer"
                        onClick={() => window.open(msg.image, '_blank')}
                      />
                    )}
                    {msg.content && (
                      <p className={cn('text-[12px] leading-relaxed', msg.image && 'px-3 py-2')}>{msg.content}</p>
                    )}
                  </div>
                  <p className={cn('mt-0.5 text-[9px] text-text-muted', msg.isOwn ? 'text-right' : 'text-left')}>
                    {msg.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Message input */}
        <div className="border-t border-border-subtle p-3">
          {/* Image preview */}
          {imagePreview && (
            <div className="mb-2 flex items-start gap-2">
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="h-20 w-20 rounded-lg object-cover border border-border-subtle" />
                <button
                  onClick={() => setImagePreview(null)}
                  className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-white text-[8px] shadow"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-md p-1.5 text-text-muted hover:bg-surface-hover hover:text-text-secondary"
              title="Envoyer une photo"
            >
              <ImageIcon className="h-3.5 w-3.5" />
            </button>
            <div className="flex flex-1 items-center rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2">
              <input
                type="text"
                placeholder="Écrire un message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                className="w-full bg-transparent text-[12px] text-text-primary placeholder:text-text-muted outline-none"
              />
            </div>
            <Button size="icon" className="h-8 w-8 rounded-lg" disabled={!messageInput.trim() && !imagePreview} onClick={sendMessage}>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* Create Group Modal */}
      {/* ================================================================ */}
      {showCreateGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowCreateGroup(false)}>
          <div
            className="w-[380px] rounded-xl border border-border-subtle bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-text-primary">Créer un groupe</h3>
              <button onClick={() => setShowCreateGroup(false)} className="rounded-md p-1 text-text-muted hover:bg-surface-hover">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Group name */}
            <div className="mb-3">
              <label className="mb-1 block text-[11px] font-medium text-text-secondary">Nom du groupe</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Ex: Équipe Sunset Valley"
                className="w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-[12px] text-text-primary placeholder:text-text-muted outline-none focus:border-brand"
              />
            </div>

            {/* Selected members */}
            {selectedMembers.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {selectedMembers.map((id) => {
                  const contact = allContacts.find((c) => c.id === id);
                  if (!contact) return null;
                  return (
                    <span
                      key={id}
                      className="flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-medium text-brand"
                    >
                      {contact.name}
                      <button onClick={() => toggleMember(id)} className="hover:text-brand/70">
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Search members */}
            <div className="mb-2">
              <div className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-elevated px-2.5 py-1.5">
                <Search className="h-3 w-3 text-text-muted" />
                <input
                  type="text"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  placeholder="Rechercher un membre..."
                  className="w-full bg-transparent text-[11px] text-text-primary placeholder:text-text-muted outline-none"
                />
              </div>
            </div>

            {/* Contact list */}
            <div className="max-h-[200px] overflow-y-auto rounded-lg border border-border-subtle">
              {filteredContacts.map((contact) => {
                const isSelected = selectedMembers.includes(contact.id);
                return (
                  <button
                    key={contact.id}
                    onClick={() => toggleMember(contact.id)}
                    className={cn(
                      'flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-surface-hover',
                      isSelected && 'bg-brand/5',
                    )}
                  >
                    <Avatar name={contact.name} src={getRepAvatar(contact.name)} size="sm" className="!h-7 !w-7" />
                    <div className="flex-1">
                      <p className="text-[11px] font-medium text-text-primary">{contact.name}</p>
                      <p className={cn('text-[9px]', contact.online ? 'text-success' : 'text-text-muted')}>
                        {contact.online ? 'En ligne' : 'Hors ligne'}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Create button */}
            <Button
              className="mt-4 w-full"
              disabled={!groupName.trim() || selectedMembers.length < 2}
              onClick={createGroup}
            >
              <Users className="mr-1.5 h-3.5 w-3.5" />
              Créer le groupe ({selectedMembers.length} membres)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
