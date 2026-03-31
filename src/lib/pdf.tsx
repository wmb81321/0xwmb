import {
  Document, Page, Text, View, StyleSheet
} from '@react-pdf/renderer'
import type { PortfolioData } from './types'

// Using built-in PDF fonts — no external files needed
const pdf = StyleSheet.create({
  page:            { fontFamily: 'Helvetica', fontSize: 8.5, color: '#111', padding: '10mm 11mm', backgroundColor: '#fff' },
  header:          { textAlign: 'center', borderBottom: '1pt solid #111', paddingBottom: 6, marginBottom: 6 },
  name:            { fontFamily: 'Helvetica-Bold', fontSize: 15, textTransform: 'uppercase', letterSpacing: 1 },
  title:           { fontSize: 9, color: '#444', marginTop: 1.5 },
  contact:         { fontSize: 7.5, color: '#666', marginTop: 2 },
  langLine:        { fontSize: 7.5, color: '#888', marginTop: 2 },
  cols:            { flexDirection: 'row', gap: 10 },
  left:            { width: '31%', paddingRight: 8, borderRight: '0.5pt solid #e5e7eb', paddingTop: 3 },
  right:           { flex: 1 },
  sectionTitle:    { fontFamily: 'Helvetica-Bold', fontSize: 7, textTransform: 'uppercase', letterSpacing: 0.8,
                     color: '#111', borderBottom: '0.5pt solid #ddd', paddingBottom: 1.5, marginBottom: 3, marginTop: 8 },
  sectionTitleSm:  { fontFamily: 'Helvetica-Bold', fontSize: 7, textTransform: 'uppercase', letterSpacing: 0.8,
                     color: '#111', borderBottom: '0.5pt solid #ddd', paddingBottom: 1.5, marginBottom: 3, marginTop: 5 },
  skillCategory:   { fontFamily: 'Helvetica-Bold', fontSize: 7, color: '#555', marginTop: 3, marginBottom: 1 },
  skillItems:      { fontSize: 7.5, color: '#444', lineHeight: 1.4 },
  entry:           { marginBottom: 4 },
  entryRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  entryTitle:      { fontFamily: 'Helvetica-Bold', fontSize: 8.5, flex: 1 },
  entryDate:       { fontSize: 7, color: '#777', marginLeft: 6, flexShrink: 0 },
  entrySub:        { fontSize: 7.5, color: '#555', marginTop: 1 },
  bullet:          { flexDirection: 'row', marginTop: 1.5, gap: 3 },
  dot:             { color: '#6366f1', fontSize: 7.5 },
  bulletText:      { fontSize: 7.5, color: '#333', flex: 1, lineHeight: 1.35 },
})

function SectionTitle({ children, sm }: { children: string; sm?: boolean }) {
  return <Text style={sm ? pdf.sectionTitleSm : pdf.sectionTitle}>{children}</Text>
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={pdf.bullet}>
      <Text style={pdf.dot}>·</Text>
      <Text style={pdf.bulletText}>{text}</Text>
    </View>
  )
}

export function CVDocument({ data }: { data: PortfolioData }) {
  const { profile, contact, experiences, projects, education, certificates, volunteering, achievements, skills, languages } = data

  const technicalSkills = skills.filter(s => s.type === 'technical')
  const softSkills      = skills.filter(s => s.type === 'soft')

  return (
    <Document>
      <Page size="A4" style={pdf.page}>

        {/* ── Header ──────────────────────────────────────────────── */}
        <View style={pdf.header}>
          <Text style={pdf.name}>{profile.name}</Text>
          <Text style={pdf.title}>{profile.title}</Text>
          <Text style={pdf.contact}>
            {contact.email}{'  ·  '}{contact.linkedin?.replace('https://linkedin.com/in/', 'linkedin.com/in/')}{'  ·  '}{contact.github?.replace('https://github.com/', 'github.com/')}{'  ·  '}{contact.twitter?.replace('https://twitter.com/', '@')}
          </Text>
          {languages.length > 0 && (
            <Text style={pdf.langLine}>
              {languages.map(l => `${l.name} (${l.level})`).join('  ·  ')}
            </Text>
          )}
        </View>

        <View style={pdf.cols}>

          {/* ── Left column ─────────────────────────────────────── */}
          <View style={pdf.left} wrap={true}>

            {/* Achievements — top of left column */}
            {achievements.length > 0 && (
              <>
                <SectionTitle sm>Achievements</SectionTitle>
                {achievements.map((a) => (
                  <View key={a.id} style={{ marginBottom: 3 }} wrap={false}>
                    <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7.5 }}>{a.title}</Text>
                    {a.year && (
                      <Text style={{ fontSize: 7, color: '#777', marginTop: 0.5 }}>{a.year}</Text>
                    )}
                    {a.description && (
                      <Text style={{ fontSize: 7, color: '#555', marginTop: 1, lineHeight: 1.35 }}>{a.description}</Text>
                    )}
                  </View>
                ))}
              </>
            )}

            <SectionTitle sm>Education</SectionTitle>
            {education.map((e) => (
              <View key={e.id} style={{ marginBottom: 3 }} wrap={false}>
                <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7.5 }}>{e.degree}</Text>
                {e.field_of_study && (
                  <Text style={{ fontSize: 7, color: '#6366f1', marginTop: 0.5 }}>{e.field_of_study}</Text>
                )}
                <Text style={pdf.entrySub}>{e.institution}</Text>
                <Text style={{ fontSize: 7, color: '#777', marginTop: 1 }}>
                  {(e.start_date || e.end_date)
                    ? `${e.start_date ?? ''}${e.end_date ? ` – ${e.end_date}` : ''}`
                    : e.years}
                </Text>
                {e.description && (
                  <Text style={{ fontSize: 7, color: '#888', marginTop: 1 }}>{e.description}</Text>
                )}
              </View>
            ))}

            {certificates.length > 0 && (
              <>
                <SectionTitle sm>Certificates</SectionTitle>
                {certificates.map((c) => (
                  <View key={c.id} style={{ marginBottom: 3 }} wrap={false}>
                    <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7.5 }}>{c.name}</Text>
                    <Text style={{ fontSize: 7, color: '#555', marginTop: 1 }}>{c.issuer}{c.year ? ` · ${c.year}` : ''}</Text>
                  </View>
                ))}
              </>
            )}

            {volunteering.length > 0 && (
              <>
                <SectionTitle sm>Volunteering</SectionTitle>
                {volunteering.map((v) => (
                  <View key={v.id} style={{ marginBottom: 3 }} wrap={false}>
                    <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7.5 }}>{v.reason}</Text>
                    {v.role && <Text style={{ fontSize: 7, color: '#6366f1', marginTop: 0.5 }}>{v.role}</Text>}
                    <Text style={{ fontSize: 7, color: '#555', marginTop: 1 }}>{v.issuer}</Text>
                  </View>
                ))}
              </>
            )}

          </View>

          {/* ── Right column ────────────────────────────────────── */}
          <View style={pdf.right} wrap={true}>

            <SectionTitle>Summary</SectionTitle>
            <Text style={{ fontSize: 8, color: '#333', lineHeight: 1.4 }}>
              {profile.summary}
            </Text>

            <SectionTitle>Experience</SectionTitle>
            {experiences.map((e) => (
              <View key={e.id} style={pdf.entry} wrap={false}>
                <View style={pdf.entryRow}>
                  <Text style={pdf.entryTitle}>{e.role} — {e.company}</Text>
                  <Text style={pdf.entryDate}>{e.years}</Text>
                </View>
                {e.points.slice(0, 3).map((pt, i) => <Bullet key={i} text={pt} />)}
              </View>
            ))}

            <SectionTitle>Projects</SectionTitle>
            {projects.map((p) => (
              <View key={p.id} style={pdf.entry} wrap={false}>
                <View style={pdf.entryRow}>
                  <Text style={pdf.entryTitle}>{p.name} · {p.role}</Text>
                  <Text style={pdf.entryDate}>
                    {(p.start_date || p.end_date)
                      ? `${p.start_date ?? ''}${p.end_date ? ` – ${p.end_date}` : ''}`
                      : p.years}
                  </Text>
                </View>
                {p.brief && <Text style={{ ...pdf.entrySub, marginTop: 1 }}>{p.brief}</Text>}
              </View>
            ))}

            {technicalSkills.length > 0 && (
              <>
                <SectionTitle>Technical Skills</SectionTitle>
                {technicalSkills.map((sk) => (
                  <View key={sk.id} style={{ marginBottom: 3 }} wrap={false}>
                    <Text style={pdf.skillCategory}>{sk.category}</Text>
                    <Text style={pdf.skillItems}>{sk.items.join(', ')}</Text>
                  </View>
                ))}
              </>
            )}

            {softSkills.length > 0 && (
              <>
                <View style={{ marginTop: 6 }} />
                <SectionTitle>Core Competencies</SectionTitle>
                {softSkills.map((sk) => (
                  <View key={sk.id} style={{ marginBottom: 3 }} wrap={false}>
                    <Text style={pdf.skillCategory}>{sk.category}</Text>
                    <Text style={pdf.skillItems}>{sk.items.join(', ')}</Text>
                  </View>
                ))}
              </>
            )}

          </View>
        </View>
      </Page>
    </Document>
  )
}
