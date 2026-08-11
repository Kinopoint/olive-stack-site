import { Link } from '../components/Link';
import { paths } from '../lib/routes';
import { PHOTOS } from '../data/events';
import { imageSrcSet } from '../data/collections';
import './residency.css';

export function PhotosPage() {
  return (
    <div className="photos-page">
      <div className="photos-intro">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href={paths.home()}>HOME</Link> /{' '}
          <Link href={paths.residency()}>ARTISTS RESIDENCY</Link> /{' '}
          <span className="crumb-current" aria-current="page">PHOTO GALLERY</span>
        </nav>
        <h1 className="serif photos-title">
          Photo <em>gallery</em>
        </h1>
        <p className="photos-blurb">
          Life at the gallery and around Listowel: residencies, workshops and the work itself.
        </p>
      </div>

      <div className="photos-grid">
        {PHOTOS.map((photo) => (
          <img
            key={photo.img}
            src={photo.img}
            srcSet={imageSrcSet(photo.img)}
            sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1024px) 46vw, 31vw"
            alt={photo.alt}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>

      <div className="residency-live-link">
        <a
          href="https://www.olivestack.com/pages/photo-gallery"
          target="_blank"
          rel="noreferrer"
        >
          Full photo gallery on the live site →
        </a>
      </div>
    </div>
  );
}
