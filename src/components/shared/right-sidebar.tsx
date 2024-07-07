import Image from "next/image";
import Link from "next/link";
import RenderTag from "./render-tags";
// import { getHotQuestions } from "@/lib/actions/question.action";
// import { getTopPopularTags } from "@/lib/actions/tag.action";

const RightSidebar = async () => {
    // const hotQuestions = await getHotQuestions();
    // const popularTags = await getTopPopularTags();

    const hotQuestions = [
        {
            _id: "1",
            title: "What is the best way to learn React?",
        },
        {
            _id: "2",
            title: "How to build a responsive website?",
        },
        {
            _id: "3",
            title: "What is the best way to learn React?",
        },
    ];

    const popularTags = [
        {
            _id: "1",
            name: "React",
            numberOfQuestions: 20,
        },
        {
            _id: "2",
            name: "JavaScript",
            numberOfQuestions: 30,
        },
        {
            _id: "3",
            name: "Next.js",
            numberOfQuestions: 10,
        },
    ];

    return (
        <aside className="background-light900_dark200 light-border custom-scrollbar no-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
            {/* Top questions */}
            <div>
                <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
                <div className="mt-7 flex w-full flex-col gap-[30px]">
                    {hotQuestions.map((question) => {
                        return (
                            <Link
                                key={question._id}
                                href={`/question/${question._id}`}
                                className="flex cursor-pointer items-center justify-between gap-7"
                            >
                                <p className="body-medium text-dark500_light700">
                                    {question.title}
                                </p>
                                <Image
                                    src="/assets/icons/chevron-right.svg"
                                    alt="chevron right"
                                    width={20}
                                    height={20}
                                    className="invert-colors"
                                />
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Popular tags */}
            <div className="mt-16">
                <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
                <div className="mt-7 flex flex-col gap-4">
                    {popularTags.map((tag) => {
                        return (
                            <RenderTag
                                key={tag._id}
                                _id={tag._id}
                                name={tag.name}
                                totalQuestions={tag.numberOfQuestions}
                                showCount
                            />
                        );
                    })}
                </div>
            </div>
        </aside>
    );
};

export default RightSidebar;
