import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import styles from "./Post.module.scss";
import Image from "next/image";
import { FaComment, FaHeart, FaReply } from "react-icons/fa";
import { Post as PostType} from "@/types";
import dayjs from "dayjs";
import { Comment } from "@/app/features/profile/feed/Comment/Comment";
import { MdDeleteSweep, MdModeEdit } from "react-icons/md";
import { CommentCreator } from "../CommentCreator/CommentCreator";
import { useState } from "react";
import { useLocale } from "next-intl";
import "dayjs/locale/pl";
import "dayjs/locale/en";
import api from "@/config/axios";
import { DropdownMenu } from "@/app/uikit/overlays/DropdownMenu/DropdownMenu";
import { likePost } from "@/app/api/likes";
import { Button } from "@/app/uikit/form/Button/Button";
import { useLike } from "@/app/hooks/useLike";
import { ROUTES } from "@/routes/routes";
import { Link } from "@/app/uikit/navigation/Link/Link";

export interface PostProps {
  post: PostType;
  onRefresh: () => void;
}

export const Post = ({ post, onRefresh }: PostProps) => {
  const locale = useLocale();
  const [showCommentCreator, setShowCommentCreator] = useState(
    (post.comments?.length ?? 0) > 0,
  );

  const { liked, displayCount, likeLoading, handleLike } = useLike({
    initialLiked: post.liked,
    initialCount: post.likesCount,
    onLike: likePost,
    id: post.id,
  });

  const deletePost = async () => {
    await api.delete(`/posts/${post.id}`);
    onRefresh();
  };

  const deleteComment = async (commentId: string) => {
    await api.delete(`/comments/${commentId}`);
    onRefresh();
  };

  return (
    <article>
      <div className={styles.wrapper}>
        <Link href={ROUTES.profile(post.user.username)}>
        <Avatar src={post.user.avatar} />
        </Link>
        <div className={styles.info}>
          <Link href={ROUTES.profile(post.user.username)}>
          <div className={styles.name}>{post.user.name}</div>
          </Link>
          <time className={styles.time}>
            {dayjs(post.createdAt).locale(locale).format("D MMM YYYY")}
          </time>
        </div>
        <div className={styles.dropdown}>
          <DropdownMenu
            items={[
              {
                label: "Edit",
                icon: <MdModeEdit size={20} />,
                onClick: () => {},
              },
              {
                label: "Delete",
                icon: <MdDeleteSweep size={20} />,
                onClick: deletePost,
              },
            ]}
          />
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.content}>{post.content}</div>
        {post.image && (
          <div className={styles.mediaContent}>
            <Image src={post.image} alt="Post image" fill />
          </div>
        )}
      </div>
      <div className={styles.stats}>
        <Button
          appearance="ghost"
          className={`${styles.stat} ${liked ? styles.statLiked : ""}`}
          onClick={handleLike}
          disabled={likeLoading}
        >
          <FaHeart size={16} />
          <span>{displayCount ?? ""}</span>
        </Button>
        <Button
          appearance="ghost"
          className={styles.stat}
          onClick={() => setShowCommentCreator((prev) => !prev)}
        >
          <FaComment size={16} />
          <span>{post.comments?.length || ""}</span>
        </Button>
        <Button appearance="ghost" className={styles.stat}>
          <FaReply size={18} />
          <span>{post.reposts}</span>
        </Button>
      </div>
      <ul className={styles.comments}>
        {post.comments?.map((comment) => (
          <li key={comment.id}>
            <Comment
              comment={comment}
              onDelete={() => deleteComment(comment.id)}
            />
          </li>
        ))}
      </ul>
      {showCommentCreator && (
        <CommentCreator
          postId={post.id}
          avatar={post.user.avatar}
          onSuccess={onRefresh}
        />
      )}
    </article>
  );
};
