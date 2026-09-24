import React, { useState, useEffect } from 'react';
import { 
  Activity, AlertTriangle, CheckCircle2, Clock, 
  LayoutDashboard, Loader2, PlayCircle, Plus, 
  RefreshCcw, Search, ShieldAlert, Target, Users 
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { 
  useDashboardOverview, useSprintHealth, useTeamWorkload, 
  useVelocity, useRecentActivity, useUpcomingDeadlines, 
  useTraceability, useDefinitionOfDone 
} from '../hooks/useDashboard';
import { useMyOrgs, useProjects, useCreateOrg, useCreateProject } from '../hooks/useProjects';

function SkeletonCard() {
  return (
    <div className="card" style={{ opacity: 0.5, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
      <div style={{ height: '20px', width: '40%', backgroundColor: 'var(--canvas-mid)', marginBottom: '16px', borderRadius: '4px' }} />
      <div style={{ height: '40px', width: '60%', backgroundColor: 'var(--canvas-mid)', borderRadius: '4px' }} />
    </div>
  );
}

export default function Dashboard() {
  const { data: orgs, isLoading: loadingOrgs } = useMyOrgs();
  const currentOrg = orgs?.[0]; // Default to first org for now
  
  const { data: projects, isLoading: loadingProjects } = useProjects(currentOrg?._id);
  const [projectId, setProjectId] = useState<string>('');

  useEffect(() => {
    if (projects && projects.length > 0 && !projectId) {
      setProjectId(projects[0]._id);
    }
  }, [projects, projectId]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const createOrg = useCreateOrg();
  const createProject = useCreateProject();
  const [isCreating, setIsCreating] = useState(false);

  const { data: overview, isLoading: loadingOverview, refetch: refetchOverview } = useDashboardOverview(projectId);
  const { data: sprint, isLoading: loadingSprint, refetch: refetchSprint } = useSprintHealth(projectId);
  const { data: workload, isLoading: loadingWorkload, refetch: refetchWorkload } = useTeamWorkload(projectId);
  const { data: velocity, isLoading: loadingVelocity, refetch: refetchVelocity } = useVelocity(projectId);
  const { data: activity, isLoading: loadingActivity, refetch: refetchActivity } = useRecentActivity(projectId);
  const { data: deadlines, isLoading: loadingDeadlines, refetch: refetchDeadlines } = useUpcomingDeadlines(projectId);
  const { data: traceability, isLoading: loadingTraceability, refetch: refetchTraceability } = useTraceability(projectId);
  const { data: dod, isLoading: loadingDod, refetch: refetchDod } = useDefinitionOfDone(projectId);

  const handleRefresh = async () => {
    if (!projectId) return;
    setIsRefreshing(true);
    await Promise.all([
      refetchOverview(), refetchSprint(), refetchWorkload(), 
      refetchVelocity(), refetchActivity(), refetchDeadlines(), 
      refetchTraceability(), refetchDod()
    ]);
    setIsRefreshing(false);
  };

  const handleCreateProject = async () => {
    try {
      setIsCreating(true);
      let targetOrgId = currentOrg?._id;
      
      // If no org exists, create one first
      if (!targetOrgId) {
        const newOrg = await createOrg.mutateAsync({ name: 'My Organization', slug: `org-${Date.now()}` });
        targetOrgId = newOrg._id;
      }
      
      // Create project
      const newProj = await createProject.mutateAsync({ 
        orgId: targetOrgId, 
        name: `New Project ${Math.floor(Math.random() * 1000)}`, 
        key: `PRJ${Math.floor(Math.random() * 1000)}`, 
        desc: 'A newly created project.' 
      });
      
      setProjectId(newProj._id);
    } catch (err: any) {
      console.error('Failed to create project:', err);
      alert(`Failed to create project: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const hasData = overview?.openTasks > 0 || overview?.activeSprints > 0 || overview?.openIssues > 0 || overview?.completedThisSprint > 0;

  if (loadingOrgs || loadingProjects) {
    return <div style={{ padding: 'var(--spacing-4xl)', display: 'flex', gap: '20px' }}>
      <SkeletonCard /><SkeletonCard /><SkeletonCard />
    </div>;
  }

  // --- EMPTY STATE (No Projects yet) ---
  if (!projects || projects.length === 0) {
    return (
      <div style={{ minHeight: '100vh', padding: 'var(--spacing-4xl)' }}>
        <header style={{ marginBottom: 'var(--spacing-3xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '32px', marginBottom: 'var(--spacing-xs)' }}>Project Command Center</h1>
            <p style={{ color: 'var(--mute)' }}>Welcome to ProjectPulse. Your workspace is ready.</p>
          </div>
        </header>
        
        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-4xl)' }}>
          <LayoutDashboard size={48} style={{ color: 'var(--mute)', margin: '0 auto var(--spacing-xl)' }} />
          <h2 style={{ fontSize: '24px', marginBottom: 'var(--spacing-md)' }}>Get started with your first project</h2>
          <p style={{ color: 'var(--body-mid)', maxWidth: '500px', margin: '0 auto var(--spacing-2xl)', lineHeight: '1.5' }}>
            Once you add project data, your sprint health, workload, velocity, and SDLC insights will automatically appear here.
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={handleCreateProject} disabled={isCreating}>
              {isCreating ? <Loader2 className="spin" size={16} /> : <Plus size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '8px' }}/>}
              {isCreating ? 'Creating...' : 'Create Project'}
            </button>
            <button className="btn-outline" onClick={() => alert('Invite team functionality coming soon!')}>Invite Team</button>
          </div>
        </div>
      </div>
    );
  }

  // --- POPULATED DASHBOARD ---
  return (
    <div style={{ minHeight: '100vh', padding: 'var(--spacing-3xl)', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <header style={{ marginBottom: 'var(--spacing-3xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: 'var(--spacing-xs)' }}>Dashboard</h1>
          <p style={{ color: 'var(--mute)', fontSize: '14px' }}>Here's what's happening across your projects.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
          <select 
            className="input" 
            style={{ width: '200px', padding: '8px 12px' }}
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            {projects.map((p: any) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
          <button onClick={handleCreateProject} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '14px' }} disabled={isCreating}>
            {isCreating ? '...' : '+ New'}
          </button>
          <button onClick={handleRefresh} className="btn-outline" style={{ padding: '8px', borderRadius: '8px' }}>
            <RefreshCcw size={18} className={isRefreshing ? 'spin' : ''} />
          </button>
        </div>
      </header>

      {(!hasData && !loadingOverview) && (
         <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-3xl)', marginBottom: 'var(--spacing-2xl)', border: '1px dashed var(--mute)' }}>
           <h3 style={{ marginBottom: '8px' }}>This project is empty</h3>
           <p style={{ color: 'var(--mute)', fontSize: '14px' }}>Create your first sprint and add some tasks using the API to populate these charts.</p>
         </div>
      )}

      {/* SUMMARY METRICS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-2xl)' }}>
        <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--mute)', marginBottom: 'var(--spacing-sm)' }}>
            <span className="mono-caption">Active Sprints</span>
            <PlayCircle size={16} color="var(--accent-sunset)" />
          </div>
          <div style={{ fontSize: '32px' }}>{loadingOverview ? <Loader2 className="spin" size={24}/> : (overview?.activeSprints || 0)}</div>
        </div>
        
        <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--mute)', marginBottom: 'var(--spacing-sm)' }}>
            <span className="mono-caption">Open Tasks</span>
            <Target size={16} color="var(--accent-breeze)" />
          </div>
          <div style={{ fontSize: '32px' }}>{loadingOverview ? <Loader2 className="spin" size={24}/> : (overview?.openTasks || 0)}</div>
        </div>

        <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--mute)', marginBottom: 'var(--spacing-sm)' }}>
            <span className="mono-caption">Blocked</span>
            <ShieldAlert size={16} color="#ef4444" />
          </div>
          <div style={{ fontSize: '32px' }}>{loadingOverview ? <Loader2 className="spin" size={24}/> : (overview?.blockedTasks || 0)}</div>
        </div>

        <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--mute)', marginBottom: 'var(--spacing-sm)' }}>
            <span className="mono-caption">Issues</span>
            <AlertTriangle size={16} color="var(--accent-sunset-soft)" />
          </div>
          <div style={{ fontSize: '32px' }}>{loadingOverview ? <Loader2 className="spin" size={24}/> : (overview?.openIssues || 0)}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-2xl)' }}>
        
        {/* SPRINT HEALTH */}
        <div className="card">
          <h2 style={{ fontSize: '18px', marginBottom: 'var(--spacing-xl)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Sprint Health</span>
            {sprint?.sprint && <span className="mono-caption" style={{ color: 'var(--accent-dusk)' }}>{sprint.sprint.name}</span>}
          </h2>
          
          {loadingSprint ? <Loader2 className="spin" /> : sprint?.sprint ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                <span style={{ color: 'var(--mute)' }}>Progress</span>
                <span>{sprint.plannedPoints > 0 ? Math.round((sprint.completedPoints/sprint.plannedPoints)*100) : 0}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--canvas-mid)', borderRadius: '4px', marginBottom: 'var(--spacing-xl)', overflow: 'hidden' }}>
                <div style={{ width: `${sprint.plannedPoints > 0 ? (sprint.completedPoints/sprint.plannedPoints)*100 : 0}%`, height: '100%', backgroundColor: 'var(--accent-sunset)' }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                <div>
                  <div className="mono-caption" style={{ marginBottom: '8px' }}>Metrics</div>
                  <div style={{ color: 'var(--body)', fontSize: '14px', lineHeight: '1.8' }}>
                    <div>Planned: <span style={{ color: 'var(--ink)' }}>{sprint.plannedPoints} pts</span></div>
                    <div>Completed: <span style={{ color: 'var(--ink)' }}>{sprint.completedPoints} pts</span></div>
                    <div>Remaining: <span style={{ color: 'var(--ink)' }}>{sprint.remainingPoints} pts</span></div>
                  </div>
                </div>
                <div>
                  <div className="mono-caption" style={{ marginBottom: '8px' }}>Status</div>
                  <div style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', 
                    backgroundColor: sprint.status === 'HEALTHY' ? '#059669' : sprint.status === 'AT RISK' ? '#b91c1c' : '#d97706',
                    color: '#fff', marginBottom: '8px'
                  }}>
                    {sprint.status}
                  </div>
                  <ul style={{ paddingLeft: '16px', margin: 0, color: 'var(--body)', fontSize: '13px' }}>
                    {sprint.reasons.map((r: string, i: number) => <li key={i} style={{ marginBottom: '4px' }}>{r}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--mute)', fontSize: '14px' }}>No active sprint.</div>
          )}
        </div>

        {/* WORKLOAD */}
        <div className="card">
          <h2 style={{ fontSize: '18px', marginBottom: 'var(--spacing-xl)' }}>Team Workload</h2>
          {loadingWorkload ? <Loader2 className="spin" /> : workload?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {workload.map((w: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--canvas-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                      {w.user?.firstName?.[0]}{w.user?.lastName?.[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px' }}>{w.user?.firstName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--mute)' }}>{w.assignedPoints} / {w.capacity} pts</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: w.workloadPercentage > 100 ? '#ef4444' : 'var(--accent-breeze)' }}>
                    {Math.round(w.workloadPercentage)}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--mute)', fontSize: '14px' }}>No team members assigned.</div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-2xl)' }}>
        {/* TRACEABILITY */}
        <div className="card">
          <h2 style={{ fontSize: '18px', marginBottom: 'var(--spacing-xl)' }}>SDLC Traceability</h2>
          {loadingTraceability ? <Loader2 className="spin" /> : (
            <div>
              <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-sm)' }}>{traceability?.coverage || 0}%</div>
              <div style={{ color: 'var(--body-mid)', fontSize: '14px' }}>Requirements successfully traced to stories.</div>
              
              <div style={{ display: 'flex', gap: 'var(--spacing-xl)', marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--hairline)' }}>
                <div>
                  <div className="mono-caption">Total</div>
                  <div style={{ fontSize: '20px' }}>{traceability?.requirements || 0}</div>
                </div>
                <div>
                  <div className="mono-caption">Missing Links</div>
                  <div style={{ fontSize: '20px', color: traceability?.missingLinks > 0 ? '#ef4444' : 'inherit' }}>
                    {traceability?.missingLinks || 0}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* DEFINITION OF DONE */}
        <div className="card">
          <h2 style={{ fontSize: '18px', marginBottom: 'var(--spacing-xl)' }}>Definition of Done</h2>
          {loadingDod ? <Loader2 className="spin" /> : (
            <div>
              <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-sm)' }}>{dod?.compliance || 0}%</div>
              <div style={{ color: 'var(--body-mid)', fontSize: '14px' }}>Current sprint compliance.</div>
              
              <div style={{ display: 'flex', gap: 'var(--spacing-xl)', marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--hairline)' }}>
                <div>
                  <div className="mono-caption">Completed</div>
                  <div style={{ fontSize: '20px', color: '#059669' }}>{dod?.completed || 0}</div>
                </div>
                <div>
                  <div className="mono-caption">Incomplete</div>
                  <div style={{ fontSize: '20px', color: dod?.incomplete > 0 ? '#d97706' : 'inherit' }}>
                    {dod?.incomplete || 0}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-2xl)' }}>
        
        {/* RECENT ACTIVITY */}
        <div className="card">
          <h2 style={{ fontSize: '18px', marginBottom: 'var(--spacing-xl)' }}>Recent Activity</h2>
          {loadingActivity ? <Loader2 className="spin" /> : activity?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activity.map((act: any) => (
                <div key={act._id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-dusk)', marginTop: '6px' }} />
                  <div>
                    <div style={{ fontSize: '14px' }}>
                      <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{act.actorId?.firstName} {act.actorId?.lastName}</span> {act.action.toLowerCase().replace('_', ' ')} {act.entityType.toLowerCase()}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--mute)', marginTop: '4px' }}>
                      {formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--mute)', fontSize: '14px' }}>No recent activity.</div>
          )}
        </div>

        {/* DEADLINES */}
        <div className="card">
          <h2 style={{ fontSize: '18px', marginBottom: 'var(--spacing-xl)' }}>Upcoming Deadlines</h2>
          {loadingDeadlines ? <Loader2 className="spin" /> : deadlines?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {deadlines.map((d: any) => (
                <div key={d.id} style={{ paddingBottom: '12px', borderBottom: '1px solid var(--hairline)' }}>
                  <div style={{ fontSize: '14px', marginBottom: '4px' }}>{d.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--mute)' }}>
                    <span>{d.type}</span>
                    <span style={{ color: 'var(--accent-sunset)' }}>{format(new Date(d.dueDate), 'MMM d')}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--mute)', fontSize: '14px' }}>No upcoming deadlines.</div>
          )}
        </div>
      </div>

    </div>
  );
}
