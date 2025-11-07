import clientPromise from "@/lib/mongodb";
import { notFound } from "next/navigation";
import SurnameClientPage from "./surname-client";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const client = await clientPromise;
  const db = client.db("Surname_Project");
  const data = await db.collection("surnames").findOne({ key: slug.toLowerCase() });

  if (!data) return { title: "KnowYourRoots — Unknown Surname" };

  return {
    title: `${data.surname} — Origin, Meaning & History | KnowYourRoots`,
    description: data.shortSummary,
    openGraph: {
      title: `${data.surname} — KnowYourRoots`,
      description: data.shortSummary,
      images: [
        {
          url: "https://images.unsplash.com/photo-1602777927663-1a5027c83a5a",
          width: 1200,
          height: 630,
          alt: "KnowYourRoots Heritage Background",
        },
      ],
    },
  };
}

export default async function SurnamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const client = await clientPromise;
  const db = client.db("Surname_Project");
  const surname = await db.collection("surnames").findOne({ key: slug.toLowerCase() });

  if (!surname) return notFound();

  // ✅ Pass to client component
  return <SurnameClientPage surname={JSON.parse(JSON.stringify(surname))} />;
}
