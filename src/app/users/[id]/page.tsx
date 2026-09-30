import { getMemberArticles, getPublicMember } from "@/lib/members/server";
import { MemberProfile } from "./components/MemberProfile";

type Props = { params: Promise<{ id: string }> };

// Each member page is built on its first visit and kept until the member saves their profile
// (or an article of theirs changes); none are built ahead of time.
export async function generateStaticParams() {
    return [];
}

export default async function UserProfilePage({ params }: Props) {
    const { id } = await params;
    const [profile, articles] = await Promise.all([getPublicMember(id), getMemberArticles(id)]);
    return <MemberProfile id={id} profile={profile} articles={profile ? articles : []} />;
}
