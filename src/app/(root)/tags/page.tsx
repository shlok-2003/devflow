import { Fragment } from "react";
import Link from "next/link";

import Filter from "@/components/shared/filter";
import NoResult from "@/components/shared/no-result";
import Pagination from "@/components/shared/pagination";
import LocalSearchBar from "@/components/shared/search/local-search";

import { SearchParamsProps } from "@/types";
import { UserFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";

const Tags = async ({ searchParams }: SearchParamsProps) => {
    const result = await getAllTags({
        searchQuery: searchParams.q,
        filter: searchParams.filter,
        page: searchParams.page ? +searchParams.page : 1,
    });

    return (
        <Fragment>
            <h1 className="h1-bold text-dark100_light900">All Tags</h1>

            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearchBar
                    route="/tags"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search for tags"
                    className="flex-1"
                />

                <Filter
                    filters={UserFilters}
                    triggerClassName="min-h-[56px] sm:min-w-[170px]"
                />
            </div>

            <section className="mt-12 flex flex-wrap gap-4">
                {result.tags.length > 0 ? (
                    result.tags.map((tag: any) => (
                        <Link
                            key={tag._id}
                            href={`/tags/${tag._id}`}
                            className="shadow-light100_darknone"
                        >
                            <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
                                <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
                                    <p className="paragraph-semibold text-dark300_light900">
                                        {tag.name}
                                    </p>
                                </div>

                                <p className="small-medium text-dark400_light500 mt-3.5">
                                    <span className="body-semibold primary-text-gradient mr-2.5">
                                        {tag.questions.length}+
                                    </span>{" "}
                                    Questions
                                </p>
                            </article>
                        </Link>
                    ))
                ) : (
                    <NoResult
                        title="No Tags Found"
                        description="It looks like there are no tags found"
                        link="/ask-question"
                        linkTitle="Ask a question"
                    />
                )}
            </section>

            {/* Pagination */}
            <div className="mt-10">
                <Pagination
                    pageNumber={searchParams?.page ? +searchParams.page : 1}
                    isNext={result.isNext}
                />
            </div>
        </Fragment>
    );
};
export default Tags;
