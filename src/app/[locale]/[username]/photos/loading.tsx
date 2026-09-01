import styles from "@/app/features/photos/PhotoGalleryLayout/PhotoGalleryLayout.module.scss";
import { HeaderSkeleton } from "@/app/components/Header/HeaderSkeleton";
import { SidebarSkeleton } from "@/app/components/Sidebar/SidebarSkeleton";
import { PhotoGallerySkeleton } from "@/app/features/photos/PhotoGallery/PhotoGallerySkeleton";

const PhotosLoading = () => (
  <>
    <HeaderSkeleton />
    <main>
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <SidebarSkeleton />
        </div>
        <div className={styles.content}>
          <PhotoGallerySkeleton />
        </div>
      </div>
    </main>
  </>
);

export default PhotosLoading;
