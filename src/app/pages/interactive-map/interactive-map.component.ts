import { Component, AfterViewInit, Renderer2, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { LucideAngularModule } from 'lucide-angular';
import * as turf from '@turf/turf';

interface OcorrenciaMarker extends L.Marker {
  ocorrencia: Ocorrencia;
}

interface OcorrenciasPorSolicitante {
  solicitante: string;
  ocorrencias: Ocorrencia[];
  mostrarDetalhes?: boolean;
}

type TemaMapa = 'Padrão' | 'Escuro' | 'Claro' | 'Satélite';

interface Ocorrencia {
  id: number;
  descricao: string;
  solicitante: string;
  categoria: string;
  status: 'PENDENTE_APROVACAO' | 'ABERTO' | 'EM_ANDAMENTO' | 'FINALIZADO';
  lat: number;
  lng: number;
  setor: string;
  bairro?: string;
  imagemUrl?: string;
  nova?: boolean;
  emTrabalho?: boolean;
}

interface Bairro {
  nome: string;
  ativo: boolean;

  layer?: L.Path;
}

@Component({
  selector: 'app-maps-interactive',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './interactive-map.component.html',
})
export class MapaInterativoComponent implements AfterViewInit {
  mostrarFiltros = false;

  toasts: string[] = [];
  ocorrenciasPorSolicitante: OcorrenciasPorSolicitante[] = [];

  private startY = 0;
  private currentHeight = 80;
  private maxHeight = window.innerHeight * 0.75;
  private userMarker: L.Marker | null = null;

  filtros = { busca: '', categoria: '', status: '', bairro: '', cep: '' };

  ocorrenciasDoCluster: Ocorrencia[] = [];
  mostrarClusterModal = false;
  ocorrenciasClusterVisiveis: Ocorrencia[] = [];
  clusterScrollIndex = 0;
  loadingCluster = false;
  precisionCircle!: L.Circle;
  drawerTranslateY = 0;
  drawerContentHeight = 500;

  baseLayers!: Record<TemaMapa, L.TileLayer>;
  currentLayer!: L.TileLayer;
  temaAtual: TemaMapa = 'Padrão';
  selectedOcorrencia: Ocorrencia | null = null;
  mostrarModal = false;

  ocorrencias: Ocorrencia[] = [];
  map!: L.Map;
  markersLayer!: any;

  statusColors: Record<Ocorrencia['status'], string> = {
    PENDENTE_APROVACAO: '#f59e0b',
    ABERTO: '#3b82f6',
    EM_ANDAMENTO: '#8b5cf6',
    FINALIZADO: '#10b981'
  };

  usuarioSetor = 'CLIMA';
  isAdminMaster = false;

  bairros: Bairro[] = [];

  private centralCoord: L.LatLngExpression = [-15.54540, -47.32404];

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    this.initMap();
    this.carregarBairrosGeoJson();
    this.aplicarFiltros();

  }

  ngOnInit() {
    const savedTema = localStorage.getItem('temaMapa') as TemaMapa | null;
    this.temaAtual = savedTema || 'Padrão';

    this.baseLayers = {
      'Padrão': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
      'Escuro': L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'),
      'Claro': L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'),
      'Satélite': L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      )
    };
  }

  buscarCEP() {
    const cep = this.filtros.cep?.replace(/\D/g, ''); // remove any non-numeric characters
    if (!cep || cep.length !== 8) {
      this.showToast('Informe um CEP válido com 8 dígitos.');
      return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(res => res.json())
      .then(data => {
        if (data.erro) {
          this.showToast('CEP não encontrado.');
          return;
        }

        // For testing or fallback, centralize in Formosa-GO
        let latLng: L.LatLngExpression = [-15.5454, -47.32404];

        // If you have a geocoding API, you could convert the zip code to lat/lng here.
        // Ex: latLng = await geocodeCEP(cep);

        // Update or create the user's marker
        if (this.userMarker) {
          this.userMarker.setLatLng(latLng);
        } else {
          const icon = L.divIcon({
            className: 'marker-div',
            html: `<div class="pulse-marker"><span class="pulse-inner">📍</span></div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 36]
          });
          this.userMarker = L.marker(latLng, { icon }).addTo(this.map);
        }

        // Center the map on the found location
        this.map.setView(latLng, 16, { animate: true });


        const nameLocal = data.logradouro || data.bairro || data.localidade || 'Unknown location';
        this.showToast(`CEP encontrado: ${nameLocal}`);
      })
      .catch(err => {
        console.error(err);
        this.showToast('Erro ao buscar CEP.');
      });
  }


  // --- Map Init ---
  private initMap(): void {
    this.map = L.map('map', {
      center: this.centralCoord,
      zoom: 13,
      zoomControl: false,
      dragging: true,
    });

    this.currentLayer = this.baseLayers[this.temaAtual];
    this.currentLayer.addTo(this.map);

    const ThemeControl = L.Control.extend({
      onAdd: () => {
        const div = L.DomUtil.create('div', 'theme-control');
        div.innerHTML = `
          <select id="map-theme" class="theme-select">
            <option value="Padrão">Padrão</option>
            <option value="Escuro">Escuro</option>
            <option value="Claro">Claro</option>
            <option value="Satélite">Satélite</option>
          </select>
        `;
        return div;
      }
    });

    this.map.addControl(new ThemeControl({ position: 'bottomleft' }));

    setTimeout(() => {
      const select = document.getElementById('map-theme') as HTMLSelectElement;
      if (select) {
        select.value = this.temaAtual;
        select.addEventListener('change', () => {
          this.mudarTema(select.value as TemaMapa);
        });
      }
    }, 0);

    this.markersLayer = L.markerClusterGroup();
    this.markersLayer.on('clusterclick', (a: any) => {
      const markers: OcorrenciaMarker[] = a.layer.getAllChildMarkers() as OcorrenciaMarker[];
      const ocorrenciasCluster = markers.map(m => m.ocorrencia);
      if (ocorrenciasCluster.length) {
        this.abrirCluster(ocorrenciasCluster);
      }
    });

    this.map.addLayer(this.markersLayer);
  }

  mudarTema(tema: TemaMapa) {
    if (this.currentLayer) this.map.removeLayer(this.currentLayer);
    this.currentLayer = this.baseLayers[tema];
    this.currentLayer.addTo(this.map);
    this.temaAtual = tema;
    localStorage.setItem('temaMapa', tema);
  }



  private carregarBairrosGeoJson() {
    const tipoVia = (nome: string) => {
      if (!nome) return 'Desconhecido';
      const upper = nome.toUpperCase().trim();
      if (upper.startsWith('RUA ')) return 'Rua';
      if (upper.startsWith('AVENIDA ') || upper.startsWith('AV ')) return 'Avenida';
      if (upper.startsWith('TRAVESSA ')) return 'Travessa';
      if (upper.startsWith('ALAMEDA ')) return 'Alameda';
      return 'Outro';
    };

    fetch('assets/formosa.geojson')
      .then(res => res.json())
      .then((data: any) => {
        if (!data?.features?.length) {
          console.error('GeoJSON inválido ou vazio');
          this.showToast('GeoJSON inválido ou vazio.');
          return;
        }

        // Cria camada dos bairros
        const geoLayer = L.geoJSON(data, {
          style: () => ({ color: 'green', weight: 2, fillOpacity: 0.15 }),
          onEachFeature: (feature: any, layer: L.Layer) => {
            const nome = feature.properties?.NOME || feature.properties?.BAIRRO || feature.properties?.name || 'Sem Nome';
            const tipo = tipoVia(nome);

            layer.bindPopup(`<b>${nome}</b><br>Tipo: ${tipo}`);

            const pathLayer = layer as L.Path;
            const bairroObj = { nome, ativo: true, layer: pathLayer };
            this.bairros.push(bairroObj);

            pathLayer.on('click', () => {
              bairroObj.ativo = !bairroObj.ativo;
              pathLayer.setStyle({ color: bairroObj.ativo ? 'green' : 'gray', weight: 2, fillOpacity: 0.15 });
              this.showToast(`${bairroObj.nome} ${bairroObj.ativo ? 'ativado' : 'desativado'}`);
            });
          }
        }).addTo(this.map);

        this.map.fitBounds(geoLayer.getBounds());

        // Generates occurrences only within Formosa
        this.gerarOcorrenciasFormosa(data.features);
      })
      .catch(err => {
        console.error('Erro ao carregar GeoJSON:', err);
        this.showToast('Erro ao carregar mapa de bairros.');
      });
  }

/**
* Generates occurrences only within the CEP/Formosa
*/
  private gerarOcorrenciasFormosa(features: any[]) {
    const novasOcorrencias: Ocorrencia[] = [];

    for (const feature of features) {
      const bairroNome = feature.properties?.NOME || feature.properties?.BAIRRO || feature.properties?.name || 'Sem Nome';
      let novas = 0;
      let tentativas = 0;
      const maxTentativas = 50;

      while (novas < 5 && tentativas < maxTentativas) {
        tentativas++;
        const point = turf.randomPoint(1, { bbox: turf.bbox(feature) }).features[0];

       // Check if the point is inside the neighborhood polygon
        if (!turf.booleanPointInPolygon(point, feature)) continue;

        novasOcorrencias.push({
          id: Date.now() + novas + tentativas,
          descricao: `Ocorrência em ${bairroNome}`,
          solicitante: ['Ana', 'João', 'Carlos', 'Maria'][Math.floor(Math.random() * 4)],
          categoria: ['Energia', 'Clima', 'Infraestrutura', 'Trânsito'][Math.floor(Math.random() * 4)],
          status: ['PENDENTE_APROVACAO', 'ABERTO', 'EM_ANDAMENTO', 'FINALIZADO'][Math.floor(Math.random() * 4)] as any,
          lat: point.geometry.coordinates[1],
          lng: point.geometry.coordinates[0],
          setor: 'CLIMA',
          bairro: bairroNome,
          nova: true,
          emTrabalho: false,
          imagemUrl: 'https://img.icons8.com/color/96/marker.png'
        });

        novas++;
      }
    }

    this.ocorrencias.push(...novasOcorrencias);
    if (novasOcorrencias.length) this.showToast(`${novasOcorrencias.length} ocorrências geradas dentro de Formosa-GO`);
    this.aplicarFiltros();
  }

  // --- Drawer / filtros ---
  onTouchStart(event: TouchEvent) { this.startY = event.touches[0].clientY; }
  onTouchMove(event: TouchEvent) {
    const drawer = (event.currentTarget as HTMLElement)?.parentElement as HTMLElement;
    if (!drawer) return;
    const deltaY = this.startY - event.touches[0].clientY;
    let newHeight = this.currentHeight + deltaY;
    newHeight = Math.min(Math.max(80, newHeight), this.maxHeight);
    drawer.style.height = `${newHeight}px`;
  }
  onTouchEnd(event: TouchEvent) {
    const drawer = (event.currentTarget as HTMLElement)?.parentElement as HTMLElement;
    if (!drawer) return;
    const height = parseFloat(drawer.style.height);
    this.currentHeight = height > this.maxHeight / 2 ? this.maxHeight : 80;
    this.renderer.setStyle(drawer, 'height', `${this.currentHeight}px`);
    this.mostrarFiltros = this.currentHeight === this.maxHeight;
  }
  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
    this.currentHeight = this.mostrarFiltros ? this.maxHeight : 80;
    const drawer = document.querySelector('#drawer') as HTMLElement;
    if (drawer) this.renderer.setStyle(drawer, 'height', `${this.currentHeight}px`);
  }



  irParaMinhaLocalizacao() {
    if (!navigator.geolocation) {
      this.showToast('Geolocalização não suportada pelo navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;

        // Centraliza mapa no ponto do usuário
        this.map.setView([lat, lng], 17, { animate: true });

        // Ícone customizado do usuário
        const userIcon = L.divIcon({
          className: 'marker-div',
          html: `<div class="pulse-marker"><span class="pulse-inner">👤</span></div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -36]
        });

        // Cria/atualiza marcador
        if (this.userMarker) {
          this.userMarker.setLatLng([lat, lng]);
        } else {
          this.userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(this.map);
        }

        // Remove círculo de precisão anterior, se existir
        if (this.precisionCircle) {
          this.map.removeLayer(this.precisionCircle);
        }

        // Adiciona círculo de precisão (azul semi-transparente)
        this.precisionCircle = L.circle([lat, lng], {
          radius: accuracy,
          color: 'blue',
          fillColor: '#3b82f6',
          fillOpacity: 0.15
        }).addTo(this.map);

        // Popup com informações e ocorrências próximas
        const ocorrenciasProximas = this.getOcorrenciasProximas(lat, lng, 500); // raio 500m
        const popupHtml = `
        <div class="text-sm">
          <strong>Você está aqui</strong><br>
          Precisão: ${Math.round(accuracy)}m<br>
          Ocorrências próximas: <br>
          <ul class="list-disc ml-4">
            ${ocorrenciasProximas.length > 0
            ? ocorrenciasProximas.map(o => `<li>${o.nome} (${o.distancia}m)</li>`).join('')
            : '<li>Nenhuma ocorrência encontrada</li>'}
          </ul>
        </div>
      `;

        this.userMarker.bindPopup(popupHtml).openPopup();
      },
      (err) => {
        let msg = 'Não foi possível obter sua localização.';
        if (err.code === err.PERMISSION_DENIED) msg = 'Permissão negada pelo usuário.';
        if (err.code === err.POSITION_UNAVAILABLE) msg = 'Localização indisponível.';
        if (err.code === err.TIMEOUT) msg = 'Tempo de requisição expirado.';
        this.showToast(msg);
        console.error(err);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }


/**
* Just an example of calculating nearby occurrences.
* This will be adapted to fetch from your backend or from the in-memory list.
*/
  getOcorrenciasProximas(lat: number, lng: number, raioMetros: number) {
    const R = 6371e3; // raio da Terra em metros

    // Exemplo estático (simulando ocorrências no mapa)
    const ocorrencias = [
      { nome: 'Ocorrência A', lat: lat + 0.001, lng: lng },
      { nome: 'Ocorrência B', lat: lat - 0.001, lng: lng - 0.001 }
    ];

    return ocorrencias
      .map(o => {
        const dLat = (o.lat - lat) * Math.PI / 180;
        const dLng = (o.lng - lng) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 +
          Math.cos(lat * Math.PI / 180) *
          Math.cos(o.lat * Math.PI / 180) *
          Math.sin(dLng / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distancia = R * c;
        return { ...o, distancia: Math.round(distancia) };
      })
      .filter(o => o.distancia <= raioMetros);
  }

  irParaOcorrencia(o: Ocorrencia, abrirModal = false) {
    if (!this.map) return;

    // Marca como em trabalho e não é mais nova
    o.emTrabalho = true;
    o.nova = false;
    this.aplicarFiltros();
    this.mostrarClusterModal = false;

    if (abrirModal) {
      this.selectedOcorrencia = o;
      this.mostrarModal = true;
    }

  
    const criarIcone = (cor: string, tamanho = 40, conteudo?: string) => L.divIcon({
      className: 'marker-div',
      html: `<span style="
      background-color:${cor};
      width:${tamanho}px;height:${tamanho}px;
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      color:white;font-weight:bold;font-size:${Math.round(tamanho / 2.5)}px;
      border:3px solid white;
      box-shadow:0 0 8px rgba(0,0,0,0.3);
    ">${conteudo || o.solicitante[0].toUpperCase()}</span>`,
      iconSize: [tamanho, tamanho],
      iconAnchor: [tamanho / 2, tamanho],
      popupAnchor: [0, -tamanho]
    });

    
    this.map.flyTo([o.lat, o.lng], 16, { animate: true, duration: 1.5 });

    
    const marker = this.markersLayer.getLayers()
      .find((m: any) => m.ocorrencia?.id === o.id);

    if (marker) {
      const originalIcon = marker.getIcon();
      marker.setIcon(criarIcone('#f43f5e', 40));
      setTimeout(() => marker.setIcon(originalIcon), 1500);
    }
  }


  aplicarFiltros() {
    this.markersLayer.clearLayers();

    const filtradas = this.ocorrencias
      .filter(o => this.isAdminMaster || o.setor === this.usuarioSetor)
      .filter(o =>
        (!this.filtros.busca || o.descricao.toLowerCase().includes(this.filtros.busca.toLowerCase()) || o.solicitante.toLowerCase().includes(this.filtros.busca.toLowerCase())) &&
        (!this.filtros.categoria || o.categoria.toLowerCase().includes(this.filtros.categoria.toLowerCase())) &&
        (!this.filtros.status || o.status === this.filtros.status) &&
        (!this.filtros.bairro || o.bairro === this.filtros.bairro)
      );

    const markers: L.Marker[] = [];
    filtradas.forEach(o => {
      const icon = L.divIcon({
        className: 'marker-div',
        html: `<span style="
        background-color:${this.statusColors[o.status]};
        width:36px;height:36px;border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        color:white;font-weight:bold;font-size:14px;
        border:2px solid white;
      ">${o.emTrabalho ? '⚑' : (o.nova ? '!' : o.solicitante[0].toUpperCase())}</span>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
      });

      const marker: OcorrenciaMarker = L.marker([o.lat, o.lng], { icon }) as OcorrenciaMarker;
      marker.ocorrencia = o;

      marker.on('click', () => {
        this.map.setView([o.lat, o.lng], 16, { animate: true });
        this.selectedOcorrencia = o;
        this.mostrarModal = true;
        o.emTrabalho = true;
        o.nova = false;

       
        const newIcon = L.divIcon({
          className: 'marker-div',
          html: `<span style="
          background-color:${this.statusColors[o.status]};
          width:36px;height:36px;border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          color:white;font-weight:bold;font-size:14px;
          border:2px solid white;
        ">⚑</span>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -36]
        });
        marker.setIcon(newIcon);
      });

      this.markersLayer.addLayer(marker);
      markers.push(marker);
    });

    
    if (!this.mostrarModal && markers.length) {
      const group = L.featureGroup(markers);
      this.map.fitBounds(group.getBounds().pad(0.2));
    }
  }


  abrirCluster(ocorrencias: Ocorrencia[]) {
    this.ocorrenciasDoCluster = [...ocorrencias];
    this.clusterScrollIndex = 0;
    this.ocorrenciasClusterVisiveis = [];
    this.mostrarClusterModal = true;

    const agrupadas: Record<string, Ocorrencia[]> = {};
    this.ocorrenciasDoCluster.forEach(o => {
      if (!agrupadas[o.solicitante]) agrupadas[o.solicitante] = [];
      agrupadas[o.solicitante].push(o);
    });

    this.ocorrenciasPorSolicitante = Object.entries(agrupadas).map(([solicitante, ocorrencias]) => ({
      solicitante,
      ocorrencias,
      mostrarDetalhes: false
    }));

    this.carregarMaisCluster();

    setTimeout(() => {
      const modal = document.getElementById('clusterModal');
      modal?.focus();
    }, 0);
  }

  carregarMaisCluster() {
    if (this.loadingCluster) return;
    this.loadingCluster = true;
    const next = this.ocorrenciasDoCluster.slice(this.clusterScrollIndex, this.clusterScrollIndex + 10);
    this.ocorrenciasClusterVisiveis.push(...next);
    this.clusterScrollIndex += next.length;
    this.loadingCluster = false;
  }

  fecharClusterModal() {
    this.mostrarClusterModal = false;
    this.ocorrenciasDoCluster = [];
    this.ocorrenciasClusterVisiveis = [];
    this.clusterScrollIndex = 0;
  }

  onScrollCluster(event: any) {
    const target = event.target;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
      if (this.clusterScrollIndex < this.ocorrenciasDoCluster.length) {
        this.carregarMaisCluster();
      }
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.mostrarClusterModal) this.fecharClusterModal();
  }

  showToast(msg: string) {
    this.toasts = [msg];
    setTimeout(() => this.toasts.shift(), 4000);
  }

  fecharModal() {
    this.mostrarModal = false;
    this.selectedOcorrencia = null;
    this.aplicarFiltros();
  }

  marcarEmTrabalho(o: Ocorrencia) {
    o.emTrabalho = true;
    o.nova = false;
    this.showToast(`Você começou a trabalhar na ocorrência: ${o.descricao}`);
    this.aplicarFiltros();
    this.fecharModal();
  }
}
