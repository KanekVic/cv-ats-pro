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
  ],
});

interface ATSPDFDocumentProps {
  data: CVContent;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 12,
    lineHeight: 1.6,
    color: "#000000",
    padding: 50,
  },
  header: {
    marginBottom: 30,
  },
  name: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 8,
  },
  contact: {
    fontSize: 11,
    marginBottom: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  item: {
    marginBottom: 16,
  },
  itemHeader: {
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 600,
  },
  itemSubtitle: {
    fontSize: 11,
  },
  itemDate: {
    fontSize: 11,
  },
  itemDescription: {
    fontSize: 11,
    marginLeft: 0,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    marginBottom: 24,
  },
});

export function ATSPDFDocument({ data }: ATSPDFDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {data.personalInfo.firstName} {data.personalInfo.lastName}
          </Text>
          <Text style={styles.contact}>
            Email: {data.personalInfo.email} | Tel: {data.personalInfo.phone}
          </Text>
          <Text style={styles.contact}>
            Ubicación: {data.personalInfo.city}, {data.personalInfo.country}
          </Text>
          {data.personalInfo.linkedin && (
            <Text style={styles.contact}>LinkedIn: {data.personalInfo.linkedin}</Text>
          )}
        </View>

        <View style={styles.divider} />

        {/* Summary */}
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumen Profesional</Text>
            <Text style={styles.itemDescription}>{data.summary}</Text>
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
                </View>
                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                <Text style={styles.itemDate}>
                  {exp.startDate} - {exp.current ? "Presente" : exp.endDate}
                </Text>
                {exp.location && <Text style={styles.itemSubtitle}>{exp.location}</Text>}
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
                <Text style={styles.itemTitle}>{edu.degree}</Text>
                <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                <Text style={styles.itemSubtitle}>{edu.field}</Text>
                <Text style={styles.itemDate}>
                  {edu.startDate} - {edu.current ? "Presente" : edu.endDate}
                </Text>
                {edu.gpa && <Text style={styles.itemSubtitle}>Promedio: {edu.gpa}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Habilidades</Text>
            {data.skills.map((skill, index) => (
              <Text key={skill.id} style={styles.itemDescription}>
                {skill.name}
                {index < data.skills.length - 1 && ", "}
              </Text>
            ))}
          </View>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Idiomas</Text>
            {data.languages.map((lang, index) => (
              <Text key={lang.id} style={styles.itemDescription}>
                {lang.name}: {lang.level}
                {index < data.languages.length - 1 && " | "}
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
                  {cert.issuer} - {cert.date}
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
