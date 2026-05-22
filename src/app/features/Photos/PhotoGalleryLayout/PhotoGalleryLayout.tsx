import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import styles from "./PhotoGalleryLayout.module.scss";
import { PhotoGallery } from "../PhotoGallery/PhotoGallery";
import { Photo } from "@/types";

interface PhotoGalleryLayoutProps {
  photos: Photo[];
  avatar?: string;
  name: string;
}

export const PhotoGalleryLayout = ({
  photos,
  avatar,
  name,
}: PhotoGalleryLayoutProps) => {
  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Sidebar/>
      </div>
      <div className={styles.content}>
        <PhotoGallery photos={photos} avatar={avatar} name={name} />
      </div>
    </div>
  );
};
