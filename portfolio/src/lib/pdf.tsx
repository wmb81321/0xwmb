import {
  Document, Page, Text, View, StyleSheet, Font
} from '@react-pdf/renderer'
import type { PortfolioData } from './types'

// react-pdf requires .ttf/.otf — NOT .woff/.woff2 (those will crash at render time)
// Fonts must exist at portfolio/public/fonts/Inter-Regular.ttf and Inter-Bold.ttf
Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Inter-Bold.ttf', fontWeight: 700 },
  ],
})

// Named 'pdf' to avoid shadowing arrow-function parameter names
const pdf = StyleSheet.create({
  page: { fontFamily: 'Inter', fontSize: 9, color: '#111', padding: '12mm 12mm', backgroundColor: '#fff' },
  header: { textAlign: 'center', borderBottom: '1.5pt solid #111', paddingBottom: 8, marginBottom: 8 },
  name: { fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 10, color: '#444', marginTop: 2 },
  contact: { fontSize: 8, color: '#666', marginTop: 3 },
  cols: { flexDirection: 'row', gap: 12, flex: 1 },
  left: { width: '30%', paddingRight: 10, borderRight: '0.5pt solid #e5e7eb' },
  right: { flex: 1 },
  sectionTitle: { fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#111', borderBottom: '0.5pt solid #ddd', paddingBottom: 2, marginBottom: 5, marginTop: 10 },
  entry: { marginBottom: 7 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  entryTitle: { fontWeight: 700, fontSize: 9 },
  entryDate: { fontSize: 7.5, color: '#777' },
  entrySub: { fontSize: 8, color: '#555', marginTop: 1 },
  bullet: { flexDirection: 'row', marginTop: 2, gap: 4 },
  dot: { color: '#6366f1', fontSize: 8 },
  bulletText: { fontSize: 8, color: '#333', flex: 1, lineHeight: 1.4 },
  tag: { backgroundColor: '#f3f4f6', color: '#374151', fontSize: 7, padding: '1pt 4pt', marginRight: 3, marginBottom: 3, borderRadius: 2 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 },
})

function SectionTitle({ children }: { children: string }) {
  return <Text style={pdf.sectionTitle}>{children}</Text>
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
  const { profile, contact, experiences, projects, education, certificates, volunteering, skills, languages } = data
  const technical = skills.filter((sk) => sk.type === 'technical')
  const soft = skills.filter((sk) => sk.type === 'soft')

  return (
    <Document>
      <Page size="A4" style={pdf.page}>
        <View style={pdf.header}>
          <Text style={pdf.name}>{profile.name}</Text>
          <Text style={pdf.title}>{profile.title}</Text>
          <Text style={pdf.contact}>
            {contact.email} · {contact.linkedin?.replace('https://', '')} · {contact.github?.replace('https://', '')}
          </Text>
        </View>

        <View style={pdf.cols}>
          <View style={pdf.left}>
            <SectionTitle>Education</SectionTitle>
            {education.map((e) => (
              <View key={e.id} style={pdf.entry}>
                <Text style={pdf.entryTitle}>{e.degree}</Text>
                <Text style={pdf.entrySub}>{e.institution}</Text>
                <Text style={pdf.entryDate}>{e.years}</Text>
                {e.abroad_program && <Text style={{ ...pdf.entrySub, fontStyle: 'italic' }}>{e.abroad_program}</Text>}
              </View>
            ))}

            <SectionTitle>Skills</SectionTitle>
            {[...technical, ...soft].map((sk) => (
              <View key={sk.id} style={{ marginBottom: 5 }}>
                <Text style={{ fontSize: 7.5, fontWeight: 700, color: '#444', marginBottom: 2 }}>{sk.category}</Text>
                <View style={pdf.tagsRow}>
                  {sk.items.map((item) => <Text key={item} style={pdf.tag}>{item}</Text>)}
                </View>
              </View>
            ))}

            <SectionTitle>Languages</SectionTitle>
            {languages.map((l) => (
              <Text key={l.id} style={{ fontSize: 8, marginBottom: 2 }}>{l.flag} {l.name} — {l.level}</Text>
            ))}

            <SectionTitle>Certificates</SectionTitle>
            {certificates.map((c) => (
              <View key={c.id} style={pdf.entry}>
                <Text style={{ fontSize: 8, fontWeight: 700 }}>{c.name}</Text>
                <Text style={pdf.entrySub}>{c.issuer} · {c.year}</Text>
              </View>
            ))}
          </View>

          <View style={pdf.right}>
            <SectionTitle>Professional Summary</SectionTitle>
            <Text style={{ fontSize: 8.5, color: '#333', lineHeight: 1.5 }}>{profile.summary}</Text>

            <SectionTitle>Experience</SectionTitle>
            {experiences.map((e) => (
              <View key={e.id} style={pdf.entry}>
                <View style={pdf.entryHeader}>
                  <Text style={pdf.entryTitle}>{e.role} — {e.company}</Text>
                  <Text style={pdf.entryDate}>{e.years}</Text>
                </View>
                {e.points.map((pt, i) => <Bullet key={i} text={pt} />)}
              </View>
            ))}

            <SectionTitle>Projects</SectionTitle>
            {projects.map((p) => (
              <View key={p.id} style={pdf.entry}>
                <View style={pdf.entryHeader}>
                  <Text style={pdf.entryTitle}>{p.name} · {p.role}</Text>
                  <Text style={pdf.entryDate}>{p.years}</Text>
                </View>
                {p.points.slice(0, 2).map((pt, i) => <Bullet key={i} text={pt} />)}
              </View>
            ))}

            <SectionTitle>Volunteering</SectionTitle>
            {volunteering.map((v) => (
              <View key={v.id} style={pdf.entry}>
                <Text style={pdf.entryTitle}>{v.name}</Text>
                <Text style={pdf.entrySub}>{v.issuer}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  )
}
