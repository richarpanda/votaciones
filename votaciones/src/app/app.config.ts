import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideHttpClient(), provideFirebaseApp(() => initializeApp({"projectId":"votaciones-f0823","appId":"1:1083894181798:web:2487eefdf6c01832532967","storageBucket":"votaciones-f0823.appspot.com","apiKey":"AIzaSyBM6ojledoyUjTHKh6YJLFQeuCm-LG4BVA","authDomain":"votaciones-f0823.firebaseapp.com","messagingSenderId":"1083894181798"})), provideAuth(() => getAuth()), provideAnalytics(() => getAnalytics()), ScreenTrackingService, UserTrackingService, provideFirestore(() => getFirestore()), providePerformance(() => getPerformance())]
};
