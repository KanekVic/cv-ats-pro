import { prisma } from "@/lib/db/prisma";
import { CVContent } from "@/types/cv";

export async function saveCVVersion(cvId: string, content: CVContent) {
  const latestVersion = await prisma.cVVersion.findFirst({
    where: { cvId },
    orderBy: { version: "desc" },
  });

  const newVersion = (latestVersion?.version || 0) + 1;

  await prisma.cVVersion.create({
    data: {
      cvId,
      version: newVersion,
      content: content as any,
    },
  });

  return newVersion;
}

export async function getCVVersions(cvId: string) {
  const versions = await prisma.cVVersion.findMany({
    where: { cvId },
    orderBy: { version: "desc" },
  });

  return versions;
}

export async function restoreCVVersion(versionId: string) {
  const version = await prisma.cVVersion.findUnique({
    where: { id: versionId },
  });

  if (!version) {
    throw new Error("Version not found");
  }

  // Update the CV with the version's content
  await prisma.cV.update({
    where: { id: version.cvId },
    data: {
      content: version.content as any,
      updatedAt: new Date(),
    },
  });

  // Create a new version from the restored state
  await saveCVVersion(version.cvId, version.content as unknown as CVContent);

  return version;
}

export async function deleteOldVersions(cvId: string, keepLast: number = 10) {
  const versions = await prisma.cVVersion.findMany({
    where: { cvId },
    orderBy: { version: "desc" },
  });

  if (versions.length > keepLast) {
    const toDelete = versions.slice(keepLast);
    await prisma.cVVersion.deleteMany({
      where: {
        id: { in: toDelete.map((v: { id: string }) => v.id) },
      },
    });
  }

  return versions.length - keepLast;
}
