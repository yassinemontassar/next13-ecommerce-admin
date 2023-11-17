import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";
import { Suspense } from "react";
import Skeleton from "@/components/skelton";

interface SettingsPageProps {
    params: {
        storeId: string;
    }
};

const SettingsPage: React.FC<SettingsPageProps> = async ({
params
}) => {
    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId: userId
        }
    });

    if (!store) {
        redirect("/");
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 pt-6">
            <Suspense fallback={<Skeleton/>}>
            <SettingsForm initialData={store} />
            </Suspense>
            </div>
        </div>
    );
}
export default SettingsPage;