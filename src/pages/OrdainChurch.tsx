import React from 'react';
import { AccessibilityControls, ADHDFocusMode, useAccessibility } from '../components/AccessibilityModes';
import { stateMarriageLaws, lgbtqAffirmingFeatures, interfaithCeremonyBuilder } from '../../server/features/ordain-church';

export const OrdainChurchPage: React.FC = () => {
  const { settings } = useAccessibility();

  return (
    <ADHDFocusMode>
      <div style={{
        fontSize: `${settings.fontSize}px`,
        lineHeight: settings.lineHeight,
        fontFamily: settings.fontFamily,
      }}>
        <AccessibilityControls />
        
        <section className="ordain-hero">
          <h1>Ordain.Church - Spiritual Platform</h1>
          <p>Get ordained, access marriage laws, build ceremonies, support survivors</p>
        </section>

        <section className="marriage-laws">
          <h2>State Marriage Laws Database</h2>
          <p>Access comprehensive marriage law information for all states</p>
          <div className="states-grid">
            {Object.entries(stateMarriageLaws).slice(0, 10).map(([code, law]) => (
              <div key={code} className="state-card">
                <h3>{law.state}</h3>
                <p>Min Age: {law.minimumAge}</p>
                <p>Same-Gender: {law.sameGenderMarriageAllowed ? '✓' : '✗'}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="lgbtq-affirming">
          <h2>LGBTQ+ Affirming Features</h2>
          <p>Inclusive ceremonies for all partnerships</p>
          <ul>
            {lgbtqAffirmingFeatures.partnershipTypes.map(type => (
              <li key={type}>{type}</li>
            ))}
          </ul>
        </section>

        <section className="interfaith">
          <h2>Interfaith Ceremony Builder</h2>
          <p>Blend traditions from multiple faiths</p>
          <div className="traditions">
            {interfaithCeremonyBuilder.traditions.map(tradition => (
              <button key={tradition}>{tradition}</button>
            ))}
          </div>
        </section>
      </div>
    </ADHDFocusMode>
  );
};
