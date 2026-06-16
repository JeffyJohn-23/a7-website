import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import type { AuditionData } from '@/types/audition';

const RED = '#FF0000';
const BLACK = '#111111';
const GRAY = '#555555';
const LIGHT = '#888888';
const BORDER = '#CCCCCC';
const WHITE = '#FFFFFF';

const s = StyleSheet.create({
  page: {
    backgroundColor: WHITE,
    paddingTop: 0,
    paddingBottom: 36,
    paddingHorizontal: 0,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: BLACK,
  },
  // ── Header bar ──
  headerBar: {
    backgroundColor: RED,
    paddingHorizontal: 36,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  headerLeft: { flexDirection: 'column' },
  headerTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 16,
    color: WHITE,
    letterSpacing: 3,
  },
  headerSub: {
    fontSize: 7,
    color: '#FFCCCC',
    letterSpacing: 2,
    marginTop: 2,
  },
  headerDate: {
    fontSize: 7,
    color: '#FFCCCC',
    letterSpacing: 1,
  },
  // ── Section ──
  section: {
    marginHorizontal: 36,
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: RED,
    borderBottomStyle: 'solid',
    paddingBottom: 4,
  },
  badge: {
    backgroundColor: RED,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  badgeText: {
    color: WHITE,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: BLACK,
    letterSpacing: 2,
  },
  // ── Field ──
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 12,
  },
  field: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 6,
    color: LIGHT,
    letterSpacing: 1,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  fieldValue: {
    fontSize: 8.5,
    color: BLACK,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
    borderBottomStyle: 'solid',
    paddingBottom: 2,
    minHeight: 13,
  },
  fieldValueEmpty: {
    fontSize: 8.5,
    color: LIGHT,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
    borderBottomStyle: 'solid',
    paddingBottom: 2,
    minHeight: 13,
  },
  // ── Photo ──
  photoBox: {
    width: 80,
    borderWidth: 0.5,
    borderColor: BORDER,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  photo: { width: 80, height: 100 },
  photoPlaceholderText: { fontSize: 7, color: LIGHT, textAlign: 'center', padding: 4 },
  // ── Checkboxes ──
  checkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 6,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  checkbox: {
    width: 9,
    height: 9,
    borderWidth: 0.75,
    borderColor: GRAY,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxFilled: {
    backgroundColor: RED,
    borderColor: RED,
  },
  checkMark: { fontSize: 6, color: WHITE },
  checkLabel: { fontSize: 8, color: BLACK },
  // ── Two-column ──
  twoCol: {
    flexDirection: 'row',
    gap: 24,
  },
  col: { flex: 1 },
  // ── Textarea values ──
  blockValue: {
    fontSize: 8.5,
    color: BLACK,
    borderWidth: 0.5,
    borderColor: BORDER,
    borderStyle: 'solid',
    padding: 6,
    minHeight: 50,
    lineHeight: 1.5,
  },
  // ── Agreement ──
  agreementText: {
    fontSize: 7,
    color: GRAY,
    lineHeight: 1.5,
    marginBottom: 10,
  },
  sigRow: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 6,
  },
  // ── Footer ──
  pageFooter: {
    position: 'absolute',
    bottom: 14,
    left: 36,
    right: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: BORDER,
    borderTopStyle: 'solid',
    paddingTop: 4,
  },
  footerText: { fontSize: 6, color: LIGHT, letterSpacing: 0.5 },
});

// ─── helpers ────────────────────────────────────────────────────────────────

function SectionHeader({ num, title }: { num: number; title: string }) {
  return (
    <View style={s.sectionHeader}>
      <View style={s.badge}>
        <Text style={s.badgeText}>{num}</Text>
      </View>
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

// ─── main component ──────────────────────────────────────────────────────────

export function AuditionPDF({ data }: { data: AuditionData }) {
  const submittedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Document
      title={`A7 Entertainment — Model Registration — ${data.fullName}`}
      author="A7 Entertainment"
    >
      <Page size="A4" style={s.page}>
        {/* ── Header ── */}
        <View style={s.headerBar} fixed>
          <View style={s.headerLeft}>
            <Text style={s.headerTitle}>A7 ENTERTAINMENT</Text>
            <Text style={s.headerSub}>MODEL REGISTRATION APPLICATION</Text>
          </View>
          <Text style={s.headerDate}>{submittedAt} IST</Text>
        </View>

        {/* ── Section 1 – Personal Information ── */}
        <View style={s.section}>
          <SectionHeader num={1} title="PERSONAL INFORMATION" />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {/* Left column fields */}
            <View style={{ flex: 1 }}>
              <Row>
                <Field label="Full Name" value={data.fullName} />
              </Row>
              <Row>
                <Field label="Stage Name (if any)" value={data.stageName} />
              </Row>
              <Row>
                <Field label="Date of Birth" value={data.dob} />
                <Field label="Age" value={data.age} />
              </Row>
              <Row>
                <Field label="Nationality" value={data.nationality} />
                <Field label="Ethnicity" value={data.ethnicity} />
              </Row>
              {/* Gender checkboxes */}
              <View style={{ marginBottom: 8 }}>
                <Text style={s.fieldLabel}>GENDER</Text>
                <View style={s.checkRow}>
                  {['MALE', 'FEMALE', 'NON-BINARY', 'OTHER'].map((g) => (
                    <CheckItem key={g} label={g} checked={data.gender.includes(g)} />
                  ))}
                </View>
              </View>
              <Row>
                <Field label="Height" value={data.height} />
                <Field label="Weight" value={data.weight} />
              </Row>
              <Row>
                <Field label="Blood Type" value={data.bloodType} />
                <Field label="Phone Number" value={data.phone} />
              </Row>
              <Row>
                <Field label="E-Mail" value={data.email} />
              </Row>
              <Row>
                <Field label="Address" value={data.address} />
              </Row>
            </View>
            {/* Photo */}
            <View style={{ width: 90 }}>
              <Text style={[s.fieldLabel, { textAlign: 'center', marginBottom: 4 }]}>
                PHOTO (4×5cm) / ID / SELFIE
              </Text>
              {data.photoBase64 ? (
                <Image style={s.photo} src={data.photoBase64} />
              ) : (
                <View style={s.photoBox}>
                  <Text style={s.photoPlaceholderText}>No photo{'\n'}provided</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* ── Section 2 – Measurements ── */}
        <View style={s.section}>
          <SectionHeader num={2} title="MEASUREMENTS" />
          <View style={s.twoCol}>
            <View style={s.col}>
              <Row><Field label="Weight" value={data.measureWeight} /></Row>
              <Row><Field label="Height Without Heels" value={data.heightWithoutHeels} /></Row>
              <Row><Field label="Height With Heels" value={data.heightWithHeels} /></Row>
              <Row><Field label="Hobby" value={data.hobby} /></Row>
              <Row><Field label="Email ID" value={data.emailId} /></Row>
            </View>
            <View style={s.col}>
              <Row><Field label="Hair" value={data.hair} /></Row>
              <Row><Field label="Eyes" value={data.eyes} /></Row>
              <Row><Field label="Complexion" value={data.complexion} /></Row>
              <Row><Field label="Bust / Chest" value={data.bustChest} /></Row>
              <Row><Field label="Upper Waist" value={data.upperWaist} /></Row>
              <Row><Field label="Lower Waist" value={data.lowerWaist} /></Row>
              <Row><Field label="Hips" value={data.hips} /></Row>
              <Row><Field label="Body Type" value={data.bodyType} /></Row>
            </View>
          </View>
        </View>

        {/* ── Section 3 – Audition Category ── */}
        <View style={s.section}>
          <SectionHeader num={3} title="AUDITION CATEGORY" />
          <View style={s.checkRow}>
            {['RAMP', 'CATALOGUE', 'MOVIES', 'WEB SERIES', 'MUSIC'].map((c) => (
              <CheckItem key={c} label={c} checked={data.auditionCategories.includes(c)} />
            ))}
          </View>
        </View>

        {/* ── Section 4 – Language Skills ── */}
        <View style={s.section}>
          <SectionHeader num={4} title="LANGUAGE SKILLS" />
          <Text style={s.fieldValue}>{data.languageSkills || '—'}</Text>
        </View>

        {/* ── Sections 5 & 6 – About You + Experience ── */}
        <View style={[s.section, { flexDirection: 'row', gap: 24 }]}>
          <View style={{ flex: 1 }}>
            <SectionHeader num={5} title="ABOUT YOU" />
            <Text style={s.fieldLabel}>TELL US ABOUT YOURSELF.</Text>
            <Text style={s.blockValue}>{data.aboutYou || '—'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <SectionHeader num={6} title="EXPERIENCE" />
            <Text style={s.fieldLabel}>PLEASE LIST ANY PREVIOUS EXPERIENCE.</Text>
            <Text style={s.blockValue}>{data.experience || '—'}</Text>
          </View>
        </View>

        {/* ── Section 7 – Skills ── */}
        <View style={s.section}>
          <SectionHeader num={7} title="SKILLS" />
          <Text style={[s.fieldLabel, { marginBottom: 6 }]}>
            LIST DOWN A FEW SKILLS RELATED TO THE AUDITION CATEGORY.
          </Text>
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

        {/* ── Sections 8 & 9 – Upload Links + Social Media ── */}
        <View style={[s.section, { flexDirection: 'row', gap: 24 }]}>
          <View style={{ flex: 1 }}>
            <SectionHeader num={8} title="UPLOAD LINKS" />
            <Text style={[s.fieldLabel, { marginBottom: 6 }]}>
              VIDEO LINKS FOR WALK AUDITION AND SELF-INTRODUCTION.
            </Text>
            <Row>
              <Field label="Link 1" value={data.link1} />
              <Field label="Link 2" value={data.link2} />
            </Row>
            <Row>
              <Field label="Link 3" value={data.link3} />
              <Field label="Link 4" value={data.link4} />
            </Row>
          </View>
          <View style={{ flex: 1 }}>
            <SectionHeader num={9} title="SOCIAL MEDIA" />
            <Row><Field label="Instagram" value={data.instagram} /></Row>
            <Row><Field label="Snapchat" value={data.snapchat} /></Row>
            <Row><Field label="Threads" value={data.threads} /></Row>
            <Row><Field label="Other" value={data.otherSocial} /></Row>
          </View>
        </View>

        {/* ── Section 10 – Agreement ── */}
        <View style={s.section}>
          <SectionHeader num={10} title="AGREEMENT" />
          <Text style={s.agreementText}>
            I HEREBY DECLARE THAT THE INFORMATION PROVIDED ABOVE IS TRUE AND ACCURATE.
            I UNDERSTAND THAT A7 ENTERTAINMENT RESERVES THE RIGHT TO USE MY INFORMATION AND
            PHOTOS/VIDEOS FOR AUDITION PURPOSES ONLY.
            I AGREE TO THE TERMS AND CONDITIONS SET BY A7 ENTERTAINMENT.
          </Text>
          <View style={s.sigRow}>
            <View style={{ flex: 1 }}>
              <Field label="Applicant Signature (Full Name)" value={data.signatureName} />
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Date" value={data.signatureDate} />
            </View>
          </View>
        </View>

        {/* ── Page footer ── */}
        <View style={s.pageFooter} fixed>
          <Text style={s.footerText}>A7 ENTERTAINMENT — CONFIDENTIAL</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) =>
            `PAGE ${pageNumber} OF ${totalPages}`
          } />
        </View>
      </Page>
    </Document>
  );
}
