import { Fragment } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Question from "@/components/forms/question";
import { getUserById } from "@/lib/actions/user.action";

export default async function AskQuestionPage() {
    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const mongoUser = await getUserById({ userId });
    console.log(mongoUser);

    return (
        <Fragment>
            <h1 className="h1-bold text-dark100_light900">Ask a questions</h1>

            <div className="mt-9">
                <Question mongoUserId={JSON.stringify(mongoUser?._id)} />
            </div>
        </Fragment>
    );
}
