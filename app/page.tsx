import type { Metadata } from "next";
import Diagnosis from "@/components/Diagnosis";
import { TYPES, ORDER, img } from "@/data/diagnosis";

type Props = { searchParams: Promise<{ r?: string }> };

// 結果URL（?r=minimal など）をSNSでシェアしたとき、タイプ名と写真がプレビューに出るようにする
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { r } = await searchParams;
  const key = ORDER.find((k: string) => TYPES[k].slug === r);
  const base = "見つけよう！あなたのヨーロッパインテリアスタイル診断";
  if (!key) {
    return { openGraph: { title: base, type: "website" }, twitter: { card: "summary_large_image" } };
  }
  const t = TYPES[key];
  const title = `私は「${t.name}」タイプでした｜${base}`;
  return {
    title,
    description: t.catch,
    openGraph: { title, description: t.catch, images: [img(t.hero[1])], type: "website" },
    twitter: { card: "summary_large_image", title, description: t.catch, images: [img(t.hero[1])] },
  };
}

export default function Page() {
  return <Diagnosis />;
}
