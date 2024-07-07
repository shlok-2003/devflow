import React, { Fragment } from "react";
import Question from "@/components/forms/question";

export default function AskQuestionPage() {
    return (
        <Fragment>
            <h1 className="h1-bold text-dark100_light900">Ask a questions</h1>
            
            <div className="mt-9">
                <Question />
            </div>
        </Fragment>
    );
}
