import {
  Check,
  Edit3,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { formatUpdateDate } from '../components/CommunityUpdateCard';
import { useAuth } from '../context/AuthContext';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  deleteCommunityUpdate,
  editCommunityUpdate,
  fetchSubmissionContactForAdmin,
  moderateUpdateStatus,
  subscribeAllUpdatesForAdmin,
  subscribeContactInquiriesForAdmin,
  updateInquiryStatus,
} from '../lib/communityService';
import {
  COMMUNITY_CATEGORIES,
  type CommunityCategory,
  type CommunitySubmissionContact,
  type CommunityUpdate,
  type ContactInquiry,
  type InquiryStatus,
  type UpdateStatus,
} from '../types/civic';

type QueueFilter = 'all' | UpdateStatus;
type AdminTab = 'moderation' | 'inquiries';

const STATUS_LABELS: Record<UpdateStatus, string> = {
  pending: 'Pending Review',
  approved: 'Approved & Published',
  rejected: 'Rejected',
  unpublished: 'Unpublished',
};

export function AdminPage() {
  usePageMeta({
    title: 'Admin Moderation Console – Amoye AI',
    description: 'Protected administrator moderation queue for Amoye AI community updates and contact enquiries.',
  });

  const { user, authReady, isAdmin, adminChecking, authError, signInWithGoogle, signOutUser } =
    useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('moderation');
  const [statusFilter, setStatusFilter] = useState<QueueFilter>('pending');

  const [updates, setUpdates] = useState<CommunityUpdate[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [contactsMap, setContactsMap] = useState<Record<string, CommunitySubmissionContact | null>>({});
  const [loadingContactId, setLoadingContactId] = useState<string | null>(null);

  const [editingUpdate, setEditingUpdate] = useState<CommunityUpdate | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState<CommunityCategory>('Community Updates');
  const [editLocation, setEditLocation] = useState('');
  const [editContributorName, setEditContributorName] = useState('');
  const [editModerationNote, setEditModerationNote] = useState('');

  const [confirmDeleteUpdate, setConfirmDeleteUpdate] = useState<CommunityUpdate | null>(null);

  useEffect(() => {
    if (!authReady || !isAdmin) {
      setLoadingData(false);
      return;
    }

    setLoadingData(true);
    const unsubUpdates = subscribeAllUpdatesForAdmin(
      (data) => {
        setUpdates(data);
        setLoadingData(false);
      },
      (err) => {
        setActionError(err.message);
        setLoadingData(false);
      }
    );

    const unsubInquiries = subscribeContactInquiriesForAdmin(
      (data) => {
        setInquiries(data);
      },
      (err) => {
        setActionError(err.message);
      }
    );

    return () => {
      unsubUpdates();
      unsubInquiries();
    };
  }, [authReady, isAdmin]);

  const counts = useMemo(() => {
    const published = updates.filter((u) => u.status === 'approved').length;
    const pending = updates.filter((u) => u.status === 'pending').length;
    const rejected = updates.filter((u) => u.status === 'rejected').length;
    const recent = updates.length;
    return { published, pending, rejected, recent };
  }, [updates]);

  const filteredUpdates = useMemo(() => {
    if (statusFilter === 'all') return updates;
    return updates.filter((u) => u.status === statusFilter);
  }, [updates, statusFilter]);

  const reviewerId = user?.email ?? user?.uid ?? 'admin';

  const handleModerate = async (updateId: string, nextStatus: UpdateStatus) => {
    setActionError(null);
    setBusyId(updateId);
    try {
      await moderateUpdateStatus(updateId, nextStatus, reviewerId);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Moderation action failed.');
    } finally {
      setBusyId(null);
    }
  };

  const handleLoadContact = async (updateId: string) => {
    if (updateId in contactsMap) return;
    setLoadingContactId(updateId);
    try {
      const contact = await fetchSubmissionContactForAdmin(updateId);
      setContactsMap((prev) => ({ ...prev, [updateId]: contact }));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Unable to read contributor contact.');
    } finally {
      setLoadingContactId(null);
    }
  };

  const openEditModal = (u: CommunityUpdate) => {
    setEditingUpdate(u);
    setEditTitle(u.title);
    setEditDescription(u.description);
    setEditCategory(u.category);
    setEditLocation(u.location);
    setEditContributorName(u.contributor_name);
    setEditModerationNote(u.moderation_note ?? '');
  };

  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingUpdate) return;
    setActionError(null);
    setBusyId(editingUpdate.id);
    try {
      await editCommunityUpdate(
        editingUpdate.id,
        {
          title: editTitle,
          description: editDescription,
          category: editCategory,
          location: editLocation,
          contributor_name: editContributorName,
          moderation_note: editModerationNote,
        },
        reviewerId
      );
      setEditingUpdate(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not save edits.');
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteUpdate) return;
    setActionError(null);
    setBusyId(confirmDeleteUpdate.id);
    try {
      await deleteCommunityUpdate(confirmDeleteUpdate.id);
      setConfirmDeleteUpdate(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Delete failed.');
    } finally {
      setBusyId(null);
    }
  };

  const handleInquiryStatus = async (id: string, status: InquiryStatus) => {
    setActionError(null);
    setBusyId(id);
    try {
      await updateInquiryStatus(id, status);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not update enquiry status.');
    } finally {
      setBusyId(null);
    }
  };

  // Loading auth state
  if (!authReady || adminChecking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F5F2F8] px-4">
        <div className="flex items-center gap-3 text-sm font-medium text-[#4B3D5C]">
          <Loader2 className="w-5 h-5 animate-spin text-[#702A91]" />
          <span>Verifying administrator session...</span>
        </div>
      </div>
    );
  }

  // Unauthenticated gate
  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-[#F5F2F8] px-4 py-16">
        <div className="max-w-md w-full bg-white border border-[#291044]/15 rounded-2xl p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#291044]/8 text-[#702A91] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-[#291044]">
            Administrator Sign In
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-[#4B3D5C]">
            This area is restricted to authorised Amoye AI moderators. Sign in with your verified Google administrator account to review submissions.
          </p>
          {authError && (
            <p className="mt-4 p-3 rounded-lg bg-[#FEF2F2] text-xs text-[#991B1B]">
              {authError}
            </p>
          )}
          <button
            type="button"
            onClick={() => void signInWithGoogle()}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#291044] hover:bg-[#3B1861] rounded-lg transition-colors"
          >
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    );
  }

  // Signed in, but not an authorized admin
  if (!isAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-[#F5F2F8] px-4 py-16">
        <div className="max-w-md w-full bg-white border border-[#291044]/15 rounded-2xl p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#FEF2F2] text-[#B91C1C] flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-[#291044]">
            Access Not Authorised
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-[#4B3D5C]">
            The signed-in account (<strong className="text-[#291044]">{user.email}</strong>) does not have administrator moderation permissions.
          </p>
          <button
            type="button"
            onClick={() => void signOutUser()}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#291044] border border-[#291044]/20 hover:bg-[#F5F2F8] rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F2F8] min-h-[85vh] py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#291044]/12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#702A91]">
              Protected Administration
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#291044]">
              Amoye AI Moderation Console
            </h1>
            <p className="mt-1 text-xs text-[#6B5A7E]">
              Signed in as <span className="font-semibold text-[#291044]">{user.email}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => void signOutUser()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#291044] bg-white border border-[#291044]/15 hover:bg-[#EFEAF4] rounded-lg transition-colors self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Summary Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#291044]/12 rounded-xl p-5">
            <p className="text-xs font-medium text-[#6B5A7E]">Total Published Updates</p>
            <p className="mt-2 text-3xl font-extrabold text-[#291044] tabular-nums">
              {counts.published}
            </p>
          </div>
          <div className="bg-white border border-[#291044]/12 rounded-xl p-5">
            <p className="text-xs font-medium text-[#6B5A7E]">Pending Submissions</p>
            <p className="mt-2 text-3xl font-extrabold text-[#702A91] tabular-nums">
              {counts.pending}
            </p>
          </div>
          <div className="bg-white border border-[#291044]/12 rounded-xl p-5">
            <p className="text-xs font-medium text-[#6B5A7E]">Rejected Submissions</p>
            <p className="mt-2 text-3xl font-extrabold text-[#291044] tabular-nums">
              {counts.rejected}
            </p>
          </div>
          <div className="bg-white border border-[#291044]/12 rounded-xl p-5">
            <p className="text-xs font-medium text-[#6B5A7E]">Total Submissions</p>
            <p className="mt-2 text-3xl font-extrabold text-[#291044] tabular-nums">
              {counts.recent}
            </p>
          </div>
        </div>

        {actionError && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-[#FEF2F2] border border-[#DC2626]/30 text-sm text-[#991B1B]"
          >
            {actionError}
          </div>
        )}

        {/* Section Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 p-1 bg-white border border-[#291044]/12 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('moderation')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors ${
                activeTab === 'moderation'
                  ? 'bg-[#291044] text-white'
                  : 'text-[#4B3D5C] hover:text-[#291044]'
              }`}
            >
              Moderation Queue ({updates.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors ${
                activeTab === 'inquiries'
                  ? 'bg-[#291044] text-white'
                  : 'text-[#4B3D5C] hover:text-[#291044]'
              }`}
            >
              Contact Enquiries ({inquiries.length})
            </button>
          </div>

          {activeTab === 'moderation' && (
            <div className="flex flex-wrap items-center gap-1.5">
              {(['pending', 'approved', 'rejected', 'unpublished', 'all'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${
                    statusFilter === st
                      ? 'bg-[#702A91] text-white'
                      : 'bg-white border border-[#291044]/12 text-[#4B3D5C] hover:text-[#291044]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Moderation Queue */}
        {activeTab === 'moderation' && (
          <div className="space-y-4">
            {loadingData ? (
              <div className="bg-white border border-[#291044]/12 rounded-xl p-10 text-center text-sm text-[#6B5A7E]">
                Loading submissions...
              </div>
            ) : filteredUpdates.length === 0 ? (
              <div className="bg-white border border-[#291044]/12 rounded-xl p-10 text-center">
                <p className="text-base font-semibold text-[#291044]">
                  No submissions in &ldquo;{statusFilter}&rdquo;
                </p>
                <p className="mt-1 text-sm text-[#6B5A7E]">
                  Switch filters above to inspect other submissions.
                </p>
              </div>
            ) : (
              filteredUpdates.map((item) => {
                const contactRecord = contactsMap[item.id];
                const isBusy = busyId === item.id;

                return (
                  <article
                    key={item.id}
                    className="bg-white border border-[#291044]/12 rounded-xl p-6 space-y-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="space-y-2 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[#6B5A7E] tabular-nums">
                          <span className="font-bold text-[#702A91]">
                            {STATUS_LABELS[item.status]}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{item.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.location}</span>
                          <span aria-hidden="true">·</span>
                          <span>Submitted {formatUpdateDate(item.created_at)}</span>
                        </div>

                        <h2 className="text-xl font-bold text-[#291044]">{item.title}</h2>
                        <p className="text-sm leading-relaxed text-[#382A49] whitespace-pre-line">
                          {item.description}
                        </p>

                        <p className="text-xs text-[#6B5A7E]">
                          Public attribution: <strong className="text-[#291044]">{item.contributor_name}</strong>
                          {item.reviewed_by ? ` · Last reviewed by ${item.reviewed_by}` : ''}
                        </p>

                        {item.moderation_note && (
                          <p className="text-xs text-[#57486B] bg-[#F5F2F8] px-3 py-2 rounded-lg">
                            <strong>Moderator note:</strong> {item.moderation_note}
                          </p>
                        )}
                      </div>

                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full lg:w-44 h-32 object-cover rounded-lg border border-[#291044]/12 shrink-0"
                        />
                      )}
                    </div>

                    {/* Private Contributor Contact Inspection */}
                    <div className="pt-3 border-t border-[#291044]/10 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        {item.id in contactsMap ? (
                          contactRecord ? (
                            <p className="text-xs text-[#4B3D5C]">
                              Private contributor record: <strong className="text-[#291044]">{contactRecord.contributor_name}</strong> ({contactRecord.contributor_contact})
                            </p>
                          ) : (
                            <p className="text-xs text-[#6B5A7E]">No separate contact record found.</p>
                          )
                        ) : (
                          <button
                            type="button"
                            onClick={() => void handleLoadContact(item.id)}
                            disabled={loadingContactId === item.id}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#702A91] hover:text-[#291044]"
                          >
                            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>
                              {loadingContactId === item.id
                                ? 'Loading contributor contact...'
                                : 'View private contributor contact'}
                            </span>
                          </button>
                        )}
                      </div>

                      {/* Moderation Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        {item.status !== 'approved' && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => void handleModerate(item.id, 'approved')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 rounded-lg transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Approve &amp; Publish</span>
                          </button>
                        )}

                        {item.status === 'approved' && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => void handleModerate(item.id, 'unpublished')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#291044] bg-[#F5F2F8] hover:bg-[#EAE3F2] disabled:opacity-50 rounded-lg transition-colors"
                          >
                            <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Unpublish</span>
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => openEditModal(item)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#291044] border border-[#291044]/20 hover:bg-[#F5F2F8] disabled:opacity-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Edit</span>
                        </button>

                        {item.status !== 'rejected' && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => void handleModerate(item.id, 'rejected')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#B45309] border border-[#B45309]/30 hover:bg-[#FEF3C7] disabled:opacity-50 rounded-lg transition-colors"
                          >
                            <X className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Reject</span>
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => setConfirmDeleteUpdate(item)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#B91C1C] border border-[#B91C1C]/30 hover:bg-[#FEE2E2] disabled:opacity-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        )}

        {/* Contact Enquiries Tab */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <div className="bg-white border border-[#291044]/12 rounded-xl p-10 text-center text-sm text-[#6B5A7E]">
                No contact enquiries received yet.
              </div>
            ) : (
              inquiries.map((inq) => (
                <article
                  key={inq.id}
                  className="bg-white border border-[#291044]/12 rounded-xl p-6 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#6B5A7E] tabular-nums">
                      <span className="font-bold text-[#702A91] uppercase">{inq.status}</span>
                      <span aria-hidden="true">·</span>
                      <span>{inq.inquiry_type}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatUpdateDate(inq.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {(['new', 'reviewed', 'resolved'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          disabled={busyId === inq.id || inq.status === st}
                          onClick={() => void handleInquiryStatus(inq.id, st)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded capitalize transition-colors ${
                            inq.status === st
                              ? 'bg-[#291044] text-white'
                              : 'bg-[#F5F2F8] text-[#4B3D5C] hover:text-[#291044]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <h2 className="text-lg font-bold text-[#291044]">{inq.subject}</h2>
                  <p className="text-sm leading-relaxed text-[#382A49] whitespace-pre-line">
                    {inq.message}
                  </p>
                  <p className="text-xs text-[#6B5A7E] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      {inq.name} ({inq.email})
                    </span>
                  </p>
                </article>
              ))
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingUpdate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#291044]/65 p-4 overflow-y-auto"
        >
          <div className="w-full max-w-xl bg-white rounded-2xl border border-[#291044]/15 shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-[#291044]/10 flex items-center justify-between">
              <h2 id="edit-modal-title" className="text-lg font-bold text-[#291044]">
                Edit Community Submission
              </h2>
              <button
                type="button"
                onClick={() => setEditingUpdate(null)}
                aria-label="Close edit dialog"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[#4B3D5C] hover:bg-[#F5F2F8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#291044] mb-1">Headline</label>
                <input
                  type="text"
                  required
                  minLength={5}
                  maxLength={140}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#291044]/20 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#291044] mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as CommunityCategory)}
                    className="w-full px-3 py-2 text-sm border border-[#291044]/20 rounded-lg"
                  >
                    {COMMUNITY_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#291044] mb-1">Location / LGA</label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={80}
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#291044]/20 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#291044] mb-1">
                  Public Attribution Name
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={80}
                  value={editContributorName}
                  onChange={(e) => setEditContributorName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#291044]/20 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#291044] mb-1">Description</label>
                <textarea
                  rows={4}
                  required
                  minLength={20}
                  maxLength={2500}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#291044]/20 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#291044] mb-1">
                  Internal Moderation Note (optional)
                </label>
                <input
                  type="text"
                  maxLength={500}
                  value={editModerationNote}
                  onChange={(e) => setEditModerationNote(e.target.value)}
                  placeholder="Context for edits or verification"
                  className="w-full px-3 py-2 text-sm border border-[#291044]/20 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[#291044]/10">
                <button
                  type="button"
                  onClick={() => setEditingUpdate(null)}
                  className="px-4 py-2 text-sm font-semibold text-[#4B3D5C] hover:text-[#291044]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busyId === editingUpdate.id}
                  className="px-5 py-2 text-sm font-semibold text-white bg-[#702A91] hover:bg-[#5A1F76] rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-Page Delete Confirmation Modal (No window.confirm) */}
      {confirmDeleteUpdate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#291044]/65 p-4"
        >
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#291044]/15 p-6 shadow-2xl">
            <h2 id="delete-confirm-title" className="text-lg font-bold text-[#291044]">
              Permanently delete submission?
            </h2>
            <p className="mt-2 text-sm text-[#4B3D5C]">
              This removes <strong>&ldquo;{confirmDeleteUpdate.title}&rdquo;</strong> and its linked contact record permanently. This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteUpdate(null)}
                className="px-4 py-2 text-sm font-semibold text-[#4B3D5C] hover:text-[#291044]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busyId === confirmDeleteUpdate.id}
                onClick={() => void handleConfirmDelete()}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
