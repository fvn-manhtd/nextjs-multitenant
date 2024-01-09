
import { getSiteData } from '@/lib/fetchers';
import type { Metadata } from 'next'
import { notFound } from 'next/navigation';
import React from 'react';
import { ReactNode } from 'react';



// export async function generateMetadata({
//   params,
// }: {
//   params: { domain: string };
// }): Promise<Metadata | null> {
//   const domain = decodeURIComponent(params.domain);

//   const data = await getSiteData(domain);

//   if (!data) {
//     return null;
//   }
//   const {
//     name: title,
//     description,
//     image,
//     logo,
//   } = data as {
//     name: string;
//     description: string;
//     image: string;
//     logo: string;
//   };

//   return {
//     title,
//     description,
//     openGraph: {
//       title,
//       description,
//       images: [image],
//     },
//     twitter: {
//       card: "summary_large_image",
//       title,
//       description,
//       images: [image],
//       creator: "@vercel",
//     },
//     icons: [logo],
//     metadataBase: new URL(`https://${domain}`),
//     // Optional: Set canonical URL to custom domain if it exists
//     // ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
//     //   data.customDomain && {
//     //     alternates: {
//     //       canonical: `https://${data.customDomain}`,
//     //     },
//     //   }),
//   };
// }


export default async function SiteLayout({
  params,
  children,
}: {
  params: { domain: string };
  children: ReactNode;
}) {


  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);
  

  if (!data) {
    notFound();
  }
  
  return (
    <html lang="en">
      <body>           
        {children}   
      </body>
    </html>
  )
}

