import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import type { AuditionData } from '@/types/audition';

const RED = '#FF0000';
const BLACK = '#111111';
const GRAY = '#555555';
const LIGHT = '#888888';
const BORDER = '#CCCCCC';
const WHITE = '#FFFFFF';
const LIGHT_BG = '#F8F8F8';

// Compact scale tuned for single A4 page (595 × 842 pt).
const s = StyleSheet.create({
  page: {
    backgroundColor: WHITE,
    paddingTop: 0,
    paddingBottom: 28,
    paddingHorizontal: 0,
    fontFamily: 'Helvetica',
    fontSize: 8,
    color: BLACK,
  },
  // ── Header bar ──
  headerBar: {
    backgroundColor: RED,
    paddingHorizontal: 32,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  headerLeft: { flexDirection: 'column' },
  headerBrand: { fontSize: 7, color: '#FFCCCC', letterSpacing: 2, marginBottom: 2 },
  headerTitle: { fontFamily: 'Helvetica-Bold', fontSize: 13, color: WHITE, letterSpacing: 2 },
  headerDate: { fontSize: 6.5, color: '#FFCCCC', letterSpacing: 1 },
  // ── Section wrapper ──
  section: { marginHorizontal: 32, marginBottom: 10 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    borderBottomWidth: 0.75,
    borderBottomColor: RED,
    borderBottomStyle: 'solid',
    paddingBottom: 3,
  },
  badge: {
    backgroundColor: RED,
    width: 14, height: 14,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 6,
  },
  badgeText: { color: WHITE, fontSize: 7, fontFamily: 'Helvetica-Bold' },
  sectionTitle: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: BLACK, letterSpacing: 1.5 },
  // ── Field ──
  row: { flexDirection: 'row', marginBottom: 5, gap: 10 },
  field: { flex: 1 },
  fieldLabel: {
    fontSize: 5.5, color: LIGHT, letterSpacing: 0.8,
    marginBottom: 3, textTransform: 'uppercase',
  },
  fieldValue: {
    fontSize: 7.5, color: BLACK,
    borderBottomWidth: 0.5, borderBottomColor: BORDER, borderBottomStyle: 'solid',
    paddingBottom: 2, minHeight: 12,
  },
  fieldValueEmpty: {
    fontSize: 7.5, color: LIGHT,
    borderBottomWidth: 0.5, borderBottomColor: BORDER, borderBottomStyle: 'solid',
    paddingBottom: 2, minHeight: 12,
  },
  // ── Photo ──
  photoBox: {
    width: 72, borderWidth: 0.5, borderColor: BORDER, borderStyle: 'solid',
    alignItems: 'center', justifyContent: 'center', minHeight: 90,
  },
  photo: { width: 72, height: 90 },
  photoPlaceholderText: { fontSize: 6, color: LIGHT, textAlign: 'center', padding: 4 },
  // ── Checkboxes ──
  checkRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  checkbox: {
    width: 8, height: 8,
    borderWidth: 0.75, borderColor: GRAY, borderStyle: 'solid',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxFilled: { backgroundColor: RED, borderColor: RED },
  checkMark: { fontSize: 5.5, color: WHITE },
  checkLabel: { fontSize: 7, color: BLACK },
  // ── Two-column block ──
  twoCol: { flexDirection: 'row', gap: 20 },
  col: { flex: 1 },
  // ── Bullet points (About You / Experience) ──
  bulletBlock: {
    borderWidth: 0.5, borderColor: BORDER, borderStyle: 'solid',
    backgroundColor: LIGHT_BG, padding: 5, minHeight: 55,
  },
  bulletLine: { fontSize: 7.5, color: BLACK, lineHeight: 1.6, marginBottom: 1 },
  bulletEmpty: { fontSize: 7.5, color: LIGHT },
  // ── Agreement ──
  agreementText: { fontSize: 6.5, color: GRAY, lineHeight: 1.5, marginBottom: 6 },
  sigRow: { flexDirection: 'row', gap: 20, marginTop: 4 },
  agreedRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  agreedLabel: { fontSize: 7, color: BLACK },
  // ── Footer ──
  pageFooter: {
    position: 'absolute', bottom: 10, left: 32, right: 32,
    flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 0.5, borderTopColor: BORDER, borderTopStyle: 'solid',
    paddingTop: 3,
  },
  footerText: { fontSize: 5.5, color: LIGHT, letterSpacing: 0.5 },
});

// ─── helpers ────────────────────────────────────────────────────────────────

function SectionHeader({ num, title }: { num: number; title: string }) {
  return (
    <View style={s.sectionHeader}>
      <View style={s.badge}><Text style={s.badgeText}>{num}</Text></View>
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  );
}

function Field({ label, value, flex = 1 }: { label: string; value: string; flex?: number }) {
  return (
    <View style={[s.field, { flex }]}>
      <Text style={s.fieldLabel}>{label}</Text>
      <Text style={value ? s.fieldValue : s.fieldValueEmpty}>{value || '—'}</Text>
    </View>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View style={s.row}>{children}</View>;
}

function CheckItem({ label, checked }: { label: string; checked: boolean }) {
  return (
    <View style={s.checkItem}>
      <View style={[s.checkbox, checked ? s.checkboxFilled : {}]}>
        {checked && <Text style={s.checkMark}>✓</Text>}
      </View>
      <Text style={s.checkLabel}>{label}</Text>
    </View>
  );
}

// Renders the \n-separated bullet string as individual Text lines.
function BulletBlock({ value }: { value: string }) {
  const lines = value ? value.split('\n').filter(Boolean) : [];
  return (
    <View style={s.bulletBlock}>
      {lines.length > 0
        ? lines.map((line, i) => <Text key={i} style={s.bulletLine}>{line}</Text>)
        : <Text style={s.bulletEmpty}>—</Text>
      }
    </View>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

export function AuditionPDF({ data }: { data: AuditionData }) {
  const submittedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <Document
      title={`Orion Model Hunt — Registration — ${data.fullName}`}
      author="A7 Entertainment"
    >
      <Page size="A4" style={s.page}>

        {/* ── Header ── */}
        <View style={s.headerBar} fixed>
          <View style={s.headerLeft}>
            <Text style={s.headerBrand}>A7 ENTERTAINMENT</Text>
            <Text style={s.headerTitle}>REGISTRATION — ORION MODEL HUNT</Text>
          </View>
          <Text style={s.headerDate}>{submittedAt} IST</Text>
        </View>

        {/* ── Section 1 – Personal Information ── */}
        <View style={s.section}>
          <SectionHeader num={1} title="PERSONAL INFORMATION" />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Row>
                <Field label="Full Name" value={data.fullName} />
              </Row>
              <Row>
                <Field label="Date of Birth" value={data.dob} />
                <Field label="Age" value={data.age} />
                <Field label="Nationality" value={data.nationality} />
                <Field label="Ethnicity" value={data.ethnicity} />
              </Row>
              <View style={{ marginBottom: 5 }}>
                <Text style={s.fieldLabel}>GENDER</Text>
                <View style={s.checkRow}>
                  {['MALE', 'FEMALE', 'NON-BINARY', 'OTHER'].map((g) => (
                    <CheckItem key={g} label={g} checked={data.gender.includes(g)} />
                  ))}
                </View>
              </View>
              <Row>
                <Field label="Blood Type" value={data.bloodType} />
                <Field label="Phone" value={data.phone} />
              </Row>
              <Row>
                <Field label="E-Mail" value={data.email} />
                <Field label="Address" value={data.address} />
              </Row>
            </View>
            {/* Photo */}
            <View style={{ width: 75 }}>
              <Text style={[s.fieldLabel, { textAlign: 'center', marginBottom: 3 }]}>PHOTO</Text>
              {data.photoBase64
                ? <Image style={s.photo} src={data.photoBase64} />
                : <View style={s.photoBox}><Text style={s.photoPlaceholderText}>No photo{'\n'}provided</Text></View>
              }
            </View>
          </View>
        </View>

        {/* ── Section 2 – Measurements ── */}
        <View style={s.section}>
          <SectionHeader num={2} title="MEASUREMENTS" />
          <View style={s.twoCol}>
            <View style={s.col}>
              <Row>
                <Field label="Weight" value={data.measureWeight} />
                <Field label="Height Without Heels" value={data.heightWithoutHeels} />
              </Row>
              <Row>
                <Field label="Height With Heels" value={data.heightWithHeels} />
                <Field label="Bust / Chest" value={data.bustChest} />
              </Row>
              <Row>
                <Field label="Upper Waist" value={data.upperWaist} />
                <Field label="Lower Waist" value={data.lowerWaist} />
              </Row>
            </View>
            <View style={s.col}>
              <Row>
                <Field label="Hips" value={data.hips} />
                <Field label="Hair" value={data.hair} />
              </Row>
              <Row>
                <Field label="Eyes" value={data.eyes} />
                <Field label="Complexion" value={data.complexion} />
              </Row>
              <Row><Field label="Body Type" value={data.bodyType} /></Row>
            </View>
          </View>
        </View>

        {/* ── Sections 3 & 4 – Audition Category + Language Skills ── */}
        <View style={[s.section, { flexDirection: 'row', gap: 20 }]}>
          <View style={{ flex: 1 }}>
            <SectionHeader num={3} title="AUDITION CATEGORY" />
            <View style={s.checkRow}>
              {['RAMP', 'CATALOGUE', 'MOVIES', 'WEB SERIES', 'MUSIC'].map((c) => (
                <CheckItem key={c} label={c} checked={data.auditionCategories.includes(c)} />
              ))}
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <SectionHeader num={4} title="LANGUAGE SKILLS" />
            <Text style={data.languageSkills ? s.fieldValue : s.fieldValueEmpty}>
              {data.languageSkills || '—'}
            </Text>
          </View>
        </View>

        {/* ── Sections 5 & 6 – About You + Experience ── */}
        <View style={[s.section, { flexDirection: 'row', gap: 20 }]}>
          <View style={{ flex: 1 }}>
            <SectionHeader num={5} title="ABOUT YOU" />
            <BulletBlock value={data.aboutYou} />
          </View>
          <View style={{ flex: 1 }}>
            <SectionHeader num={6} title="EXPERIENCE" />
            <BulletBlock value={data.experience} />
          </View>
        </View>

        {/* ── Sections 7 & 8 – Skills + Audition Link ── */}
        <View style={[s.section, { flexDirection: 'row', gap: 20 }]}>
          <View style={{ flex: 1 }}>
            <SectionHeader num={7} title="SKILLS" />
            <View style={s.twoCol}>
              <View style={s.col}>
                <Row><Field label="Skill 1" value={data.skill1} /></Row>
                <Row><Field label="Skill 3" value={data.skill3} /></Row>
              </View>
              <View style={s.col}>
                <Row><Field label="Skill 2" value={data.skill2} /></Row>
                <Row><Field label="Skill 4" value={data.skill4} /></Row>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <SectionHeader num={8} title="AUDITION LINK" />
            <Row><Field label="Audition Video / Reel URL" value={data.auditionLink} /></Row>
          </View>
        </View>

        {/* ── Sections 9 & 10 – Social Media + Agreement ── */}
        <View style={[s.section, { flexDirection: 'row', gap: 20 }]}>
          <View style={{ flex: 1 }}>
            <SectionHeader num={9} title="SOCIAL MEDIA" />
            <Row><Field label="Instagram" value={data.instagram} /></Row>
            <Row><Field label="Snapchat" value={data.snapchat} /></Row>
            <Row><Field label="Threads" value={data.threads} /></Row>
            <Row><Field label="Other" value={data.otherSocial} /></Row>
          </View>
          <View style={{ flex: 1 }}>
            <SectionHeader num={10} title="AGREEMENT" />
            <Text style={s.agreementText}>
              I HEREBY DECLARE THAT THE INFORMATION PROVIDED ABOVE IS TRUE AND ACCURATE.
              I UNDERSTAND THAT A7 ENTERTAINMENT RESERVES THE RIGHT TO USE MY INFORMATION
              AND PHOTOS/VIDEOS FOR AUDITION PURPOSES ONLY.
              I AGREE TO THE TERMS AND CONDITIONS SET BY A7 ENTERTAINMENT.
            </Text>
            <View style={s.agreedRow}>
              <View style={[s.checkbox, data.agreedToTerms ? s.checkboxFilled : {}]}>
                {data.agreedToTerms && <Text style={s.checkMark}>✓</Text>}
              </View>
              <Text style={s.agreedLabel}>I agree to the above terms.</Text>
            </View>
            <View style={s.sigRow}>
              <Field label="Applicant Signature (Full Name)" value={data.signatureName} />
              <Field label="Date" value={data.signatureDate} />
            </View>
          </View>
        </View>

        {/* ── Footer ── */}
        <View style={s.pageFooter} fixed>
          <Text style={s.footerText}>A7 ENTERTAINMENT — ORION MODEL HUNT — CONFIDENTIAL</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) =>
            `PAGE ${pageNumber} OF ${totalPages}`
          } />
        </View>

      </Page>
    </Document>
  );
}
