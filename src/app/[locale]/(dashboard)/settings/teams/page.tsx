'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Plus, X, Users, ChevronDown } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Rep {
  id: string;
  name: string;
  teamId: string | null;
}

interface Team {
  id: string;
  name: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const initialTeams: Team[] = [
  { id: 't1', name: 'Équipe Est' },
  { id: 't2', name: 'Équipe Ouest' },
];

const initialReps: Rep[] = [
  { id: 'r1', name: 'Alexandre Gagnon', teamId: 't1' },
  { id: 'r2', name: 'Émilie Roy', teamId: 't1' },
  { id: 'r3', name: 'Thomas Côté', teamId: 't1' },
  { id: 'r4', name: 'David Martin', teamId: 't2' },
  { id: 'r5', name: 'Jessica Pelletier', teamId: 't2' },
  { id: 'r6', name: 'Maxime Bélanger', teamId: null },
  { id: 'r7', name: 'Audrey Leblanc', teamId: null },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TeamsSettingsPage() {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [reps, setReps] = useState<Rep[]>(initialReps);
  const [newTeamName, setNewTeamName] = useState('');
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editingTeamName, setEditingTeamName] = useState('');

  // ------------------------------------------
  // Create team
  // ------------------------------------------
  function handleCreateTeam() {
    if (!newTeamName.trim()) return;
    const team: Team = { id: `t-${Date.now()}`, name: newTeamName.trim() };
    setTeams((prev) => [...prev, team]);
    setNewTeamName('');
  }

  // ------------------------------------------
  // Delete team — unassigns all reps
  // ------------------------------------------
  function handleDeleteTeam(teamId: string) {
    setTeams((prev) => prev.filter((t) => t.id !== teamId));
    setReps((prev) => prev.map((r) => (r.teamId === teamId ? { ...r, teamId: null } : r)));
  }

  // ------------------------------------------
  // Rename team
  // ------------------------------------------
  function handleRenameTeam(teamId: string) {
    if (!editingTeamName.trim()) return;
    setTeams((prev) => prev.map((t) => (t.id === teamId ? { ...t, name: editingTeamName.trim() } : t)));
    setEditingTeamId(null);
    setEditingTeamName('');
  }

  // ------------------------------------------
  // Assign / unassign rep
  // ------------------------------------------
  function handleAssignRep(repId: string, teamId: string | null) {
    setReps((prev) => prev.map((r) => (r.id === repId ? { ...r, teamId } : r)));
  }

  // ------------------------------------------
  // Helpers
  // ------------------------------------------
  function getRepsForTeam(teamId: string) {
    return reps.filter((r) => r.teamId === teamId);
  }

  const unassignedReps = reps.filter((r) => r.teamId === null);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Équipes</h2>
        <p className="text-xs text-text-tertiary">
          Créez des équipes et assignez vos reps.
        </p>
      </div>

      {/* Create team */}
      <Card>
        <CardContent className="p-4">
          <p className="mb-3 text-[13px] font-bold text-text-primary">Nouvelle équipe</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateTeam()}
              placeholder="Nom de l'équipe..."
              className="flex-1 rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-[13px] text-text-primary placeholder-text-muted outline-none focus:border-brand/50"
            />
            <button
              onClick={handleCreateTeam}
              disabled={!newTeamName.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-brand-hover disabled:opacity-40"
            >
              <Plus size={14} />
              Créer
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Teams list */}
      {teams.map((team) => {
        const teamReps = getRepsForTeam(team.id);
        const isEditing = editingTeamId === team.id;

        return (
          <Card key={team.id}>
            <CardContent className="p-4">
              {/* Team header */}
              <div className="flex items-center justify-between">
                {isEditing ? (
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      type="text"
                      value={editingTeamName}
                      onChange={(e) => setEditingTeamName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRenameTeam(team.id)}
                      autoFocus
                      className="flex-1 rounded-lg border border-brand/50 bg-surface-elevated px-3 py-1.5 text-[13px] font-semibold text-text-primary outline-none"
                    />
                    <button
                      onClick={() => handleRenameTeam(team.id)}
                      className="rounded-lg bg-brand px-3 py-1.5 text-[11px] font-semibold text-white"
                    >
                      OK
                    </button>
                    <button
                      onClick={() => setEditingTeamId(null)}
                      className="rounded-lg border border-border-subtle px-3 py-1.5 text-[11px] text-text-muted"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
                      <Users size={15} className="text-brand" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-text-primary">{team.name}</p>
                      <p className="text-[11px] text-text-muted">{teamReps.length} rep{teamReps.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                )}

                {!isEditing && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditingTeamId(team.id); setEditingTeamName(team.name); }}
                      className="rounded-lg px-2.5 py-1 text-[11px] font-medium text-text-muted transition-colors hover:bg-surface-hover hover:text-text-secondary"
                    >
                      Renommer
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team.id)}
                      className="rounded-lg px-2.5 py-1 text-[11px] font-medium text-red-400/60 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>

              {/* Team members */}
              {teamReps.length > 0 && (
                <div className="mt-3 space-y-1">
                  {teamReps.map((rep) => (
                    <div
                      key={rep.id}
                      className="flex items-center justify-between rounded-lg bg-surface-elevated px-3 py-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <Avatar name={rep.name} size="sm" />
                        <span className="text-[13px] font-medium text-text-primary">{rep.name}</span>
                      </div>
                      <button
                        onClick={() => handleAssignRep(rep.id, null)}
                        className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <X size={10} />
                        Retirer
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add rep dropdown */}
              {unassignedReps.length > 0 && (
                <div className="mt-3">
                  <RepAssignDropdown
                    unassignedReps={unassignedReps}
                    onAssign={(repId) => handleAssignRep(repId, team.id)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Unassigned reps */}
      {unassignedReps.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="mb-3 text-[13px] font-bold text-text-primary">
              Reps non assignés
              <span className="ml-1.5 text-[11px] font-normal text-text-muted">({unassignedReps.length})</span>
            </p>
            <div className="space-y-1">
              {unassignedReps.map((rep) => (
                <div
                  key={rep.id}
                  className="flex items-center justify-between rounded-lg bg-surface-elevated px-3 py-2"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar name={rep.name} size="sm" />
                    <span className="text-[13px] font-medium text-text-primary">{rep.name}</span>
                  </div>
                  {teams.length > 0 && (
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) handleAssignRep(rep.id, e.target.value);
                      }}
                      className="rounded-lg border border-border-subtle bg-surface px-2 py-1 text-[11px] text-text-secondary outline-none"
                    >
                      <option value="">Assigner à...</option>
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {teams.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-subtle py-12 text-center">
          <Users size={32} className="text-text-muted/30" />
          <p className="mt-3 text-[13px] font-medium text-text-secondary">Aucune équipe</p>
          <p className="mt-0.5 text-[11px] text-text-muted">Créez votre première équipe ci-dessus.</p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rep assign dropdown — small inline component
// ---------------------------------------------------------------------------

function RepAssignDropdown({
  unassignedReps,
  onAssign,
}: {
  unassignedReps: Rep[];
  onAssign: (repId: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-dashed border-border-subtle px-3 py-1.5 text-[11px] font-medium text-text-muted transition-colors hover:border-brand/30 hover:text-brand"
      >
        <Plus size={12} />
        Ajouter un rep
        <ChevronDown size={10} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded-lg border border-border-subtle bg-surface-elevated py-1 shadow-lg">
          {unassignedReps.map((rep) => (
            <button
              key={rep.id}
              onClick={() => { onAssign(rep.id); setOpen(false); }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[12px] text-text-secondary transition-colors hover:bg-surface-hover"
            >
              <Avatar name={rep.name} size="sm" />
              {rep.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
