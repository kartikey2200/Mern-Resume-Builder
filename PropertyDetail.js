import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      let data;
      if (user) {
        data = await api.properties.getOne(id);
      } else {
        data = await api.properties.getPublic(id);
      }
      setProperty(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await api.properties.delete(id);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async () => {
    try {
      const updated = await api.properties.toggleFeatured(id);
      setProperty(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusLabel = (status) => {
    const labels = {
      'for-sale': 'For Sale',
      'for-rent': 'For Rent',
      sold: 'Sold',
      pending: 'Pending',
    };
    return labels[status] || status;
  };

  const getTypeLabel = (type) => {
    const labels = {
      house: 'House',
      apartment: 'Apartment',
      condo: 'Condo',
      townhouse: 'Townhouse',
      land: 'Land',
      commercial: 'Commercial',
    };
    return labels[type] || type;
  };

  const isOwner = user && property?.user?._id === user._id;

  if (loading) return <div className="loading">Loading property details...</div>;
  if (error) return <div className="error-page"><h2>Property not found</h2><button className="btn btn-primary" onClick={() => navigate('/')}>Back to Listings</button></div>;
  if (!property) return null;

  const hasImages = property.images && property.images.length > 0;

  return (
    <div className="property-detail">
      <div className="detail-header">
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/')}>
          Back to Listings
        </button>
        {isOwner && (
          <div className="detail-header-actions">
            <button className="btn btn-primary btn-sm" onClick={() => navigate(`/property/${id}/edit`)}>
              Edit
            </button>
            <button className={`btn btn-sm ${property.isFeatured ? 'btn-warning' : 'btn-outline'}`} onClick={handleToggleFeatured}>
              {property.isFeatured ? 'Unfeature' : 'Feature'}
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="detail-content">
        <div className="detail-main">
          <div className="detail-image-section">
            {hasImages ? (
              <div className="detail-image-viewer">
                <div className="detail-main-image">
                  <img src={property.images[currentImage].url} alt={property.images[currentImage].caption || property.title} />
                  {property.images[currentImage].caption && (
                    <p className="image-caption-overlay">{property.images[currentImage].caption}</p>
                  )}
                </div>
                {property.images.length > 1 && (
                  <div className="image-nav">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setCurrentImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))}
                    >
                      Prev
                    </button>
                    <span>{currentImage + 1} / {property.images.length}</span>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setCurrentImage((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))}
                    >
                      Next
                    </button>
                  </div>
                )}
                {property.images.length > 1 && (
                  <div className="image-thumbnails">
                    {property.images.map((img, i) => (
                      <img
                        key={i}
                        src={img.url}
                        alt={img.caption || `Image ${i + 1}`}
                        className={`thumbnail ${i === currentImage ? 'active' : ''}`}
                        onClick={() => setCurrentImage(i)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="detail-no-image">
                <span>No images available</span>
              </div>
            )}
          </div>

          <div className="detail-info">
            <div className="detail-title-row">
              <div>
                <h1>{property.title}</h1>
                <p className="detail-location">
                  {property.address?.street && `${property.address.street}, `}
                  {property.address?.city}{property.address?.state ? `, ${property.address.state}` : ''}
                  {property.address?.zipCode ? ` ${property.address.zipCode}` : ''}
                  {property.address?.country ? `, ${property.address.country}` : ''}
                </p>
              </div>
              <div className="detail-price">{formatPrice(property.price)}</div>
            </div>

            <div className="detail-badges">
              <span className={`badge badge-status badge-${property.status}`}>
                {getStatusLabel(property.status)}
              </span>
              <span className="badge badge-type">{getTypeLabel(property.propertyType)}</span>
              {property.isFeatured && <span className="badge badge-featured">Featured</span>}
            </div>

            <div className="detail-specs">
              <div className="spec">
                <span className="spec-value">{property.bedrooms}</span>
                <span className="spec-label">Bedrooms</span>
              </div>
              <div className="spec">
                <span className="spec-value">{property.bathrooms}</span>
                <span className="spec-label">Bathrooms</span>
              </div>
              <div className="spec">
                <span className="spec-value">{property.area}</span>
                <span className="spec-label">Sq Ft</span>
              </div>
              {property.yearBuilt > 0 && (
                <div className="spec">
                  <span className="spec-value">{property.yearBuilt}</span>
                  <span className="spec-label">Year Built</span>
                </div>
              )}
            </div>

            {property.description && (
              <div className="detail-section">
                <h2>Description</h2>
                <p>{property.description}</p>
              </div>
            )}

            {property.amenities && property.amenities.length > 0 && (
              <div className="detail-section">
                <h2>Amenities</h2>
                <div className="amenities-list">
                  {property.amenities.map((amenity, i) => (
                    <span key={i} className="amenity-badge">{amenity}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="contact-card">
            <h3>Contact Information</h3>
            {property.contactName && (
              <div className="contact-item">
                <span className="contact-label">Name</span>
                <span className="contact-value">{property.contactName}</span>
              </div>
            )}
            {property.contactPhone && (
              <div className="contact-item">
                <span className="contact-label">Phone</span>
                <span className="contact-value">{property.contactPhone}</span>
              </div>
            )}
            {property.contactEmail && (
              <div className="contact-item">
                <span className="contact-label">Email</span>
                <span className="contact-value">{property.contactEmail}</span>
              </div>
            )}
            {!property.contactName && !property.contactPhone && !property.contactEmail && (
              <p className="no-contact">No contact information available</p>
            )}
          </div>

          {property.user && (
            <div className="listed-by-card">
              <h3>Listed By</h3>
              <p>{property.user.name}</p>
              <p className="listed-email">{property.user.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
