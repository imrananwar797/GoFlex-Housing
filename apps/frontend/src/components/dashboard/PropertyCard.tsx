import React from 'react';
import { NavLink } from 'react-router-dom';

export interface PropertyRecord {
  id: number;
  name: string;
  city: string;
  state_iso: string;
  beds: string;
  rent: number;
  occupancy: number;
  cover_image_url: string;
}

interface PropertyCardProps {
  property: PropertyRecord;
}

export default function PropertyCard({ property: p }: PropertyCardProps) {
  return (
    <article className="property-card">
      <img
        className="property-img"
        loading="lazy"
        decoding="async"
        src={`${p.cover_image_url}?auto=compress&cs=tinysrgb&w=1920&dpr=1`}
        alt={p.name}
      />
      <div className="property-body">
        <h3 className="property-title">{p.name}</h3>
        <div className="property-meta">{p.city}, {p.state_iso} • {p.beds} • ₹{p.rent}/mo</div>
        <div className="property-occupancy"><span className="badge">{p.occupancy}%</span> occupied</div>
        <div className="property-actions mt-4 flex gap-2">
          <NavLink className="btn-cta text-sm py-2 px-4" to={`/properties/${p.id}`}>View Details</NavLink>
          <a className="btn-ghost text-sm py-2 px-4" href={`/contact?property=${encodeURIComponent(p.name)}`}>Tour</a>
        </div>
      </div>
    </article>
  );
}
