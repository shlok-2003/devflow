import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import RenderTag from "@/components/shared/render-tags";

import { IUser } from "@/database/user.model";
import { getTopInteractedTags } from "@/lib/actions/tag.action";

interface Props {
    user: Pick<IUser, "_id" | "clerkId" | "picture" | "name" | "username">;
}

const UserCard: React.FC<Props> = async ({ user }) => {
    const interactedTags = await getTopInteractedTags({
        userId: user._id as string,
    });

    return (
        <div className="shadow-light100_darknone xs:w-[260px] w-full max-sm:w-full">
            <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
                <Link href={`/profile/${user.clerkId}`}>
                    <Image
                        src={user.picture}
                        alt={user.name as string}
                        width={100}
                        height={100}
                        className="rounded-full"
                    />
                </Link>

                {/* User info */}
                <Link href={`/profile/${user.clerkId}`}>
                    <div className="mt-4 text-center">
                        <h3 className="h3-bold text-dark200_light900 line-clamp-1">
                            {user.name}
                        </h3>
                        <p className="body-regular text-dark500_light500 mt-2">
                            @{user.username}
                        </p>
                    </div>
                </Link>

                {/* Tags */}
                <div className="mt-5">
                    {interactedTags.length > 0 ? (
                        <div className="flex items-center gap-2">
                            {interactedTags.map((tag) => (
                                <RenderTag
                                    key={tag._id}
                                    _id={tag._id}
                                    name={tag.name}
                                />
                            ))}
                        </div>
                    ) : (
                        <Badge>No tags yet</Badge>
                    )}
                </div>
            </article>
        </div>
    );
};

export default UserCard;
