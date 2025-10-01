import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { LucideAngularModule, DeleteIcon, MessageSquare, LocateFixed, Target, ArrowDown, ArrowUp, PauseIcon, SendHorizontal, Plus, Download, Paperclip, Map,Eye,ChartBar, Ticket, Menu, User, LogOut, List,Settings, Clock, RefreshCw, Check, AlertCircle, PlusCircle } from 'lucide-angular';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    importProvidersFrom(
      LucideAngularModule.pick({ Map, Menu, Target, MessageSquare, LocateFixed, DeleteIcon, ArrowDown, ArrowUp, PauseIcon, Download, SendHorizontal, Plus, Paperclip, Eye, ChartBar, Ticket, User, LogOut, List, Settings, Clock, RefreshCw, Check, AlertCircle, PlusCircle })
    ),
  ],
}).catch((err) => console.error(err));
