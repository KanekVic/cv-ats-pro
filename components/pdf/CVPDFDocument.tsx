import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { CVContent } from "@/types/cv";

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKAZ9hjp-Ek-_EeA.woff",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff",
      fontWeight: 700,
    },
  ],
});

interface CVPDFDocumentProps {
  data: CVContent;
  template: "modern" | "classic" | "executive";
  color: string;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 11,
    lineHeight: 1.5,
    color: "#1e293b",
    padding: 40,
  },
  header: {
    marginBottom: 24,
  },
  name: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 8,
    color: "#0f172a",
  },
  contact: {
    fontSize: 10,
    color: "#64748b",
    marginBottom: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 12,
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summary: {
    fontSize: 11,
    color: "#334155",
    marginBottom: 8,
  },
  item: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 600,
  },
  itemSubtitle: {
    fontSize: 11,
    color: "#64748b",
  },
  itemDate: {
    fontSize: 10,
    color: "#64748b",
  },
  itemDescription: {
    fontSize: 10,
    color: "#475569",
    marginLeft: 0,
  },
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skill: {
    backgroundColor: "#f1f5f9",
    padding: "4 8",
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    marginBottom: 20,
  },
});

export function CVPDFDocument({ data, template, color }: CVPDFDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {data.personalInfo.firstName} {data.personalInfo.lastName}
          </Text>
          <Text style={styles.contact}>
            {data.personalInfo.email} • {data.personalInfo.phone}
          </Text>
          {data.personalInfo.city && (
            <Text style={styles.contact}>
              {data.personalInfo.city}, {data.personalInfo.country}
            </Text>
          )}
          {data.personalInfo.linkedin && (
            <Text style={styles.contact}>{data.personalInfo.linkedin}</Text>
          )}
        </View>

        <View style={styles.divider} />

        {/* Summary */}
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumen Profesional</Text>
            <Text style={styles.summary}>{data.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experiencia Laboral</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.position}</Text>
                  <Text style={styles.itemDate}>
                    {exp.startDate} - {exp.current ? "Presente" : exp.endDate}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                {exp.location && (
                  <Text style={styles.itemSubtitle}>{exp.location}</Text>
                )}
                <Text style={styles.itemDescription}>{exp.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Educación</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.degree}</Text>
                  <Text style={styles.itemDate}>
                    {edu.startDate} - {edu.current ? "Presente" : edu.endDate}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                <Text style={styles.itemSubtitle}>{edu.field}</Text>
                {edu.gpa && <Text style={styles.itemSubtitle}>Promedio: {edu.gpa}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Habilidades</Text>
            <View style={styles.skillsGrid}>
              {data.skills.map((skill) => (
                <Text key={skill.id} style={styles.skill}>
                  {skill.name}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Idiomas</Text>
            {data.languages.map((lang) => (
              <Text key={lang.id} style={styles.itemDescription}>
                {lang.name} - {lang.level}
              </Text>
            ))}
          </View>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certificaciones</Text>
            {data.certifications.map((cert) => (
              <View key={cert.id} style={styles.item}>
                <Text style={styles.itemTitle}>{cert.name}</Text>
                <Text style={styles.itemSubtitle}>
                  {cert.issuer} • {cert.date}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Proyectos</Text>
            {data.projects.map((project) => (
              <View key={project.id} style={styles.item}>
                <Text style={styles.itemTitle}>{project.name}</Text>
                <Text style={styles.itemDescription}>{project.description}</Text>
                <Text style={styles.itemSubtitle}>
                  Tecnologías: {project.technologies.join(", ")}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
