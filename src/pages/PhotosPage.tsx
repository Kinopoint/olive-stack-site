import { navigate } from '../hooks/useHashRoute';
import { paths } from '../lib/routes';
import { PHOTOS } from '../data/events';
import './residency.css';

export function PhotosPage() {
  return (
    <div className="photos-page">
      <div className="photos-intro">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <button onClick={() => navigate(paths.home())}>HOME</button> /{' '}
          <button onClick={() => navigate(paths.residency())}>ARTISTS RESIDENCY</button> /{' '}
          <span className="crumb-current">PHOTO GALLERY</span>
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
          <img key={photo.img} src={photo.img} alt={photo.alt} loading="lazy" />
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
