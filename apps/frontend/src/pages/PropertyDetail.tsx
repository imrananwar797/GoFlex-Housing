import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { integrationService } from '../services/integration.service';
import { api } from '../services/api';
import BookingForm from '../components/dashboard/BookingForm';
import PageTransition from '../components/common/PageTransition';
import './Dashboard.css';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<any>(null);
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propRes = await api.get(`/api/properties/${id}`);
        setProperty(propRes.data);
        
        const tourData = await integrationService.getMatterportTour(Number(id));
        setTour(tourData);
      } catch (err) {
        console.error('Failed to fetch property details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="loading-state">Loading property details...</div>;
  if (!property) return <div className="error-state">Property not found</div>;

  return (
    <PageTransition>
      <section className="content-wrap property-detail-page">
        <div className="property-header mb-8">
          <h1 className="dashboard-title text-4xl">{property.name}</h1>
          <p className="dashboard-subtitle text-xl">{property.city}, {property.state_iso} • {property.beds} • ₹{property.rent}/mo</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Virtual Tour Section (Phase 4) */}
            <div className="card overflow-hidden p-0">
              <div className="card-header p-6">
                <h2 className="card-title flex items-center gap-2">
                  <span>📹</span> 3D Virtual Tour
                </h2>
                <p className="card-subtitle">Experience the space from anywhere</p>
              </div>
              <div className="aspect-video bg-black">
                {tour ? (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={tour.tour_url} 
                    frameBorder="0" 
                    allowFullScreen 
                    allow="xr-spatial-tracking"
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    Virtual tour not available for this property
                  </div>
                )}
              </div>
            </div>

            {/* Description & Amenities */}
            <div className="card">
              <h3 className="card-title mb-4">About this residence</h3>
              <p className="text-secondary leading-relaxed mb-6">
                {property.description || "This premium co-living suite offers a perfect blend of privacy and community. Fully furnished with high-end designer furniture, ergonomic workspaces, and plenty of natural light."}
              </p>
              
              <h4 className="font-bold mb-4">Amenities</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['High-speed Wi-Fi', 'Daily Housekeeping', 'Power Backup', 'Gym Access', 'Rooftop Lounge', 'Laundry Service'].map(a => (
                  <div key={a} className="flex items-center gap-2 text-sm text-secondary">
                    <span className="text-primary">✓</span> {a}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingForm propertyId={Number(id)} rent={property.rent} />
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
