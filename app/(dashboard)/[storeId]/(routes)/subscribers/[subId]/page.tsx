import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/size-form";

const SizePage = async ({
    params
}: {
    params: {subId: string}
}) => {

    const subscriber = await prismadb.subscriber.findUnique({
        where : {
            id: params.subId
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizeForm initialData={subscriber} />
            </div>

        </div>
    )
}

export default SizePage; 