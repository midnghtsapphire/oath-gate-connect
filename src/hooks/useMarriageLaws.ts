import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface MarriageLaw {
  state_code: string;
  state_name: string;
  registration_required: boolean;
  waiting_period_days: number;
  witnesses_required: number;
  same_sex_marriage_legal: boolean;
  common_law_marriage: boolean;
  blood_test_required: boolean;
  license_validity_days: number;
  minimum_age: number;
  notes?: string;
}

export function useMarriageLaws() {
  const [laws, setLaws] = useState<MarriageLaw[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLaws = async () => {
      try {
        const data = await api.getAllMarriageLaws();
        setLaws(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load marriage laws');
        console.error('Error fetching marriage laws:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLaws();
  }, []);

  return { laws, loading, error };
}

export function useMarriageLaw(stateCode: string | null) {
  const [law, setLaw] = useState<MarriageLaw | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stateCode) {
      setLaw(null);
      return;
    }

    const fetchLaw = async () => {
      setLoading(true);
      try {
        const data = await api.getMarriageLawByState(stateCode);
        setLaw(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load marriage law');
        console.error('Error fetching marriage law:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLaw();
  }, [stateCode]);

  return { law, loading, error };
}
