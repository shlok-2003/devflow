"use client";

import Image from "next/image";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { formatAndDivideNumber } from "@/lib/utils";
import {
    downvoteQuestion,
    upvoteQuestion,
} from "@/lib/actions/question.action";
import { toast } from "../ui/use-toast";
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { viewQuestion } from "@/lib/actions/interaction.action";

interface Props {
    type: "question" | "answer";
    itemId: string;
    userId: string;
    upvotes: number;
    hasUpvoted: boolean;
    downvotes: number;
    hasDownvoted: boolean;
    hasSaved?: boolean;
}

const Votes = ({
    type,
    itemId,
    userId,
    upvotes,
    hasUpvoted,
    downvotes,
    hasDownvoted,
    hasSaved,
}: Props) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleSave = async () => {
        if (!userId) {
            return toast({
                title: "Not Signed In",
                description: "Please sign in to save",
            });
        }

        // Toggle save question
        await toggleSaveQuestion({
            questionId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            path: pathname,
        });

        return toast({
            title: `Question ${hasSaved ? "un" : ""}saved`,
            variant: hasSaved ? "default" : "destructive",
        });
    };
    const handleVote = async (action: "upvote" | "downvote") => {
        if (!userId) {
            return toast({
                title: "Not Signed In",
                description: "Please sign in to vote",
            });
        }

        if (action === "upvote") {
            if (type === "question") {
                await upvoteQuestion({
                    questionId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasUpvoted,
                    hasDownvoted,
                    path: pathname,
                });
            } else if (type === "answer") {
                await upvoteAnswer({
                    answerId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasUpvoted,
                    hasDownvoted,
                    path: pathname,
                });
            }

            return toast({
                title: `Upvote ${!hasUpvoted ? "added" : "remove"}`,
                variant: !hasUpvoted ? "default" : "destructive",
            });
        }

        if (action === "downvote") {
            if (type === "question") {
                await downvoteQuestion({
                    questionId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasUpvoted,
                    hasDownvoted,
                    path: pathname,
                });
            } else if (type === "answer") {
                await downvoteAnswer({
                    answerId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasUpvoted,
                    hasDownvoted,
                    path: pathname,
                });
            }

            return toast({
                title: `Downvote ${hasDownvoted ? "removed" : "added"}`,
                variant: hasDownvoted ? "default" : "destructive",
            });
        }
    };

    useEffect(() => {
        viewQuestion({
            questionId: JSON.parse(itemId),
            userId: userId ? JSON.parse(userId) : undefined,
        });

        console.log("Viewed question");
    }, [itemId, userId, pathname, router]);

    return (
        <div className="flex gap-5">
            <div className="flex-center gap-2.5">
                <div className="flex-center gap-1.5">
                    <Image
                        src={
                            hasUpvoted
                                ? "/assets/icons/upvoted.svg"
                                : "/assets/icons/upvote.svg"
                        }
                        alt={hasUpvoted ? "upvoted" : "upvote"}
                        width={18}
                        height={18}
                        className="cursor-pointer"
                        onClick={() => handleVote("upvote")}
                    />

                    <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
                        <p className="subtle-medium text-dark400_light900">
                            {formatAndDivideNumber(upvotes)}
                        </p>
                    </div>
                </div>

                <div className="flex-center gap-1.5">
                    <Image
                        src={
                            hasDownvoted
                                ? "/assets/icons/downvoted.svg"
                                : "/assets/icons/downvote.svg"
                        }
                        alt={hasDownvoted ? "downvoted" : "downvote"}
                        width={18}
                        height={18}
                        className="cursor-pointer"
                        onClick={() => handleVote("downvote")}
                    />

                    <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
                        <p className="subtle-medium text-dark400_light900">
                            {formatAndDivideNumber(downvotes)}
                        </p>
                    </div>
                </div>
            </div>

            {type === "question" && (
                <Image
                    src={
                        hasSaved
                            ? "/assets/icons/star-filled.svg"
                            : "/assets/icons/star-red.svg"
                    }
                    alt={hasSaved ? "star-filled" : "star-red"}
                    width={18}
                    height={18}
                    className="cursor-pointer"
                    onClick={() => handleSave}
                />
            )}
        </div>
    );
};

export default Votes;
