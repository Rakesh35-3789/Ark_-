'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Rocket,
  UploadCloud,
  UserRound,
} from 'lucide-react';

import { useAuth } from '@/components/AuthProvider';
import { createBrowserSupabase } from '@/lib/supabase-browser';

type Kind = 'story' | 'research' | 'founder' | 'opportunity';

const kinds: {
  value: Kind;
  label: string;
  description: string;
  icon: typeof Rocket;
}[] = [
  {
    value: 'story',
    label: 'Story',
    description: 'Share an innovation journey or achievement.',
    icon: Rocket,
  },
  {
    value: 'research',
    label: 'Research',
    description: 'Submit an academic or technical paper.',
    icon: BookOpen,
  },
  {
    value: 'founder',
    label: 'Founder',
    description: 'Create a founder and company profile.',
    icon: UserRound,
  },
  {
    value: 'opportunity',
    label: 'Opportunity',
    description: 'Post an internship, grant, event or job.',
    icon: BriefcaseBusiness,
  },
];

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') +
    '-' +
    Date.now().toString(36)
  );
}

function cleanOptional(value: FormDataEntryValue | null) {
  const text = String(value || '').trim();
  return text || null;
}

export default function SubmitPage() {
  const [kind, setKind] = useState<Kind>('story');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const { user, loading } = useAuth();

  const title = useMemo(
    () =>
      ({
        story: 'Submit an innovation story',
        research: 'Submit a research paper',
        founder: 'Submit a founder profile',
        opportunity: 'Post an opportunity',
      })[kind],
    [kind],
  );

  async function upload(file: File | null, bucket: string) {
    if (!file || file.size === 0) {
      return null;
    }

    if (!user) {
      throw new Error('You must be signed in before uploading.');
    }

    const limitMb = bucket === 'research-files' ? 10 : 5;

    if (file.size > limitMb * 1024 * 1024) {
      throw new Error(`File must be under ${limitMb} MB.`);
    }

    const supabase = createBrowserSupabase();

    const safeName = file.name
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9._-]/g, '');

    const path = `${user.id}/${crypto.randomUUID()}-${safeName}`;

    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: false,
      cacheControl: '3600',
    });

    if (error) {
      throw error;
    }

    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || busy) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    setBusy(true);
    setMessage('');
    setSuccess(false);

    try {
      const supabase = createBrowserSupabase();
      let submissionError: { message: string } | null = null;

      if (kind === 'story') {
        const storyTitle = String(formData.get('title') || '').trim();

        const coverEntry = formData.get('cover');
        const coverFile =
          coverEntry instanceof File && coverEntry.size > 0
            ? coverEntry
            : null;

        const coverUrl = await upload(coverFile, 'story-images');

        const { error } = await supabase.from('stories').insert({
          author_id: user.id,
          title: storyTitle,
          slug: slugify(storyTitle),
          excerpt: String(formData.get('excerpt') || '').trim(),
          content: String(formData.get('content') || '').trim(),
          category: String(formData.get('category') || '').trim(),
          city: cleanOptional(formData.get('city')),
          cover_url: coverUrl,
          status: 'pending',
        });

        submissionError = error;
      }

      if (kind === 'research') {
        const paperEntry = formData.get('paper');
        const paperFile =
          paperEntry instanceof File && paperEntry.size > 0
            ? paperEntry
            : null;

        if (!paperFile) {
          throw new Error('Please choose a PDF file.');
        }

        const paperUrl = await upload(paperFile, 'research-files');

        const { error } = await supabase.from('research_papers').insert({
          author_id: user.id,
          title: String(formData.get('title') || '').trim(),
          abstract: String(formData.get('abstract') || '').trim(),
          field: String(formData.get('field') || '').trim(),
          institution: cleanOptional(formData.get('institution')),
          paper_url: paperUrl,
          status: 'pending',
        });

        submissionError = error;
      }

      if (kind === 'founder') {
        const { error } = await supabase.from('founders').insert({
          owner_id: user.id,
          name: String(formData.get('name') || '').trim(),
          company: String(formData.get('company') || '').trim(),
          role_title: cleanOptional(formData.get('role_title')),
          city: cleanOptional(formData.get('city')),
          bio: String(formData.get('bio') || '').trim(),
          website: cleanOptional(formData.get('website')),
          status: 'pending',
        });

        submissionError = error;
      }

      if (kind === 'opportunity') {
        const { error } = await supabase.from('opportunities').insert({
          owner_id: user.id,
          title: String(formData.get('title') || '').trim(),
          organization: String(formData.get('organization') || '').trim(),
          opportunity_type: String(
            formData.get('opportunity_type') || '',
          ).trim(),
          location: cleanOptional(formData.get('location')),
          description: String(formData.get('description') || '').trim(),
          apply_url: cleanOptional(formData.get('apply_url')),
          deadline: cleanOptional(formData.get('deadline')),
          status: 'pending',
        });

        submissionError = error;
      }

      if (submissionError) {
        throw new Error(submissionError.message);
      }

      formRef.current?.reset();

      setSuccess(true);
      setMessage(
        'Submitted successfully. ARK admins will review it before publication.',
      );
    } catch (error) {
      setSuccess(false);
      setMessage(
        error instanceof Error ? error.message : 'Submission failed.',
      );
    } finally {
      setBusy(false);
    }
  }

  function changeKind(nextKind: Kind) {
    if (busy) {
      return;
    }

    setKind(nextKind);
    setMessage('');
    setSuccess(false);
    formRef.current?.reset();
  }

  if (loading) {
    return (
      <main className="section shell">
        <div className="empty">Checking your ARK account…</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="auth-page">
        <div className="form-card">
          <div className="eyebrow">ARK contributors</div>
          <h1>Sign in to contribute</h1>
          <p>
            ARK links every submission to a verified account before it is sent
            for review.
          </p>

          <Link className="button" href="/auth">
            Sign in or join ARK
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="submit-premium-page">
      <section className="submit-premium-hero">
        <div className="shell submit-premium-hero-inner">
          <div>
            <div className="eyebrow">Contribute to ARK</div>
            <h1>{title}</h1>
            <p>
              Your submission remains private until an ARK administrator reviews
              and approves it.
            </p>
          </div>

          <div className="submit-review-badge">
            <CheckCircle2 size={22} />
            <div>
              <strong>Editorial review</strong>
              <span>Nothing is published automatically</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell submit-premium-layout">
          <aside className="submit-kind-panel">
            <span className="submit-panel-label">Choose submission type</span>

            <div className="submit-kind-list">
              {kinds.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    type="button"
                    key={item.value}
                    className={`submit-kind-button ${
                      kind === item.value ? 'active' : ''
                    }`}
                    onClick={() => changeKind(item.value)}
                    disabled={busy}
                  >
                    <Icon size={22} />

                    <div>
                      <strong>{item.label}</strong>
                      <span>{item.description}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="submit-form-panel">
            <form
              ref={formRef}
              className="form-card wide submit-premium-form"
              onSubmit={submit}
            >
              {kind === 'story' && (
                <>
                  <label>
                    Story title
                    <input
                      name="title"
                      minLength={8}
                      maxLength={140}
                      placeholder="Give your story a clear title"
                      required
                    />
                  </label>

                  <div className="two">
                    <label>
                      Category
                      <select name="category" required defaultValue="Startup">
                        <option value="Startup">Startup</option>
                        <option value="Research">Research</option>
                        <option value="Student Achievement">
                          Student Achievement
                        </option>
                        <option value="Technology">Technology</option>
                        <option value="Founder Journey">
                          Founder Journey
                        </option>
                      </select>
                    </label>

                    <label>
                      City
                      <input name="city" placeholder="Hyderabad" />
                    </label>
                  </div>

                  <label>
                    Short summary
                    <textarea
                      name="excerpt"
                      rows={4}
                      minLength={30}
                      maxLength={300}
                      placeholder="Explain the story in a few clear sentences"
                      required
                    />
                  </label>

                  <label>
                    Full story
                    <textarea
                      name="content"
                      rows={13}
                      minLength={150}
                      placeholder="Write the full journey, problem, solution and impact"
                      required
                    />
                  </label>

                  <label className="submit-file-field">
                    <UploadCloud size={22} />
                    <span>
                      <strong>Cover image</strong>
                      <small>PNG, JPG or WEBP — maximum 5 MB</small>
                    </span>
                    <input
                      name="cover"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                    />
                  </label>
                </>
              )}

              {kind === 'research' && (
                <>
                  <label>
                    Paper title
                    <input
                      name="title"
                      minLength={8}
                      placeholder="Enter the complete paper title"
                      required
                    />
                  </label>

                  <div className="two">
                    <label>
                      Field
                      <input
                        name="field"
                        placeholder="Artificial Intelligence"
                        required
                      />
                    </label>

                    <label>
                      Institution
                      <input
                        name="institution"
                        placeholder="College or research institution"
                      />
                    </label>
                  </div>

                  <label>
                    Abstract
                    <textarea
                      name="abstract"
                      rows={9}
                      minLength={100}
                      placeholder="Explain the objective, method and findings"
                      required
                    />
                  </label>

                  <label className="submit-file-field">
                    <UploadCloud size={22} />
                    <span>
                      <strong>Research PDF</strong>
                      <small>PDF only — maximum 10 MB</small>
                    </span>
                    <input
                      name="paper"
                      type="file"
                      accept="application/pdf"
                      required
                    />
                  </label>
                </>
              )}

              {kind === 'founder' && (
                <>
                  <div className="two">
                    <label>
                      Founder name
                      <input
                        name="name"
                        placeholder="Full name"
                        required
                      />
                    </label>

                    <label>
                      Company
                      <input
                        name="company"
                        placeholder="Company or startup"
                        required
                      />
                    </label>
                  </div>

                  <div className="two">
                    <label>
                      Role
                      <input
                        name="role_title"
                        placeholder="Co-founder & CEO"
                      />
                    </label>

                    <label>
                      City
                      <input name="city" placeholder="Hyderabad" />
                    </label>
                  </div>

                  <label>
                    Biography
                    <textarea
                      name="bio"
                      rows={9}
                      minLength={80}
                      placeholder="Describe the founder, mission and journey"
                      required
                    />
                  </label>

                  <label>
                    Website
                    <input
                      name="website"
                      type="url"
                      placeholder="https://example.com"
                    />
                  </label>
                </>
              )}

              {kind === 'opportunity' && (
                <>
                  <label>
                    Opportunity title
                    <input
                      name="title"
                      placeholder="Opportunity name"
                      required
                    />
                  </label>

                  <div className="two">
                    <label>
                      Organization
                      <input
                        name="organization"
                        placeholder="Company or institution"
                        required
                      />
                    </label>

                    <label>
                      Type
                      <select
                        name="opportunity_type"
                        defaultValue="Internship"
                      >
                        <option value="Internship">Internship</option>
                        <option value="Job">Job</option>
                        <option value="Hackathon">Hackathon</option>
                        <option value="Event">Event</option>
                        <option value="Grant">Grant</option>
                        <option value="Fellowship">Fellowship</option>
                      </select>
                    </label>
                  </div>

                  <div className="two">
                    <label>
                      Location
                      <input
                        name="location"
                        placeholder="Remote / Hyderabad"
                      />
                    </label>

                    <label>
                      Deadline
                      <input name="deadline" type="date" />
                    </label>
                  </div>

                  <label>
                    Description
                    <textarea
                      name="description"
                      rows={9}
                      minLength={80}
                      placeholder="Explain eligibility, benefits and application details"
                      required
                    />
                  </label>

                  <label>
                    Application link
                    <input
                      name="apply_url"
                      type="url"
                      placeholder="https://example.com/apply"
                    />
                  </label>
                </>
              )}

              {message && (
                <div
                  className={`notice ${
                    success ? 'submit-success-message' : 'submit-error-message'
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                className="button submit-premium-button"
                disabled={busy}
                type="submit"
              >
                {busy ? 'Submitting securely…' : 'Submit for review'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .submit-premium-page {
          min-height: 100vh;
          background: #f5f2ea;
        }

        .submit-premium-hero {
          padding: 72px 0;
          border-bottom: 1px solid rgba(15, 35, 27, 0.13);
          background:
            radial-gradient(
              circle at 85% 10%,
              rgba(43, 65, 128, 0.11),
              transparent 30%
            ),
            linear-gradient(135deg, #f8f5ee, #edf2ed);
        }

        .submit-premium-hero-inner {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 35px;
        }

        .submit-premium-hero h1 {
          max-width: 760px;
          margin: 12px 0;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(42px, 6vw, 70px);
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .submit-premium-hero p {
          max-width: 700px;
          margin: 0;
          color: #657169;
          font-size: 16px;
          line-height: 1.7;
        }

        .submit-review-badge {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 18px 20px;
          border: 1px solid rgba(12, 105, 72, 0.19);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.72);
          color: #0c6948;
          box-shadow: 0 12px 30px rgba(18, 41, 31, 0.07);
        }

        .submit-review-badge div {
          display: flex;
          flex-direction: column;
        }

        .submit-review-badge span {
          margin-top: 3px;
          color: #6d7770;
          font-size: 11px;
        }

        .submit-premium-layout {
          display: grid;
          grid-template-columns: 310px minmax(0, 1fr);
          gap: 35px;
          align-items: start;
        }

        .submit-kind-panel {
          position: sticky;
          top: 105px;
          padding: 24px;
          border: 1px solid rgba(15, 35, 27, 0.12);
          border-radius: 22px;
          background: #fffefb;
          box-shadow: 0 14px 42px rgba(19, 39, 30, 0.06);
        }

        .submit-panel-label {
          display: block;
          margin-bottom: 17px;
          color: #667069;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .submit-kind-list {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .submit-kind-button {
          width: 100%;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 13px;
          padding: 15px;
          border: 1px solid transparent;
          border-radius: 14px;
          background: transparent;
          color: #16251d;
          text-align: left;
          cursor: pointer;
          transition:
            background 180ms ease,
            border 180ms ease,
            transform 180ms ease;
        }

        .submit-kind-button:hover {
          transform: translateX(3px);
          background: #f1f4ef;
        }

        .submit-kind-button.active {
          border-color: rgba(31, 49, 111, 0.18);
          background: #1f316f;
          color: white;
        }

        .submit-kind-button div {
          display: flex;
          flex-direction: column;
        }

        .submit-kind-button span {
          margin-top: 4px;
          color: #778079;
          font-size: 11px;
          line-height: 1.45;
        }

        .submit-kind-button.active span {
          color: rgba(255, 255, 255, 0.67);
        }

        .submit-premium-form {
          padding: 32px;
          border-radius: 23px;
        }

        .submit-file-field {
          display: grid !important;
          grid-template-columns: auto 1fr;
          align-items: center;
          gap: 13px !important;
          padding: 20px;
          border: 1px dashed #b7c0ba;
          border-radius: 15px;
          background: #f9faf7;
        }

        .submit-file-field > span {
          display: flex;
          flex-direction: column;
        }

        .submit-file-field small {
          margin-top: 4px;
          color: #748078;
          font-weight: 500;
        }

        .submit-file-field input {
          grid-column: 1 / -1;
          padding: 10px;
          background: white;
        }

        .submit-premium-button {
          width: 100%;
          min-height: 54px;
          margin-top: 5px;
          border-radius: 13px;
          background: #1f316f;
          border-color: #1f316f;
        }

        .submit-premium-button:hover {
          background: #152453;
        }

        .submit-success-message {
          border-color: rgba(12, 105, 72, 0.2);
          background: #e0f2e8;
          color: #17613f;
        }

        .submit-error-message {
          border-color: rgba(163, 53, 53, 0.2);
          background: #f8e2e2;
          color: #8c2929;
        }

        @media (max-width: 850px) {
          .submit-premium-hero-inner {
            align-items: flex-start;
            flex-direction: column;
          }

          .submit-premium-layout {
            grid-template-columns: 1fr;
          }

          .submit-kind-panel {
            position: static;
          }

          .submit-kind-list {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 560px) {
          .submit-premium-hero {
            padding: 52px 0;
          }

          .submit-kind-list {
            grid-template-columns: 1fr;
          }

          .submit-premium-form {
            padding: 22px;
          }
        }
      `}</style>
    </main>
  );
}