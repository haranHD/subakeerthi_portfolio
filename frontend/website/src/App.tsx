import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProgrammesPage } from './pages/ProgrammesPage';
import { CredentialsPage } from './pages/CredentialsPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { api } from './services/api';
import { Profile, Service, Programme, Credential, AudienceGroup } from './types';
import {
  defaultServices,
  defaultAudiences,
  defaultProgrammes,
  defaultCredentials,
} from './data/defaultContent';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(() => {
    try {
      const cached = localStorage.getItem('subakeerthii_profile_cache');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('subakeerthii_profile_cache');
    } catch {
      return true;
    }
  });
  const [services, setServices] = useState<Service[]>(() => {
    try {
      const cached = localStorage.getItem('subakeerthii_services_cache');
      return cached ? JSON.parse(cached) : defaultServices;
    } catch {
      return defaultServices;
    }
  });
  const [programmes, setProgrammes] = useState<Programme[]>(() => {
    try {
      const cached = localStorage.getItem('subakeerthii_programmes_cache');
      return cached ? JSON.parse(cached) : defaultProgrammes;
    } catch {
      return defaultProgrammes;
    }
  });
  const [credentials, setCredentials] = useState<Credential[]>(() => {
    try {
      const cached = localStorage.getItem('subakeerthii_credentials_cache');
      return cached ? JSON.parse(cached) : defaultCredentials;
    } catch {
      return defaultCredentials;
    }
  });
  const [audiences, setAudiences] = useState<AudienceGroup[]>(() => {
    try {
      const cached = localStorage.getItem('subakeerthii_audiences_cache');
      return cached ? JSON.parse(cached) : defaultAudiences;
    } catch {
      return defaultAudiences;
    }
  });

  useEffect(() => {
    // Load profile independently so portrait updates immediately without waiting for other collections
    api
      .getProfile()
      .then((profData) => {
        if (profData) {
          setProfile(profData);
          try {
            localStorage.setItem('subakeerthii_profile_cache', JSON.stringify(profData));
          } catch (e) {
            console.warn('Failed to cache profile in localStorage', e);
          }
        }
      })
      .catch((err) => {
        console.warn('Profile fetch error, using fallback:', err);
      })
      .finally(() => {
        setIsProfileLoading(false);
      });

    async function loadContent() {
      try {
        const [servData, progData, credData, audData] = await Promise.all([
          api.getServices(),
          api.getProgrammes(),
          api.getCredentials(),
          api.getAudiences(),
        ]);

        if (servData.length > 0) {
          setServices(servData);
          try { localStorage.setItem('subakeerthii_services_cache', JSON.stringify(servData)); } catch { }
        }
        if (progData.length > 0) {
          setProgrammes(progData);
          try { localStorage.setItem('subakeerthii_programmes_cache', JSON.stringify(progData)); } catch { }
        }
        if (credData.length > 0) {
          setCredentials(credData);
          try { localStorage.setItem('subakeerthii_credentials_cache', JSON.stringify(credData)); } catch { }
        }
        if (audData.length > 0) {
          setAudiences(audData);
          try { localStorage.setItem('subakeerthii_audiences_cache', JSON.stringify(audData)); } catch { }
        }
      } catch (err) {
        console.warn('Using resilient client fallback content:', err);
      }
    }
    loadContent();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="portfolio-app">
        <Navbar />
        <main id="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  profile={profile}
                  isProfileLoading={isProfileLoading}
                  services={services}
                  audiences={audiences}
                  credentials={credentials}
                />
              }
            />
            <Route path="/about" element={<AboutPage profile={profile} />} />
            <Route
              path="/programmes"
              element={<ProgrammesPage programmes={programmes} audiences={audiences} />}
            />
            <Route
              path="/credentials"
              element={<CredentialsPage credentials={credentials} />}
            />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage profile={profile} />} />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer profile={profile} />
      </div>
    </BrowserRouter>
  );
};

export default App;
