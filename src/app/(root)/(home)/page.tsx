import React, { Fragment } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import Filter from "@/components/shared/filter";
import NoResult from "@/components/shared/no-result";
import HomeFilter from "@/components/home/home-filter";
import QuestionCard from "@/components/cards/question-card";
import LocalSearch from "@/components/shared/search/local-search";

import { HomePageFilters } from "@/constants/filters";
import { getQuestions } from "@/lib/actions/question.action";

export default async function HomePage() {
    const result = await getQuestions({});

    return (
        <Fragment>
            <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="h1-bold text-dark100_light900">All Questions</h1>

                <Link
                    href="/ask-question"
                    className="flex justify-end max-sm:w-full"
                >
                    <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
                        Ask a Question
                    </Button>
                </Link>
            </div>

            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearch
                    route="/"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search for questions"
                    className="flex-1"
                />

                <Filter
                    filters={HomePageFilters}
                    triggerClassName="min-h-[56px] sm:min-w-[170px]"
                    className="hidden max-md:flex"
                />
            </div>

            <HomeFilter />

            <div className="mt-10 flex w-full flex-col gap-6">
                {result.questions.length > 0 ? (
                    result.questions.map((question) => (
                        <QuestionCard
                            key={question._id}
                            _id={question._id}
                            title={question.title}
                            tags={question.tags}
                            author={question.author}
                            upvotes={question.upvotes}
                            answers={question.answers}
                            views={question.views}
                            createdAt={question.createdAt}
                        />
                    ))
                ) : (
                    <NoResult
                        link="/ask-question"
                        linkTitle="Ask Question"
                        title="There's no question to show"
                        description="Be the first to break the silence! 🚀 Ask a Question and kickstart
                          the discussion. our query could be the next big thing others learn
                          from. Get involved! 💡"
                    />
                )}
            </div>
        </Fragment>
    );
}
