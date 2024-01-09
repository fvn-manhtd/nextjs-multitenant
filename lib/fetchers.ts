import { unstable_cache } from "next/cache";
import prisma from "./database";

export async function getSiteData(domain: string) {
  return await unstable_cache(
    async () => {
      return await prisma.domains.findUnique({
        where: {
          domain,
        },
      });
    },
    [`${domain}-metadata`],
    {
      revalidate: 900,
      tags: [`${domain}-metadata`],
    }
  )();
}
