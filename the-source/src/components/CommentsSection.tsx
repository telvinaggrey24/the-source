import React, { useState, useEffect } from 'react';
import { useNews } from '../context/NewsContext';
import { ArticleComment } from '../types';
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Send,
  CheckCircle2,
  Flag,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

interface CommentsSectionProps {
  articleId: string;
  comments: ArticleComment[];
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ articleId, comments }) => {
  const { addComment, addCommentReply, upvoteComment, downvoteComment, language, currentUser, setIsAuthModalOpen } = useNews();

  // New comment form state
  const [authorName, setAuthorName] = useState(currentUser?.name || '');
  const [authorCity, setAuthorCity] = useState('');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sortBy, setSortBy] = useState<'helpful' | 'newest' | 'oldest'>('helpful');

  useEffect(() => {
    if (currentUser?.name) {
      setAuthorName(currentUser.name);
    }
  }, [currentUser]);

  // Reply form state
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyAuthorName, setReplyAuthorName] = useState('');
  const [replyAuthorCity, setReplyAuthorCity] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replySubmittedId, setReplySubmittedId] = useState<string | null>(null);

  // Reported comments tracking
  const [reportedComments, setReportedComments] = useState<string[]>([]);

  // Format relative time
  const formatTimeAgo = (dateStr: string) => {
    try {
      const now = new Date().getTime();
      const time = new Date(dateStr).getTime();
      const diffMinutes = Math.floor((now - time) / (1000 * 60));
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return 'Recent';
    }
  };

  // Submit main comment
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    addComment(articleId, authorName, authorCity, content);
    setContent('');
    setAuthorName('');
    setAuthorCity('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  // Submit reply to a comment
  const handleReplySubmit = (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    addCommentReply(articleId, parentId, replyAuthorName, replyAuthorCity, replyContent);
    setReplyContent('');
    setReplyAuthorName('');
    setReplyAuthorCity('');
    setActiveReplyId(null);
    setReplySubmittedId(parentId);
    setTimeout(() => setReplySubmittedId(null), 4000);
  };

  // Report comment
  const handleReport = (id: string) => {
    if (!reportedComments.includes(id)) {
      setReportedComments(prev => [...prev, id]);
    }
  };

  // Sort comments
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'helpful') {
      return (b.upvotes - (b.downvotes || 0)) - (a.upvotes - (a.downvotes || 0));
    }
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  // Calculate total comments including replies
  const totalCommentsCount = comments.reduce(
    (total, c) => total + 1 + (c.replies ? c.replies.length : 0),
    0
  );

  return (
    <section className="no-print mt-12 pt-8 border-t-2 border-stone-900 font-sans" aria-label="Reader Comments">
      {/* BBC Community Comments Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-stone-200 gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-6 bg-[#BB1919] inline-block" />
          <h3 className="font-sans font-black text-2xl text-stone-950 uppercase tracking-tight">
            {language === 'sw' ? 'Mjadala na Maoni ya Wasomaji' : 'Reader Comments & Discussion'}
          </h3>
          <span className="bg-[#121212] text-white text-xs font-mono font-bold px-2 py-0.5 rounded-2xs">
            {totalCommentsCount}
          </span>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-500 font-bold uppercase tracking-wider text-[11px]">Sort:</span>
          <div className="flex items-center p-0.5 bg-stone-100 rounded-2xs border border-stone-200">
            <button
              onClick={() => setSortBy('helpful')}
              className={`px-2.5 py-1 text-xs font-bold uppercase rounded-2xs transition-colors cursor-pointer ${
                sortBy === 'helpful' ? 'bg-white text-stone-950 shadow-2xs' : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              Top
            </button>
            <button
              onClick={() => setSortBy('newest')}
              className={`px-2.5 py-1 text-xs font-bold uppercase rounded-2xs transition-colors cursor-pointer ${
                sortBy === 'newest' ? 'bg-white text-stone-950 shadow-2xs' : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortBy('oldest')}
              className={`px-2.5 py-1 text-xs font-bold uppercase rounded-2xs transition-colors cursor-pointer ${
                sortBy === 'oldest' ? 'bg-white text-stone-950 shadow-2xs' : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              Oldest
            </button>
          </div>
        </div>
      </div>

      {/* Community Rules Notice */}
      <div className="bg-stone-50 border border-stone-200 p-3 sm:p-4 rounded-xs mb-6 text-xs text-stone-600 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {language === 'sw'
              ? 'Maoni yote yanachujwa kulingana na Sheria za Maadili ya Uandishi wa Habari. Maoni ya matusi au chuki hayaruhusiwi.'
              : 'Comments are moderated according to The Sun community guidelines. Please keep discussion civil, factual, and respectful.'}
          </span>
        </div>
        <span className="text-[11px] font-bold text-[#BB1919] uppercase shrink-0 hidden md:inline">
          Verified Forum
        </span>
      </div>

      {/* Main Comment Submission Box */}
      <form onSubmit={handleCommentSubmit} className="bg-white border-2 border-stone-200 p-5 sm:p-6 rounded-xs mb-8 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-sm text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#BB1919]" />
            <span>{language === 'sw' ? 'Wasilisha Maoni Yako' : 'Join The Discussion'}</span>
          </h4>
          {currentUser ? (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-2xs border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Posting as: {currentUser.name}</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="text-[11px] font-bold text-[#BB1919] hover:underline cursor-pointer"
            >
              Sign in for Verified Badge
            </button>
          )}
        </div>

        {submitted && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-2xs flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {language === 'sw'
                ? 'Maoni yako yamechapishwa! Ahsante kwa mchango wako.'
                : 'Your comment has been published! Thank you for participating in informed civil discourse.'}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              placeholder="E.g. Juma Ally / Grace Minja"
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-2xs focus:outline-hidden focus:border-[#BB1919]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              City / Location (Optional)
            </label>
            <input
              type="text"
              value={authorCity}
              onChange={e => setAuthorCity(e.target.value)}
              placeholder="E.g. Dar es Salaam, Dodoma, London"
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-2xs focus:outline-hidden focus:border-[#BB1919]"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
            Your Comment *
          </label>
          <textarea
            required
            maxLength={1000}
            rows={3}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Share your perspective, question facts, or add local context..."
            className="w-full px-3 py-2 text-xs border border-stone-300 rounded-2xs focus:outline-hidden focus:border-[#BB1919] leading-relaxed font-sans"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <span className="text-[11px] text-stone-400">
            Please be respectful of differing views and avoid advertising or spam.
          </span>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#BB1919] hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider rounded-2xs transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{language === 'sw' ? 'Chapisha Maoni' : 'Post Comment'}</span>
          </button>
        </div>
      </form>

      {/* Comments List Display */}
      {comments.length === 0 ? (
        <div className="text-center py-12 bg-stone-50 border border-stone-200 rounded-xs">
          <MessageSquare className="w-8 h-8 text-stone-300 mx-auto mb-2" />
          <p className="font-bold text-sm text-stone-800 mb-1">No comments posted yet</p>
          <p className="text-xs text-stone-500">Be the first to share your viewpoint on this story!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedComments.map(comment => {
            const isReported = reportedComments.includes(comment.id);
            const isReplying = activeReplyId === comment.id;

            return (
              <div
                key={comment.id}
                className="p-5 bg-white border border-stone-200 rounded-xs shadow-2xs hover:border-stone-300 transition-colors"
              >
                {/* Author Bar */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold font-mono">
                      {comment.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-950">{comment.authorName}</span>
                        {comment.authorCity && (
                          <span className="text-[11px] text-stone-500 flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            {comment.authorCity}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Report Flag */}
                  <button
                    onClick={() => handleReport(comment.id)}
                    className={`text-[11px] flex items-center gap-1 transition-colors cursor-pointer ${
                      isReported ? 'text-amber-600 font-bold' : 'text-stone-400 hover:text-stone-700'
                    }`}
                    title="Report inappropriate content"
                  >
                    <Flag className="w-3 h-3" />
                    <span>{isReported ? 'Reported' : 'Report'}</span>
                  </button>
                </div>

                {/* Comment Body */}
                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed mb-3 pl-10">
                  {comment.content}
                </p>

                {/* Action Row: Helpful, Disagree, Reply */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100 pl-10">
                  <div className="flex items-center gap-4">
                    {/* Upvote */}
                    <button
                      onClick={() => upvoteComment(articleId, comment.id)}
                      className="inline-flex items-center gap-1.5 text-stone-600 hover:text-[#BB1919] font-medium transition-colors cursor-pointer"
                      title="This comment is helpful and adds value"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-stone-400 hover:text-[#BB1919]" />
                      <span className="font-bold tabular-nums">Helpful ({comment.upvotes})</span>
                    </button>

                    {/* Downvote */}
                    <button
                      onClick={() => downvoteComment(articleId, comment.id)}
                      className="inline-flex items-center gap-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                      title="Disagree"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      {comment.downvotes ? <span className="tabular-nums">({comment.downvotes})</span> : null}
                    </button>

                    {/* Reply Toggle */}
                    <button
                      onClick={() => setActiveReplyId(isReplying ? null : comment.id)}
                      className="inline-flex items-center gap-1 text-stone-600 hover:text-[#BB1919] font-bold uppercase tracking-wider text-[11px] cursor-pointer"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>{isReplying ? 'Cancel' : 'Reply'}</span>
                    </button>
                  </div>

                  {comment.replies && comment.replies.length > 0 && (
                    <span className="text-[11px] text-stone-400 font-medium">
                      {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                    </span>
                  )}
                </div>

                {/* Inline Reply Form */}
                {isReplying && (
                  <form
                    onSubmit={e => handleReplySubmit(e, comment.id)}
                    className="mt-4 ml-10 p-4 bg-stone-50 border border-stone-200 rounded-2xs space-y-3"
                  >
                    <span className="text-xs font-bold text-stone-800 uppercase block">
                      Replying to {comment.authorName}:
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={replyAuthorName}
                        onChange={e => setReplyAuthorName(e.target.value)}
                        className="px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-2xs"
                      />
                      <input
                        type="text"
                        placeholder="Your Location"
                        value={replyAuthorCity}
                        onChange={e => setReplyAuthorCity(e.target.value)}
                        className="px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-2xs"
                      />
                    </div>

                    <textarea
                      required
                      rows={2}
                      placeholder="Write your thoughtful reply..."
                      value={replyContent}
                      onChange={e => setReplyContent(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-2xs focus:outline-hidden focus:border-[#BB1919]"
                    />

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveReplyId(null)}
                        className="px-3 py-1 text-xs text-stone-600 hover:text-stone-900 font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#BB1919] hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider rounded-2xs"
                      >
                        Submit Reply
                      </button>
                    </div>
                  </form>
                )}

                {/* Nested Replies Thread */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 ml-10 pl-4 border-l-2 border-stone-200 space-y-3 pt-2">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="p-3 bg-stone-50 border border-stone-200 rounded-2xs">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-stone-950">{reply.authorName}</span>
                            {reply.authorCity && (
                              <span className="text-[10px] text-stone-400">({reply.authorCity})</span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-stone-400">
                            {formatTimeAgo(reply.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-stone-800 leading-relaxed mb-2">
                          {reply.content}
                        </p>
                        <div className="flex items-center gap-2 text-[11px]">
                          <button
                            onClick={() => upvoteComment(articleId, reply.id)}
                            className="inline-flex items-center gap-1 text-stone-500 hover:text-[#BB1919] font-medium"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>Helpful ({reply.upvotes})</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
