import { Document, Page, Text, View, Link, Image, StyleSheet, Font } from '@react-pdf/renderer'
import type { PortfolioData, Skill } from './types'

/*
 * ATS-friendly CV: one column, real text in reading order, standard section
 * names (Summary, Languages, Experience, Education, Skills, Certifications, Awards,
 * Volunteering), no tables, icons or images. Built-in Helvetica only.
 * Colours mirror the Prospectus tokens in DESIGN.md (react-pdf cannot read CSS vars).
 */
// Never split words: hyphenated fragments read as sloppy and confuse ATS keyword matching.
const noSplit = (word: string) => [word]
Font.registerHyphenationCallback(noSplit)

const C = {
  ink: '#0d1117',     // ink
  muted: '#4a5260',   // ink-muted
  rule: '#c9ccd2',    // rule
  accent: '#123a8c',  // inst
}

/** WM seal, the personal brand mark (navy ink, transparent), from Storage `v2/brand/`. */
const SEAL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio-assets/v2/brand/wm-seal-ink.png`

const pdf = StyleSheet.create({
  page:        { fontFamily: 'Helvetica', fontSize: 9.5, lineHeight: 1.4, color: C.ink, paddingTop: '15mm', paddingBottom: '15mm', paddingHorizontal: '17mm' },
  header:      { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  headerText:  { flex: 1, paddingRight: 16 },
  seal:        { width: 52, height: 52 },
  name:        { fontFamily: 'Helvetica-Bold', fontSize: 22, letterSpacing: -0.3, lineHeight: 1.1 },
  headline:    { fontSize: 11, color: C.accent, marginTop: 4 },
  contact:     { fontSize: 8.5, color: C.muted, marginTop: 6 },
  link:        { color: C.muted, textDecoration: 'none' },
  orgLink:     { color: C.accent, textDecoration: 'none' },
  sep:         { color: C.rule },
  section:     { marginTop: 13 },
  heading:     { fontFamily: 'Helvetica-Bold', fontSize: 9.5, textTransform: 'uppercase', color: C.accent,
                 paddingBottom: 3, borderBottomWidth: 0.75, borderBottomColor: C.rule, marginBottom: 6 },
  summary:     { fontSize: 9.5, lineHeight: 1.5 },
  entry:       { marginBottom: 9 },
  entryRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  role:        { fontFamily: 'Helvetica-Bold', fontSize: 10, flex: 1, paddingRight: 8 },
  date:        { fontSize: 8.5, color: C.muted },
  brief:       { marginTop: 3 },
  bullet:      { flexDirection: 'row', marginTop: 2.5 },
  bulletMark:  { width: 10, color: C.muted },
  bulletText:  { flex: 1 },
  line:        { flexDirection: 'row', marginBottom: 3 },
  lineLabel:   { fontFamily: 'Helvetica-Bold', width: 150, paddingRight: 8 },
  lineValue:   { flex: 1, color: C.ink },
  small:       { fontSize: 8.5, color: C.muted },
})

/** "2025" + "Present" → "2025 – Present"; falls back to the free-text years. */
function range(start?: string | null, end?: string | null, years?: string | null) {
  const year = (d?: string | null) => d?.match(/\d{4}/)?.[0] ?? d ?? ''
  if (start || end) return [year(start), end && /present/i.test(end) ? 'Present' : year(end)].filter(Boolean).join(' – ')
  return years ?? ''
}

/** Single-year span for programmes stored with day-level dates. */
function eduYears(start?: string | null, end?: string | null, years?: string | null) {
  if (years) return years.replace(/\s*[-–—]\s*/, ' – ')
  const ys = [start, end].map((d) => d?.match(/\d{4}/)?.[0]).filter(Boolean) as string[]
  const uniq = [...new Set(ys)]
  return uniq.join(' – ')
}

/** `keep` holds a short section on one page so no lone row is orphaned. */
function Section({ title, keep, children }: { title: string; keep?: boolean; children: React.ReactNode }) {
  return (
    <View style={pdf.section} wrap={!keep}>
      <Text style={pdf.heading} minPresenceAhead={40}>{title}</Text>
      {children}
    </View>
  )
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={pdf.bullet}>
      <Text style={pdf.bulletMark}>•</Text>
      <Text hyphenationCallback={noSplit} style={pdf.bulletText}>{text}</Text>
    </View>
  )
}

/** Organisation name, hyperlinked to its site when one is on file. */
function Org({ name, href }: { name: string; href?: string | null }) {
  return href ? <Link src={href} style={pdf.orgLink}>{name}</Link> : <Text>{name}</Text>
}

function Entry({ role, org, href, dates, brief, points }: {
  role: string; org: string; href?: string | null; dates: string; brief?: string | null; points?: string[]
}) {
  const lines = points?.filter(Boolean) ?? []
  return (
    <View style={pdf.entry} wrap={false}>
      <View style={pdf.entryRow}>
        {/* "Role, Organisation" on one line: saves a line and parses cleanly in ATS. */}
        <Text style={pdf.role}>{role}, <Org name={org} href={href} /></Text>
        <Text style={pdf.date}>{dates}</Text>
      </View>
      {brief ? <Text hyphenationCallback={noSplit} style={pdf.brief}>{brief}</Text> : null}
      {/* A single point reads as a plain line, like a venture brief; several become bullets. */}
      {lines.length === 1
        ? <Text hyphenationCallback={noSplit} style={pdf.brief}>{lines[0]}</Text>
        : lines.map((pt, i) => <Bullet key={i} text={pt} />)}
    </View>
  )
}

function SkillLine({ skill }: { skill: Skill }) {
  return (
    <View style={pdf.line} wrap={false}>
      <Text style={pdf.lineLabel}>{skill.category}</Text>
      <Text hyphenationCallback={noSplit} style={pdf.lineValue}>{skill.items.join(', ')}</Text>
    </View>
  )
}

const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

export function CVDocument({ data }: { data: PortfolioData }) {
  const { profile, contact, experiences, projects, education, certificates, volunteering, skills, languages } = data
  const achievements = data.achievements.filter((a) => a.type === 'achievement')

  // Ventures first (current roles), then employment, each in its admin order.
  const ventures = [...projects].sort((a, b) => a.order - b.order)
  const jobs = [...experiences].sort((a, b) => a.order - b.order)

  // Same split as the site: competencies (no tool marks) vs tools (any item has a mark).
  const byOrder = (a: Skill, b: Skill) => a.order - b.order
  const isTools = (s: Skill) => s.items.some((item) => s.logos?.[item])
  const filled = skills.filter((s) => s.items?.length).sort(byOrder)
  const competencies = filled.filter((s) => !isTools(s))
  const tools = filled.filter(isTools)

  const contactItems = [
    { label: 'Cali, Colombia' },
    contact.email && { label: contact.email, href: `mailto:${contact.email}` },
    contact.linkedin && { label: bare(contact.linkedin), href: contact.linkedin },
    contact.github && { label: bare(contact.github), href: contact.github },
  ].filter((c): c is { label: string; href?: string } => Boolean(c && c.label))

  return (
    <Document title={`${profile.name} CV`} author={profile.name} subject={profile.title}
      keywords="Technical Product Manager, Product Manager, Crypto, Blockchain, Fintech, AI, DeFi, Tokenization, Ethereum">
      <Page size="A4" style={pdf.page}>

        {/* Header: name, headline and contact left; the WM seal right. */}
        <View style={pdf.header}>
          <View style={pdf.headerText}>
            <Text style={pdf.name}>{profile.name}</Text>
            <Text style={pdf.headline}>{profile.title.replace(/\s*·\s*/g, ' | ')}</Text>
            <Text style={pdf.contact}>
              {contactItems.map((c, i) => (
                <Text key={c.label}>
                  {i > 0 && <Text style={pdf.sep}>{'\u00a0\u00a0|\u00a0\u00a0'}</Text>}
                  {c.href ? <Link src={c.href} style={pdf.link}>{c.label}</Link> : c.label}
                </Text>
              ))}
            </Text>
          </View>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt; the mark is decorative */}
          <Image src={SEAL} style={pdf.seal} />
        </View>

        <Section title="Summary">
          <Text hyphenationCallback={noSplit} style={pdf.summary}>{profile.summary}</Text>
        </Section>

        {languages.length > 0 && (
          <Section title="Languages" keep>
            <Text>
              {languages.map((l) => `${l.name} (${l.level.replace(/\s*[-–—]\s*/, ', ')})`).join('   |   ')}
            </Text>
          </Section>
        )}

        <Section title="Experience">
          {ventures.map((p) => (
            <Entry key={`p${p.id}`} role={p.role} org={p.name} href={p.website}
              dates={range(p.start_date, p.end_date, p.years)} brief={p.brief} points={p.points} />
          ))}
          {jobs.map((e) => (
            <Entry key={`e${e.id}`} role={e.role.replace(/\s*&\s*/g, ' and ')} org={e.company} href={e.website}
              dates={e.years} points={e.points?.slice(0, 3)} />
          ))}
        </Section>

        <Section title="Education">
          {[...education].sort((a, b) => a.order - b.order).map((e) => (
            <View key={e.id} style={pdf.entry} wrap={false}>
              <View style={pdf.entryRow}>
                <Text style={pdf.role}>
                  {e.degree}{e.field_of_study ? `, ${e.field_of_study}` : ''}
                  {e.description ? <Text style={{ fontFamily: 'Helvetica', color: C.muted }}> ({e.description})</Text> : null}
                  , <Org name={e.institution} href={e.website} />
                </Text>
                <Text style={pdf.date}>{eduYears(e.start_date, e.end_date, e.years)}</Text>
              </View>
            </View>
          ))}
        </Section>


        {competencies.length > 0 && (
          <Section title="Skills" keep>
            {competencies.map((s) => <SkillLine key={s.id} skill={s} />)}
          </Section>
        )}

        {tools.length > 0 && (
          <Section title="Tools and Technologies">
            {tools.map((s) => <SkillLine key={s.id} skill={s} />)}
          </Section>
        )}


        {certificates.length > 0 && (
          <Section title="Certifications">
            {certificates.map((c) => (
              <View key={c.id} style={[pdf.entryRow, { marginBottom: 3 }]} wrap={false}>
                <Text style={pdf.bulletText}><Text style={{ fontFamily: 'Helvetica-Bold' }}>{c.name}</Text>, <Org name={c.issuer} href={c.website} /></Text>
                <Text style={pdf.date}>{c.year}</Text>
              </View>
            ))}
          </Section>
        )}

        {achievements.length > 0 && (
          <Section title="Awards">
            {achievements.map((a) => (
              <View key={a.id} style={[pdf.entryRow, { marginBottom: 3 }]} wrap={false}>
                <Text style={pdf.bulletText}>
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>{a.title}</Text>{a.description ? `, ${a.description}` : ''}
                </Text>
                <Text style={pdf.date}>{a.year}</Text>
              </View>
            ))}
          </Section>
        )}

        {volunteering.length > 0 && (
          <Section title="Volunteering">
            {[...volunteering].sort((a, b) => Number(b.year ?? 0) - Number(a.year ?? 0)).map((v) => (
              <View key={v.id} style={[pdf.entryRow, { marginBottom: 3 }]} wrap={false}>
                <Text style={pdf.bulletText}>
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>{v.reason.trim()}</Text>, {v.issuer.trim()}
                </Text>
                <Text style={pdf.date}>{v.year}</Text>
              </View>
            ))}
          </Section>
        )}


      </Page>
    </Document>
  )
}
